import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[input-noSpace]'
})
export class InputNoSpaceDirective {

  constructor(private elementRef: ElementRef, private control: NgControl) {

  }

  @HostListener('keydown', ['$event'])
  keydownFun(evt) {
    if (evt.key.trim() === '') {
      evt.preventDefault();
    }
  }

  @HostListener('keyup', ['$event', '$event.target'])
  keyupFun(evt, target) {
    if (target.value) {
      this.control.control.setValue(target.value.replace(/(\s*)/g, ''));
    }
  }

}
