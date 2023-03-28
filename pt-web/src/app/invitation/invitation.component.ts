import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {
  email = '@';
  invitation_key = '';
  title = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  async submit() {
    try {
      const ret = await this.api.invitations(this.email);
      if (!ret) return;
      this.invitation_key = ret;
      this.title = '请复制邀请码';
    } catch {
      alert('邀请失败');
    }
  }
}
