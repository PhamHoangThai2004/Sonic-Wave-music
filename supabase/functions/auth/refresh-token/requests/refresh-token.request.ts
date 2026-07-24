import { BadRequest } from "../../../../../core/exceptions/http-error.ts";
import { Messages } from "../../../../../core/shared/constrain.ts";

export class RefreshTokenRequest {
    refreshToken: string;

    constructor(refreshToken: string | null) {
      const token = refreshToken?.trim();
      if (!token) {
        throw new BadRequest(Messages.TOKEN_NOT_EMPTY);
      } else {
        this.refreshToken = token;
      }
    }
}
