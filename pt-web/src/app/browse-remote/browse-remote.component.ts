import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FileItem } from '../types';

@Component({
  selector: 'app-browse-remote',
  templateUrl: './browse-remote.component.html',
  styleUrls: ['./browse-remote.component.scss'],
})
export class BrowseRemoteComponent implements OnInit {
  items: FileItem[] = [];
  breadcrumb: FileItem[] = [];
  selectedItem: FileItem | null = null;

  constructor(public dialogRef: MatDialogRef<BrowseRemoteComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.items = Object.values(this.data.directoryItems);
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSelectClick() {
    this.dialogRef.close(this.selectedItem);
  }

  onDblClick(item: FileItem) {
    this.breadcrumb.push(item);
    this.items = Object.values(item.children!);
  }

  onHomeClick() {
    this.items = Object.values(this.data.directoryItems);
    this.breadcrumb = [];
  }

  onBreadClick(item: any) {
    this.items = Object.values(item.children);
    this.breadcrumb = this.breadcrumb.slice(0, this.breadcrumb.indexOf(item) + 1);
  }
}
