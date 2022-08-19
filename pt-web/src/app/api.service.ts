import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {Resource, ResourceMeta, User} from "./types";
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'https://pt.lolo.moe';
  //baseUrl = 'https://frogeater.vip';
  username = localStorage.getItem('username');
  curPage =  '';

  // password = 'simpletracker';
  constructor(private http: HttpClient,private router:Router) {
    this.router.events.subscribe((data)=>{
      if(data instanceof NavigationEnd)
      {
        this.curPage = data.url;
      }
    });
  }

  async login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    await firstValueFrom(this.http.post(this.url("login"), formData, {
      responseType: "text",
      withCredentials: true
    }));
    this.setUser(username);
  }

  setUser(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  async index(forceRefresh = false): Promise<ResourceMeta[]> {
    const url = new URL(this.url('index'));
    if (forceRefresh) {
      url.searchParams.append('t', Date.now().toString());
    }
    return (await lastValueFrom(this.http.get<Resource[]>(url.href, {withCredentials: true}))).map((resource => ({
      resource,
      meta: JSON.parse(resource.description)
    })));
  }

  async upload(torrent: Uint8Array, description: string, filename: string): Promise<Blob> {
    const body = new FormData();
    body.append('torrent', new Blob([torrent]), filename);
    body.append('description', description);

    return (await firstValueFrom(this.http.post(this.url("upload"), body, {
      withCredentials: true,
      responseType: 'blob'
    })));
  }

  download(id: number): Promise<Blob> {
    return lastValueFrom(this.http.get(this.url('download'), {
      params: {id: id.toString()},
      responseType: 'blob',
      withCredentials: true
    }));
  }

  url(method: string) {
    return `${this.baseUrl}/${method}.php`;
  }

  async register(user: User) {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('password_again', user.password_again);
    formData.append('email', user.email);
    formData.append('invitation', user.invitation);
    await firstValueFrom(this.http.post(this.url('register'), formData, {
      responseType: "text",
      withCredentials: true
    }));
    this.setUser(user.username);
  }

  invitations(email: string) {
    const formData = new FormData();
    formData.append('email', email);
    return firstValueFrom(this.http.post(this.url('invitations'), formData, {
      responseType: "text",
      withCredentials: true
    }));
  }

  showParticles() {
    return !this.username && this.curPage != "/help";
  }
}
