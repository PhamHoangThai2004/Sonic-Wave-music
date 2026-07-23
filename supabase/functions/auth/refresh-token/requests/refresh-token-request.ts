import { BadRequest } from "../../../../../core/exceptions/http-error.ts";
import { Messages } from "../../../../../core/shared/constrain.ts";

export class RefreshTokenRequest {
    refreshToken: string;

    constructor(refreshToken: string | null) {
      if (!refreshToken) {
        throw new BadRequest(Messages.TOKEN_NOT_EMPTY);
      } else {
        this.refreshToken = refreshToken.trim();
      }
    }
}
