import { User } from '../../api/models/user/user';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUser {
  role: string = 'anon';
  id: number = 0;
  authenticationToken: string;
  profile = new User({
    name: 'Anonymous',
    nickname: 'anon'
  });
}
