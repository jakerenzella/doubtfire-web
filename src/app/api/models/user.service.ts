import { ResourceService } from '../resource.service';
import { HttpClient } from '@angular/common/http';
import { DoubtfireConstants } from 'src/app/config/constants/doubtfire-constants';
import { User } from './user';
import { UserSerializer } from './user.serializer';

export class UserService extends ResourceService<User> {
  constructor(httpClient: HttpClient) {
    super(
      httpClient,
      'users',
      new UserSerializer(),
      new DoubtfireConstants(httpClient));
  }
}
