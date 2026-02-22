import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '../../../../models/event.interface';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit {
  @Input() event: Event | null = null;
  @Output() submit = new EventEmitter<Event>();
  @Output() cancel = new EventEmitter<void>();

  eventForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      type: ['upcoming', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    if (this.event) {
      const dateStr = new Date(this.event.date).toISOString().split('T')[0];
      this.eventForm.patchValue({
        title: this.event.title,
        description: this.event.description,
        date: dateStr,
        location: this.event.location,
        type: this.event.type,
        image: this.event.image || ''
      });
    }
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.eventForm.invalid) {
      return;
    }

    const formValue = this.eventForm.value;
    const eventData: Event = {
      id: this.event?.id || Date.now().toString(),
      title: formValue.title,
      description: formValue.description,
      date: new Date(formValue.date),
      location: formValue.location,
      type: formValue.type,
      image: formValue.image || 'https://via.placeholder.com/300x200'
    };

    this.submit.emit(eventData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
