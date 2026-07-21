import { isValidEmail, isValidPassword } from "../shared/validation.ts";

export function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required";
  }
  if (!isValidEmail(email)) {
    return "Invalid email format";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required";
  }
  if (!isValidPassword(password)) {
    return "Password must be at least 6 characters long";
  }
  return null;
}