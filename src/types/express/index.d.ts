import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';

declare namespace Express {
  export interface Request {
    user?: UserAuthenticatedData;
  }
}
