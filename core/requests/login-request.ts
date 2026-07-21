import { validateEmail, validatePassword } from "../utils/validate-utils.ts";

export class LoginRequest {
    email: string;
    password: string;

    constructor(email: string, password: string) {
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
