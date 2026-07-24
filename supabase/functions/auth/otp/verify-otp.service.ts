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
import { VerifyOtpRequest } from "./requests/verify-otp.request.ts";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

export async function handleVerifyOtp(req: Request) {
  try {
    if (!MethodRequest.isPost(req.method)) {
      throw new MethodNotAllowed();
    }

    let body;
    try {
      body = await req.json();
    } catch {
      throw new BadRequest(Messages.PLS_ENTER_INFO);
    }

    const { email, otp, type } = body;
    const verifyOtpRequest = new VerifyOtpRequest(email, otp, type);

    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email: verifyOtpRequest.email,
      token: verifyOtpRequest.otp,
      type: verifyOtpRequest.type,
    });

    if (error || !data.user) {
      const message =
        error?.code === "otp_expired"
          ? Messages.INVALID_OTP_EXPIRED
          : error?.message || Messages.INVALID_OTP_EXPIRED;

      throw new Unauthorized(message);
    }

    const now = new Date().toISOString();
    const { error: dbError } = await supabaseAdmin
      .from("accounts")
      .update({
        verified_at: now,
        updated_at: now,
      })
      .eq("id", data.user.id);

    if (dbError) {
      throw new BadRequest(dbError.message);
    }

    return success(Messages.VERIFIED_SUCCESS);
  } catch (e) {
    return handleError(e);
  }
}