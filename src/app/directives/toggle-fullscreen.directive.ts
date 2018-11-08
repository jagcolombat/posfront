import {Directive, HostListener} from '@angular/core';
import * as screenfull from 'screenfull';
@Directive({
  selector: '[appToggleFullscreen]'
})
export class ToggleFullscreenDirective {

    @HostListener('click') onClick() {
        console.log("click toggle full screen ");
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }

}
