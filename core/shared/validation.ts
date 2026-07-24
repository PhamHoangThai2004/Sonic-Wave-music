export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6;
}

export function isValidName(name: string): boolean {
  return typeof name === "string" && name.trim().length > 2;
}

export function isValidOtp(otp: string): boolean {
  return typeof otp === "string" && otp.length === 6 && /^\d+$/.test(otp);
}