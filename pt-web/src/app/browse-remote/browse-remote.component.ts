import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

interface FileItem {
  name: string;
  isDirectory: boolean;
}

@Component({
  selector: 'app-browse-remote',
  templateUrl: './browse-remote.component.html',
  styleUrls: ['./browse-remote.component.scss'],
})
export class BrowseRemoteComponent implements OnInit {
  @Output() select: EventEmitter<FileItem> = new EventEmitter<FileItem>();
  items: FileItem[] = [];
  breadcrumb: FileItem[] = [];
  selectedItem: FileItem | null = null;

  constructor(
    public dialogRef: MatDialogRef<BrowseRemoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.matIconRegistry.addSvgIcon('folder', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/folder.svg'));
    // this.matIconRegistry.addSvgIcon('file', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/file.svg'));
    this.loadFolder('/');
  }

  onItemClick(item: FileItem) {
    // if (item.isDirectory) {
    //   // Load selected folder
    //   const path = this.breadcrumb.map((item) => item.name).join('/') + '/' + item.name;
    //   this.loadFolder(path);
    // } else {
    //   // Select file
    //   this.selectedItem = item;
    // }
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSelectClick() {
    // if (this.selectedItem !== null) {
    //   this.select.emit(this.selectedItem);
    //   this.dialogRef.close();
    // }
  }

  onBackClick() {
    // Remove last item from breadcrumb
    this.breadcrumb.pop();

    // Get parent folder path
    const path = this.breadcrumb.map((item) => item.name).join('/');

    // Load parent folder
    this.loadFolder(path);
  }

  loadFolder(path: string) {
    // Mock loading of folder contents
    setTimeout(() => {
      // Simulate folder contents
      const contents: FileItem[] = [{ name: 'Documents', isDirectory: true }];

      // Clear breadcrumb and selected item
      this.breadcrumb = [];
      this.selectedItem = null;

      // Split path into individual folders
      const folders = path.split('/');

      // Generate breadcrumb for current path
      let currentPath = '';
      for (const folder of folders) {
        if (folder === '') {
          // Skip empty folders
          continue;
        }
        currentPath += '/' + folder;
        const breadcrumbItem: FileItem = {
          name: folder,
          isDirectory: true,
        };
        this.breadcrumb.push(breadcrumbItem);
      }

      // Load folder contents
      // this.items = contents.filter((item) => {
      //   if (item.isDirectory) {
      //     return item.name.startsWith(folders[folders.length - 1]);
      //   } else {
      //     return true;
      //   }
      // });
    }, 500);
  }
}
