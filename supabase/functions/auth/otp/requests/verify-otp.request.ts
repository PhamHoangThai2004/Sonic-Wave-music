import { BadRequest } from "../../../../../core/exceptions/http-error.ts";
import { Messages } from "../../../../../core/shared/constrain.ts";
import { validateEmail, validateOtp } from "../../../../../core/utils/validate-utils.ts";
import { isSignup } from "../enums/otp-type.enum.ts";

export class VerifyOtpRequest {
    email: string;
    otp: string;
    type: string;

    constructor(email: string | null, otp: string | null, type: string) {
      if (!email || !otp || !type) {
        if (!email) {
          throw new BadRequest(Messages.EMAIL_NOT_EMPTY);
        }
        if (!otp) {
          throw new BadRequest(Messages.OTP_NOT_EMPTY);
        }
        if (!type) {
          throw new BadRequest(Messages.OTP_TYPE_NOT_EMPTY);
        }
      }
      else {
        const emailError = validateEmail(email);
        if (emailError) {
          throw new BadRequest(emailError);
        }

        const otpError = validateOtp(otp);
        if (otpError) {
          throw new BadRequest(otpError);
        }

        if (!isSignup(type)) {
          throw new BadRequest(Messages.INVALID_OTP_TYPE);
        }
      }
      this.email = email.trim();
      this.otp = otp.trim();
      this.type = type;
    }

    get emailError() {
        return validateEmail(this.email);
    }

    get otpError() {
        return validateOtp(this.otp);
    }
}
