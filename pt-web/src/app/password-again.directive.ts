import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appPasswordAgain]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordAgainDirective, multi: true }],
})
export class PasswordAgainDirective implements Validator {
  @Input('appPasswordAgain') appPasswordAgain = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.appPasswordAgain ? passwordAgainValidator(this.appPasswordAgain)(control) : null;
  }
}

export function passwordAgainValidator(password: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return password !== control.value ? { passwordAgain: true } : null;
  };
}
