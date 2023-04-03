import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DirItem } from '../types';
import path from 'path';
import { values } from 'lodash-es';
import value from '*.md';

@Component({
  selector: 'app-browse-remote',
  templateUrl: './browse-remote.component.html',
  styleUrls: ['./browse-remote.component.scss'],
})
export class BrowseRemoteComponent implements OnInit {
  items: DirItem[] = [];
  breadcrumb: DirItem[] = [];
  selectedItem: DirItem | null = null;

  constructor(public dialogRef: MatDialogRef<BrowseRemoteComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.items = this.data.dirItems;
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  async onSelectClick() {
    this.dialogRef.close(
      path.posix.join(
        ...(this.breadcrumb.length > 1 ? this.breadcrumb.slice(1).map((item) => item.name) : ['']),
        this.selectedItem?.name ?? ''
      )
    );
  }

  onDblClick(item: DirItem) {
    const childItems = Object.values(item.children);
    if (childItems.length > 0) {
      this.breadcrumb.push(item);
      this.items = childItems;
    }
  }

  onHomeClick() {
    this.items = this.data.dirItems;
    this.breadcrumb = [];
  }

  onBreadClick(item: any) {
    this.items = Object.values(item.children);
    this.breadcrumb = this.breadcrumb.slice(0, this.breadcrumb.indexOf(item) + 1);
  }
}
