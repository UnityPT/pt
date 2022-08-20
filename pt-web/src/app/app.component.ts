import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from "./api.service";
import {Router} from "@angular/router";
import {IParticlesProps} from "ng-particles/lib/ng-particles.module";
import {ClickMode, Engine, HoverMode, MoveDirection, OutMode} from "tsparticles-engine";
import {loadFull} from "tsparticles";

// 取数据
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user_stat_published = 0;
  email = "@";

  constructor(public api: ApiService, public router: Router) {
  }

  logout() {
    localStorage.removeItem('username');
    this.api.username = '';
    this.router.navigate(['login']);
  }

  id = "tsparticles";
  particlesOptions: IParticlesProps = {
    preset: "stars",
    background: {
      color: {
        value: "#fafafa"
      }
    },
    fpsLimit: 120,
    // fullScreen: {
    //   zIndex: -100
    // },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: HoverMode.grab
        },
        // resize: true
      },
      modes: {
        grab: {
          distance: 100,
          links: {
            opacity: 1
          }
        }
      }
    },
    particles: {
      color: {
        value: "#3f51b5"
      },
      links: {
        color: "#000000",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1
      },
      // collisions: {
      //   enable: true
      // },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce
        },
        random: false,
        speed: 1,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 80
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: "circle"
      },
      size: {
        value: {min: 1, max: 5},
      }
    },
    detectRetina: true,
    style: {top: '64px', bottom: '0', height: 'calc(100% - 64px)'}
  };

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
}

declare global {
  interface Window {
    electronAPI: {
      import: (path: string) => Promise<void>;
    };
  }
}

