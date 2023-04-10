import * as htmlparser2 from "htmlparser2";
import {WebDAVHandle} from "./WebDAVHandle.js";
import "@sec-ant/readable-stream";
import {WebDAVFileHandle} from "./WebDAVFileHandle.js";
import * as path from 'node:path';
import 'core-js/actual/async-iterator/map.js'
import 'iterator-helpers-polyfill/declarations'
import {AsyncIterator} from "iterator-helpers-polyfill";

export class WebDAVDirectoryHandle extends WebDAVHandle implements FileSystemDirectoryHandle {
    readonly kind = "directory";
    readonly name: string;

    constructor(private url: string, private headers: Headers) {
        super();
        this.name = path.basename(this.url);
    }

    async getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle> {
        if (options?.create) {
            return new WebDAVDirectoryHandle(path.join(this.url, name), this.headers);
        } else {

        }
        throw 'not Impl';
    }

    getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle> {
        throw 'not Impl';
    }

    removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void> {
        throw 'not Impl';
    }

    resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null> {
        throw 'not Impl';
        // let x:AsyncIterator;
        // x.
    }

    keys(): AsyncIterableIterator<string> {
        return this.values().map((value) => value.name);
    }

    async* values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle> {
        const body = `<?xml version="1.0" encoding="utf-8"?>
        <D:propfind xmlns:D="DAV:">
            <D:prop>
                <D:resourcetype/>
            </D:prop>
        </D:propfind>`

        const headers = new Headers({...this.headers, Depth: 'infinity'})
        const response = await fetch(this.url, {method: "PROPFIND", headers, body});
        return response.body!.pipeThrough(this.createTransform());
    }

    async* entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]> {
        return this.values().map(value => [value.name, value]);
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]> {
        return this.entries();
    }

    private createTransform() {
        const decoder = new TextDecoder();
        let readingHref: boolean
        let isDirectory = false;
        let href: string;
        const headers = this.headers;
        const parser = new htmlparser2.Parser({
            onopentagname(name: string) {
                if (name === "D:collection") {
                    isDirectory = true;
                } else {
                    readingHref = name == "D:href";
                }
            },
            ontext(text) {
                if (readingHref) {
                    href = text
                }
            },
            onclosetag(name) {
                if (name == "D:response") {
                    controller.enqueue(new (isDirectory ? WebDAVDirectoryHandle : WebDAVFileHandle)(href, headers, ''))
                    isDirectory = false;
                }
            },
        }, {xmlMode: true, lowerCaseTags: false, lowerCaseAttributeNames: true});
        let controller: TransformStreamDefaultController<WebDAVHandle>;

        return new TransformStream<Uint8Array, WebDAVHandle>({
            start() {

            },
            transform(chunk, controller1) {
                controller = controller1;
                if (chunk) {
                    parser.write(decoder.decode(chunk, {stream: true}))
                } else {
                    controller.terminate();
                }
            },
            flush() {
                parser.end()
            }
        })
    }
}
