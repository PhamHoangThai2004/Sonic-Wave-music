import { Messages } from "../shared/constrain.ts";
import { isValidEmail, isValidPassword } from "../shared/validation.ts";

export function validateEmail(email: string): string | null {
  if (!email) {
    return Messages.EMAIL_NOT_EMPTY;
  }
  if (!isValidEmail(email)) {
    return Messages.INVALID_EMAIL;
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return Messages.PASSWORD_NOT_EMPTY;
  }
  if (!isValidPassword(password)) {
    return Messages.INVALID_PASSWORD;
  }
  return null;
}