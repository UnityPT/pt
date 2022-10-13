import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {RegisterInfo} from "../types";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: RegisterInfo = {
    username: '',
    password: '',
    password_again: '',
    email: '',
    invitation: ''

  }

  constructor(private api: ApiService, private router: Router) {
  }

  ngOnInit(): void {
  }

  async submit() {
    try {
      const res = await this.api.register(this.user);
      if (res == 'success') {
        await this.api.login(this.user.username,this.user.password);
        this.router.navigate(['resource']);
      }
    } catch {
      alert('注册失败');
    }
  }

}
