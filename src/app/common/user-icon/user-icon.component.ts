import { Component, OnInit, Input, Inject } from '@angular/core';
// import {  } from 'src/app/ajs-upgraded-providers';
import { Md5 } from 'node_modules/ts-md5/dist/md5';
import { CurrentUser } from 'src/app/sessions/current-user/current-user';

@Component({
  selector: 'user-icon',
  templateUrl: 'user-icon.component.html',
  styleUrls: ['user-icon.component.scss']
})
export class UserIconComponent implements OnInit {
  @Input() user: any;
  @Input() email: string;
  @Input() size: number;

  constructor(
    private currentUser: CurrentUser) {
  }

  get userBackgroundStyle() {
    const hash = this.email ? Md5.hashStr(this.email.trim().toLowerCase()) : Md5.hashStr('');
    return `https://www.gravatar.com/avatar/${hash}.png?default=blank&size=${this.size}`;
  }

  get initials() {
    const initials = (this.user && this.user.name) ? this.user.name.split(' ') : '??';
    if (initials.length > 1) {
      return (`${initials[0][0]}${initials[1][0]}`).toUpperCase();
    } else if (initials.length === 1) {
      return initials[0][0].toUpperCase();
    } else {
      return '??';
    }
  }

  ngOnInit() {
  }
}
