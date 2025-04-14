import { UserSessionsExceptionMessages } from 'src/domain/contexts/sessions/aggregate/exceptions/user-sessions-exceptions.enum';
import { CustomError } from './configuration/custom-error.config';
import { ErrorCodes } from './configuration/enums/error-codes.enum';
import { ErrorTypes } from './configuration/enums/error-types.enum';

export class UnauthorizedException extends CustomError {
  constructor() {
    super(
      UserSessionsExceptionMessages.NOT_AUTHENTICATED,
      ErrorCodes.UNAUTHORIZED,
      ErrorTypes.UNAUTHORIZED_OPERATION,
    );
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}
