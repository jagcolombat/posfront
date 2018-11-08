import { Injectable } from '@angular/core';
import {users} from '../shared/users-data';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  login(user, pass) {
    return users.filter(u => u.user === user).map(u => {
      if(u.pass === pass) return true; else return false;
    })[0];
  }

}
