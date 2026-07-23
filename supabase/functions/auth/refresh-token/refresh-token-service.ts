// deno-lint-ignore-file
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  BadRequest,
  MethodNotAllowed,
  Unauthorized,
} from "../../../../core/exceptions/http-error.ts";
import { handleError, success } from "../../../../core/responses/response.ts";
import { MethodRequest } from "../../../../core/utils/method-request.ts";
import { Messages } from "../../../../core/shared/constrain.ts";
import { RefreshTokenRequest } from "./requests/refresh-token-request.ts";
import { LoginResponse } from "../login/responses/login-response.ts";

export async function handleRefreshToken(req: Request) {
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

    const { refreshToken } = body;
    const refreshTokenRequest = new RefreshTokenRequest(refreshToken);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshTokenRequest.refreshToken,
    });

    if (error || !data.session) {
      throw new Unauthorized(Messages.INVALID_TOKEN);
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
