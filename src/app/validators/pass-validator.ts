import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const errors: any = {};

      if (value.length < 6) {
        errors.minLength = true;
      }

      if (!/[A-Z]/.test(value)) {
        errors.uppercase = true;
      }

      if (!/[a-z]/.test(value)) {
        errors.lowercase = true;
      }

      if (!/[0-9]/.test(value)) {
        errors.number = true;
      }

      if (!/[!@#$%^&*(),.?":{}|<>_\-+=/~]/.test(value)) {
        errors.special = true;
      }

      if (/\s/.test(value)) {
        errors.noSpaces = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  static matchPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordKey)?.value;
      const confirmPassword = group.get(confirmPasswordKey)?.value;

      if (password !== confirmPassword) {
        group.get(confirmPasswordKey)?.setErrors({ mismatch: true });
      } else {
        group.get(confirmPasswordKey)?.setErrors(null);
      }

      return null;
    };
  }
}
