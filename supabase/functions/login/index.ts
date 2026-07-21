// deno-lint-ignore-file
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  BadRequest,
  MethodNotAllowed,
  Unauthorized,
} from "../../../core/exceptions/http-error.ts";
import { handleError, success } from "../../../core/responses/response.ts";
import { LoginRequest } from "../../../core/requests/login-request.ts";
import { LoginResponse } from "../../../core/requests/login-response.ts";
Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      throw new MethodNotAllowed();
    }
    
    let body;

    try {
      body = await req.json();
    } catch {
      throw new BadRequest("Invalid JSON body");
    }

    const { email, password } = body;
    const loginRequest = new LoginRequest(email, password);
    const emailError = loginRequest.emailError;
    const passwordError = loginRequest.passwordError;

    if (emailError) {
      throw new BadRequest(emailError);
    }

    if (passwordError) {
      throw new BadRequest(passwordError);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginRequest.email,
      password: loginRequest.password,
    });

    if (error || !data.session) {
      throw new Unauthorized("Invalid email or password");
    }

    const loginResponse: LoginResponse = {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    return success(
      loginResponse,
      "Login successful",
    );
  } catch (e) {
    return handleError(e);
  }
});
