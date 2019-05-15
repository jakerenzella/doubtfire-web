import { Resource } from './resource';
import { ResourceService } from '../resource.service';
import { HttpClient } from '@angular/common/http';
import { DoubtfireConstants } from 'src/app/config/constants/doubtfire-constants';

export class DiscussionComment extends Resource {
  name: string;
  email: string;
  phone: number;
}

export class DiscussionCommentService extends ResourceService<DiscussionComment> {
  constructor(httpClient: HttpClient,
    constants: DoubtfireConstants) {
    super(
      httpClient,
      'discussion_comments',
      constants);
  }
}
