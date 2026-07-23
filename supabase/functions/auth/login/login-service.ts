// deno-lint-ignore-file
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  BadRequest,
  MethodNotAllowed,
  Unauthorized,
} from "../../../../core/exceptions/http-error.ts";
import { handleError, success } from "../../../../core/responses/response.ts";
import { LoginResponse } from "../../../../core/responses/login-response.ts";
import { LoginRequest } from "../../../../core/requests/login-request.ts";
import { MethodRequest } from "../../../../core/utils/method-request.ts";
import { Messages } from "../../../../core/shared/constrain.ts";

export async function handleLogin(req: Request) {
  try {
    if (MethodRequest.isGet(req.method)) {
      throw new MethodNotAllowed();
    }

    let body;

    try {
      body = await req.json();
    } catch {
      throw new BadRequest(Messages.PLS_ENTER_INFO);
    }

    const { email, password } = body;
    const loginRequest = new LoginRequest(email, password);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginRequest.email,
      password: loginRequest.password,
    });

    if (error || !data.session) {
      throw new Unauthorized(Messages.INVALID_CREDENTIALS);
    }

    const loginResponse: LoginResponse = {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    return success(loginResponse, Messages.LOGIN_SUCCESS);
  } catch (e) {
    return handleError(e);
  }
}
