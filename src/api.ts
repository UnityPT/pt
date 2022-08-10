import assert from 'assert';
import {Resource} from './resource.js';
import fetch from 'electron-fetch';
import FormData from 'form-data';
import {session} from 'electron';

export async function login(username: string, password: string) {
  const body = new FormData();
  body.append('username', username);
  body.append('password', password);
  const response = await fetch('https://pt.lolo.moe/login.php', {
    method: 'POST',
    body,
    redirect: 'manual',
    session: session.defaultSession,
    useSessionCookies: true
  });
  if (response.status !== 204) {
    throw new Error(await response.text());
  }
}

export async function index(): Promise<Resource[]> {
  return (await fetch('https://pt.lolo.moe/index.php?a=3', {
    session: session.defaultSession,
    useSessionCookies: true
  })).json();
}

export async function upload(torrent: Buffer, description: string, filename: string): Promise<Buffer> {
  const body = new FormData();
  body.append('torrent', torrent, filename);
  body.append('description', description);

  const response = await fetch('https://pt.lolo.moe/upload.php', {
    method: 'POST',
    body,
    session: session.defaultSession,
    useSessionCookies: true
  });
  if (response.headers.get('Content-Type') !== 'application/octet-stream') {
    throw new Error(await response.text());
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function download(torrent_id: number): Promise<Buffer> {
  const url = new URL('https://pt.lolo.moe/download.php');
  url.searchParams.append('id', torrent_id.toString());
  const response = await fetch(url.href, {
    session: session.defaultSession,
    useSessionCookies: true
  });
  if (response.headers.get('Content-Type') !== 'application/octet-stream') {
    throw new Error(await response.text());
  }
  return Buffer.from(await response.arrayBuffer());
}
