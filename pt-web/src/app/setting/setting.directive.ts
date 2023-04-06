import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[qb_url]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SettingDirective, multi: true }],
})
export class SettingDirective implements Validator {
  @Input('qb_url') qb_url = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.qb_url ? qbUrlValidator()(control) : null;
  }
}

export function qbUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // return { get_url: true };
    return null;
  };
}
