import { Directive, AfterViewChecked } from '@angular/core';

declare var componentHandler : any;

@Directive({
  selector: '[appMDLupdate]'
})
export class MDLupdateDirective {

  ngAfterViewChecked() {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }


}
