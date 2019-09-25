import { Resource } from '../models/resource';

export class User extends Resource {
  // id is inherited from Resource
  name: string;
}
