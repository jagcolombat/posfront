import {IEmployeedModel} from './employeed.model';

export interface Credentials {
  username: string;
  password?: string;
  newPassword?: string;
  newPasswordByCard?: string;
}

export class CredentialsModel implements Credentials {
  constructor(public username: string, public password?: string, public newPassword?: string, public newPasswordByCard?: string) {}
}
