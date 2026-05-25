import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-array',
  imports: [ReactiveFormsModule],
  templateUrl: './form-array.html',
  styleUrl: './form-array.scss',
})
export class MyFormArray {
  myForm!: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.myForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(3), this.noNumberValidator]],
      skills: this.fb.array([this.createSkill()])
    })
  }

  createSkill(): FormGroup {
    return this.fb.group({
      skill: [null, [Validators.required]]
    })
  }

  addSkill() {
    this.skills.push(this.createSkill())
  }

  protected get allControls() {
    return this.myForm.controls
  }

  protected get skills() {
    return this.myForm.get('skills') as FormArray
  }

  noNumberValidator(control: AbstractControl) {
    const value = control.value;

    if (!value) return null;

    const hasNumber = /\d/.test(value);

    return hasNumber ? { numberNotAllowed: true } : null;
  }
}
