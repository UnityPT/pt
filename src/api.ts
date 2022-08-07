import assert from "assert";
import {Resource} from "./resource.js";
import makeFetchCookie from "fetch-cookie";

const fetchCookie = makeFetchCookie(fetch)

export async function login(username: string, password: string) {
    const response = await fetchCookie("https://pt.lolo.moe/login.php", {
        method: "POST",
        body: new URLSearchParams({username, password}),
        redirect: "manual"
    });
    console.log(response.status)
    assert.equal(response.status, 204);
}

export async function index(): Promise<Resource[]> {
    return (await fetchCookie("https://pt.lolo.moe/index.php")).json();
}

export async function upload(torrent: Buffer, description: string, filename: string): Promise<Buffer> {
    const body = new FormData();
    body.set('torrent', new Blob([torrent]), filename);
    body.set('description', description);

    const response = await fetchCookie("https://pt.lolo.moe/upload.php", {
        method: "POST",
        body,
    });
    assert.equal(response.headers.get('Content-Type'), 'application/octet-stream');
    return Buffer.from(await response.arrayBuffer());
}

export async function download(torrent_id: number): Promise<Buffer> {
    const url = new URL("https://pt.lolo.moe/download.php");
    url.searchParams.append('id', torrent_id.toString());
    const response = await fetchCookie(url);
    assert.equal(response.headers.get('Content-Type'), 'application/octet-stream');
    return Buffer.from(await response.arrayBuffer());
}