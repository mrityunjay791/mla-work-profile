import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Work } from '../../../../models/work.interface';

@Component({
  selector: 'app-work-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-form.component.html',
  styleUrl: './work-form.component.scss'
})
export class WorkFormComponent implements OnInit {
  @Input() work: Work | null = null;
  @Output() submit = new EventEmitter<Work>();
  @Output() cancel = new EventEmitter<void>();

  workForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.workForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      impact: ['', Validators.required],
      details: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.work) {
      const dateStr = new Date(this.work.date).toISOString().split('T')[0];
      this.workForm.patchValue({
        ...this.work,
        date: dateStr
      });
    }
  }

  get f() {
    return this.workForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.workForm.invalid) {
      return;
    }

    const formValue = this.workForm.value;
    const workData: Work = {
      id: this.work?.id || Date.now().toString(),
      ...formValue,
      date: new Date(formValue.date)
    };

    this.submit.emit(workData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
