import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { IParticlesProps } from 'ng-particles/lib/ng-particles.module';
import { Engine, HoverMode, MoveDirection, OutMode } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { FileStat } from 'webdav';
import { DirItem } from './types';
import { Buffer } from 'buffer';
import createTorrent from 'create-torrent';
import * as path from 'path';

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
    console.log(new URL('smb://10.198.11.1/shared/e').pathname);
  }
}

declare global {
  interface Window {
    electronAPI: {
      import: (origin: string, pathname: string) => Promise<void>;
      store_get: (key: string, defaultValue?: any) => Promise<any>;
      store_set: (key: string, value: any) => Promise<void>;
      relaunch: () => Promise<void>;
      on: (channel: string, func: (event: any, data: any) => void) => void;
      create_connect: () => Promise<void>;
      get_list: (path: string, type: 'd' | 'f') => Promise<DirItem[] | string[]>;
      get_file: (infoHash: string, filename: string) => Promise<void>;
      upload_file: (path: string, filename: string) => Promise<void>;
      extra_field: (path: string) => Promise<string>;
      create_torrent: (filepath: string, opts: any) => Promise<any>;
      smb_connect: () => Promise<void>;
      smb_browse: () => Promise<string>;
      connect_test: (protocol: 'local' | 'sftp' | 'smb' | 'webdav', configMapElement: any) => Promise<void>;
      delete_file: (content_path: string) => Promise<void>;
      url_pathname: (url: string) => Promise<any>;
    };
  }
}
