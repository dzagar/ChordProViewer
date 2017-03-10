import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appAutoGrow]',
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(onkeypress)': 'onKeyPress()'
  }
})
export class AutoGrowDirective {
  constructor(private el : ElementRef, private renderer : Renderer) { }
  onKeyPress(){
    
  }
  onFocus(){
    this.renderer.setElementStyle(this.el.nativeElement, 'height', '200px');
  }
  
  onBlur(){
    this.renderer.setElementStyle(this.el.nativeElement, 'height', '120px');
  }

}
