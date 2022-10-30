import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  async submit() {
    try {
      await this.api.login(this.username, this.password);
      this.router.navigate(['resource']);
    } catch {
      alert('登录失败');
    }
  }
}
