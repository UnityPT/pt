import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[smb_remote_path]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SettingDirective, multi: true }],
})
export class SettingDirective implements Validator {
  @Input('smb_remote_path') smb_remote_path = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return getUrlValidator()(control);
  }
}

export function getUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // if (navigator.userAgentData.platform == 'Windows' && control.value.startsWith('\\\\')) return null;
    // if (navigator.userAgentData.platform == 'macOS' && control.value.startsWith('smb://')) return null;
    // return { get_url: true };
    return null;
  };
}
