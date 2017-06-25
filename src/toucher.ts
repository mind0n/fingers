import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";

export class Toucher{
    constructor(){
        let istouch = false;
        if (MobileDevice.any){
            document.addEventListener("touchstart", function(event:TouchEvent){
                istouch = true;
                log('Touch Start', 'raw');
                event.stopPropagation();
            }, true);
            document.addEventListener("touchmove", function(event:TouchEvent){
                istouch = true;
                log('Touch Move', 'raw');
                event.stopPropagation();
                if (Browser.isSafari){
                    event.preventDefault();
                }
            }, true);
            document.addEventListener("touchend", function(event:TouchEvent){
                istouch = true;
                log('Touch End', 'raw');
                event.stopPropagation();
            }, true);
            document.addEventListener("touchcancel", function(event:TouchEvent){
                istouch = true;
                log('Touch Cancel', 'raw');
                event.stopPropagation();
            }, true);
        }else{
            document.addEventListener("mousedown", function(event:MouseEvent){
                if (!istouch){
                    log('Mouse Down', 'raw');
                }
            }, true);
            document.addEventListener("mousemove", function(event:MouseEvent){
                if (!istouch){
                    log('Mouse Move', 'raw');
                }
            }, true);
            document.addEventListener("mouseup", function(event:MouseEvent){
                if (!istouch){
                    log('Mouse Up', 'raw');
                }
            }, true);
            document.addEventListener("mousewheel", function(event:MouseWheelEvent){
                log('Wheel', 'raw');
            }, true);
            document.addEventListener("DOMMouseScroll", function(event:MouseWheelEvent){
                log('Firefox Wheel', 'raw');
            }, true);
        }
    }
    contextmenu(enabled?:boolean){
        document.body.oncontextmenu = function(event){
            if (!enabled){
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }
    }
}