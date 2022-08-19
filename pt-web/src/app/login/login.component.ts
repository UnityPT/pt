import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {ClickMode, Container, Engine, HoverMode, MoveDirection, OutMode} from "tsparticles-engine";
import {loadFull} from "tsparticles";
import {IParticlesProps} from "ng-particles/lib/ng-particles.module";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';



  constructor(private api: ApiService, private router: Router) {
  }

  ngOnInit(): void {
    //
    // const x = 1;
    // throw new Error('xxx');
    // const y = 2;

  }

  async submit() {
    try {
      await this.api.login(this.username, this.password);
      this.router.navigate(['resource'])
    } catch {
      alert('登录失败');
    }
  }


}
