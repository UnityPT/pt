export abstract class WebDAVHandle implements FileSystemHandle {
    abstract kind: 'file' | 'directory';
    abstract name: string;

    isSameEntry(other: FileSystemHandle): Promise<boolean> {
        throw 'no impl'
    }

    queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        throw 'no impl'
    }

    requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        throw 'no impl'
    }
}
