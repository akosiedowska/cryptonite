import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const matchPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value
    const confirmPassword = control.get('confirmPassword')?.value

    if (!password || !confirmPassword) return null

    if (password !== confirmPassword) {
        return { matchPasswordError: true }
    }

    return null
}