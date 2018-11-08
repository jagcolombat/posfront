import { User } from './user.model';

export interface Auth {
    user: User;
    pending: boolean;
}
