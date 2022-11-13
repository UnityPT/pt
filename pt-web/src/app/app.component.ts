import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { IParticlesProps } from 'ng-particles/lib/ng-particles.module';
import { Engine, HoverMode, MoveDirection, OutMode } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

// 取数据
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public api: ApiService, public router: Router) {}

  logout() {
    this.api.logout();
    this.router.navigate(['login']);
  }

  id = 'tsparticles';
  particlesOptions: IParticlesProps = {
    preset: 'stars',
    background: {
      color: {
        value: '#fafafa',
      },
    },
    fpsLimit: 120,
    // fullScreen: {
    //   zIndex: -100
    // },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: HoverMode.grab,
        },
        // resize: true
      },
      modes: {
        grab: {
          distance: 100,
          links: {
            opacity: 1,
          },
        },
      },
    },
    particles: {
      color: {
        value: '#3f51b5',
      },
      links: {
        color: '#000000',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      // collisions: {
      //   enable: true
      // },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
    style: { top: '64px', bottom: '0', height: 'calc(100% - 64px)' },
  };

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
  //
  async test1() {
    const res = await window.electronAPI.create_ssh();
    console.log(res);
  }
  async test2() {
    // console.log(await window.electronAPI.create_ssh());
    // await window.electronAPI.get_file('./pt/testdir/202107161430.mp4', 'test.mp4', 'test_hash');
    // await window.electronAPI.on_get_file_progress((event, data) => {
    //   console.log(data);
    // });
  }
}

declare global {
  interface Window {
    electronAPI: {
      import: (origin: string, pathname: string, platform: string) => Promise<void>;
      store_get: (key: string, defaultValue?: any) => Promise<any>;
      store_set: (key: string, value: any) => Promise<void>;
      create_ssh: () => Promise<boolean>;
      get_file: (infoHash: string, filename: string) => Promise<void>;
      relaunch: () => Promise<void>;
      on_get_file_progress: (callback: (event: any, data: any) => void) => Promise<void>;
    };
  }
}
