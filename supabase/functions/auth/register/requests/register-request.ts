import { BadRequest } from "../../../../../core/exceptions/http-error.ts";
import { Messages } from "../../../../../core/shared/constrain.ts";
import { validateEmail, validateName, validatePassword } from "../../../../../core/utils/validate-utils.ts";

export class RegisterRequest {
    name: string;
    email: string;
    password: string;

    constructor(name: string | null, email: string | null, password: string | null) {
      if (!name || !email || !password) {
        if (!name) {
          throw new BadRequest(Messages.NAME_NOT_EMPTY);
        }
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
      this.name = name.trim();
      this.email = email.trim();
      this.password = password.trim();
    }

    get emailError() {
        return validateEmail(this.email);
    }

    get passwordError() {
        return validatePassword(this.password);
    }

    get nameError() {
        return validateName(this.name);
    }
}
