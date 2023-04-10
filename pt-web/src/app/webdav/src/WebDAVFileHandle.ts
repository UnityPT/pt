import {WebDAVHandle} from "./WebDAVHandle.js";

export class WebDAVFileHandle extends WebDAVHandle implements FileSystemFileHandle {
    readonly kind = "file";

    constructor(private url: string, private headers: Headers, public readonly name: string) {
        super();
    }

    async getFile(): Promise<File> {
        const response = await fetch('x');
        return new File([await response.blob()], 'x');
    }

    async createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream> {
        const stream = new TransformStream()
        const _ = fetch('x', {body: stream.readable});
        // TODO: it's not a real FileSystemWritableFileStream, just a normal WritableFileStream
        return stream.writable as FileSystemWritableFileStream;
    }
}
