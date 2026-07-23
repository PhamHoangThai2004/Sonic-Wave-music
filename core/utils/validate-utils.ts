import { Messages } from "../shared/constrain.ts";
import { isValidEmail, isValidPassword } from "../shared/validation.ts";

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value || value.length === 0) {
    return Messages.EMAIL_NOT_EMPTY;
  }
  if (!isValidEmail(value)) {
    return Messages.INVALID_EMAIL;
  }
  return null;
}

export function validatePassword(password: string): string | null {
  const value = password.trim();
  if (!value || value.length === 0) {
    return Messages.PASSWORD_NOT_EMPTY;
  }
  if (!isValidPassword(value)) {
    return Messages.INVALID_PASSWORD;
  }
  return null;
}