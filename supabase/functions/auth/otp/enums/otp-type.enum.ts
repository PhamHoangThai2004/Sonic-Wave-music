export enum OtpTypeEnum {
  SIGNUP = 'signup',
}

export function isSignup(type: string): boolean {
  return type === OtpTypeEnum.SIGNUP;
}