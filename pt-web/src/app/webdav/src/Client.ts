import {WebDAVDirectoryHandle} from "./WebDAVDirectoryHandle.js";

// interface Connection {
//     url: string;
//     username: string;
//     password: string;
//     authType: string;
// }

export class Client {
    static connect(url: string, authType: string, username: string, password: string): WebDAVDirectoryHandle {
        const headers = new Headers({
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        });
        return new WebDAVDirectoryHandle(url, headers);
    }
}

class WebDAVFile extends File {

}

