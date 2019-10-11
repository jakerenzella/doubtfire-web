import { User } from './user';
import { CacheableEntityService } from '../cacheableentity.service';
import { Inject } from '@angular/core';
import { auth, analyticsService } from 'src/app/ajs-upgraded-providers';
import { HttpClient } from '@angular/common/http';
import { CurrentUser } from 'src/app/sessions/current-user/current-user';

export class UserService extends CacheableEntityService<User> {
  protected readonly endpointFormat = 'users/:id:';

  constructor(httpClient: HttpClient,
    private currentUser: CurrentUser,
    // @Inject(auth) private auth: any,
    @Inject(analyticsService) private analyticsService: any,
  ) {
    super(httpClient);
  }

  protected createInstanceFrom(json: any): User {
    let user = new User();
    user.updateFromJson(json);
    return user;
  }

  public keyForJson(json: any): string {
    return json.id;
  }

  // Specific to the User entity
  public save(user: User) {
  //   user.name = `${user.first_name} ${user.last_name}`;
  //   if (user === this.currentUser.profile) {
  //     this.auth.saveCurrentUser();
  //     if (user.opt_in_to_research) {
  //       this.analyticsService.event(
  //         'Doubtfire Analytics',
  //         'User saved'
  //       );
  //     }
  //   }
  // }
  }
}
