import {Component} from '@angular/core';

@Component({
  selector: 'app-folder-seclect',
  templateUrl: './folder-seclect.component.html',
  styleUrls: ['./folder-seclect.component.scss'],
})
export class FolderSeclectComponent {
  // dropHandler(event: any) {
  //   console.log('File(s) dropped');
  // }
  //
  // dragOverHandler(event: any) {
  //   console.log('File(s) in drop zone');
  //
  //   // Prevent default behavior (Prevent file from being opened)
  //   event.preventDefault();
  // }

  ondrop(event: DragEvent) {
    event.preventDefault();
    console.log(event);
  }

  ondragover(event: DragEvent) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
  }

  submit() {}
}
