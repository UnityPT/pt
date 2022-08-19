import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {
  email: string = '';
  invitation_key = '';
  title = '';

  constructor(private api: ApiService, private router: Router) {
  }

  ngOnInit(): void {
  }

  async submit() {
    try {
      this.invitation_key = await this.api.invitations('@');
      this.title = "请复制邀请码";
    } catch {
      alert('邀请失败');
    }
  }
}
