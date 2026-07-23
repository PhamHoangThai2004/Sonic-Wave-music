import { BadRequest } from "../exceptions/http-error.ts";
import { Messages } from "../shared/constrain.ts";
import { validateEmail, validatePassword } from "../utils/validate-utils.ts";

export class LoginRequest {
    email: string;
    password: string;

    constructor(email: string | null, password: string | null) {
      if (!email || !password) {
        if (!email) {
          throw new BadRequest(Messages.EMAIL_NOT_EMPTY);
        }
        if (!password) {
          throw new BadRequest(Messages.PASSWORD_NOT_EMPTY);
        }
        
      }
      else {
        const emailError = validateEmail(email);
        if (emailError) {
          throw new BadRequest(emailError);
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          throw new BadRequest(passwordError);
        }
      }
      this.email = email.trim();
      this.password = password.trim();
    }

    get emailError() {
        return validateEmail(this.email);
    }

    get passwordError() {
        return validatePassword(this.password);
    }
}
