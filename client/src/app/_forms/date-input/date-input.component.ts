import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() maxDate: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(@Self() public readonly ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMMM YYYY'
    };
  }

  writeValue(obj: any): void {
    // left empty on purpouse
  }

  registerOnChange(fn: any): void {
    // left empty on purpouse
  }

  registerOnTouched(fn: any): void {
    // left empty on purpouse
  }
}
