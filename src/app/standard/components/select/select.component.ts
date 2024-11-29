import { Component, Input, Output, EventEmitter, HostListener, OnInit, forwardRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        maxHeight: '200px', // Adjust as needed
      })),
      state('closed', style({
        opacity: 0,
        maxHeight: '0',
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: any[] = []; // Accepts any type of array
  @Input() displayField: string = ''; // Field to display in options
  @Input() valueField: string = ''; // Field to use as selected value
  @Input() selectedOption: any | null = null; // Allows for pre-selected option
  @Output() optionSelected = new EventEmitter<any>();

  dropdownOpen = false;
  isDisabled = false;

  ngOnInit() {
    // Perform any initialization here if needed
  }

  toggleDropdown() {
    if (!this.isDisabled) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  selectOption(option: any) {
    this.selectedOption = option;
    this.onChange(option[this.valueField]);
    this.onTouched();
    this.optionSelected.emit(option);
    this.dropdownOpen = false;
  }

  isDropdownClosed() {
    return !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.dropdownOpen) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest('.custom-dropdown')) {
        this.dropdownOpen = false;
      }
    }
  }

  // ControlValueAccessor implementation
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    if (value) {
      this.selectedOption = this.options.find(option => option[this.valueField] === value);
    } else {
      this.selectedOption = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
