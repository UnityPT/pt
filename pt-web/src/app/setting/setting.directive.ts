import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[get_url]',
  providers: [{provide: NG_VALIDATORS, useExisting: SettingDirective, multi: true}]
})
export class SettingDirective implements Validator {
  @Input('get_url') get_url = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return getUrlValidator()(control);
  }
}

export function getUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (navigator.userAgentData.platform == 'Windows' && control.value.startsWith('\\\\')) return null;
    if (navigator.userAgentData.platform == 'macOS' && control.value.startsWith('smb:\/\/')) return null;
    return {get_url: true};
  };
}
