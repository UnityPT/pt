import {Component, HostBinding} from '@angular/core';
import help from './help.md';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-help',
  template: '',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  constructor(private sanitizer: DomSanitizer) {
  }
  @HostBinding('innerHTML')
  help = this.sanitizer.bypassSecurityTrustHtml(help);
}
