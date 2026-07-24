// deno-lint-ignore-file
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  BadRequest,
  Conflict,
  MethodNotAllowed,
} from "../../../../core/exceptions/http-error.ts";
import { handleError, success } from "../../../../core/responses/response.ts";
import { MethodRequest } from "../../../../core/utils/method-request.ts";
import { Messages } from "../../../../core/shared/constrain.ts";
import { RegisterRequest } from "./requests/register.request.ts";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, 
);

export async function handleCreateAccount(req: Request) {
  try {
    if (!MethodRequest.isPost(req.method)) {
      throw new MethodNotAllowed();
    }

    let body;
    try {
      body = await req.json();
    } catch {
      throw new BadRequest(Messages.TOKEN_NOT_EMPTY);
    }

    const { email, password, name } = body;
    const registerRequest = new RegisterRequest(name, email, password);

    const { data: existingAccount, error: fetchError } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("email", registerRequest.email)
      .maybeSingle();

    if (fetchError) {
      throw new BadRequest(fetchError.message);
    }

    if (existingAccount) {
      if (existingAccount.verified_at !== null) {
        throw new Conflict(Messages.EMAIL_ALREADY_REGISTERED);
      }

      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        existingAccount.id,
        {
          password: registerRequest.password,
          user_metadata: { display_name: registerRequest.name },
        }
      );

      if (updateAuthError) {
        throw new BadRequest(updateAuthError.message);
      }

      const { error: updateDbError } = await supabaseAdmin
        .from("accounts")
        .update({
          display_name: registerRequest.name,
        })
        .eq("id", existingAccount.id);

      if (updateDbError) {
        throw new BadRequest(updateDbError.message);
      }

      await supabaseAdmin.auth.resend({
        type: "signup",
        email: registerRequest.email,
      });

      return success(
        Messages.REGISTER_SUCCESS
      );
    }
    
    const { data: authData, error: signUpError } = await supabaseAdmin.auth.signUp({
      email: registerRequest.email,
      password: registerRequest.password,
      options: {
        data: { display_name: registerRequest.name },
      },
    });

    if (signUpError || !authData.user) {
      throw new BadRequest(signUpError?.message || Messages.HAVE_ERROR);
    }

    const { error: insertDbError } = await supabaseAdmin
      .from("accounts")
      .insert({
        id: authData.user.id,
        email: registerRequest.email,
        display_name: registerRequest.name,
      });

    if (insertDbError) {
      throw new BadRequest(insertDbError.message);
    }

    return success(
      Messages.REGISTER_SUCCESS
    );

  } catch (e) {
    return handleError(e);
  }
}