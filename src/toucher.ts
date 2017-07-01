import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";
import {all} from "../../kernel/src/common";
import {evtarget, addcss, delcss} from "../../kernel/src/web/element";
import {TouchContext, TouchElement} from "./touchContext";
function pointel(x:number, y:number):Element[]{
    if (document.elementsFromPoint){
        return document.elementsFromPoint(x, y);
    }
    let list:Element[] = [];
    let el = <any>document.elementFromPoint(x, y);
    while(el && el.tagName != 'BODY'){
        list.add(el);
        addcss(el, 'hidden');
        el = document.elementFromPoint(x, y);
    }
    list.add(el);
    all(list, (item:any, i:number)=>{
        delcss(item, 'hidden');
    });
    return list;
}
function getarget(x:number, y:number):TouchItem{
    let list = pointel(x, y);
    let titem:TouchElement = null;
    let el = <TouchElement>all(list, (item:TouchElement, i:number)=>{
        if (item.touchable && !titem){
            titem = item;
        }else if (item.evtrap){
            return true;
        }
    });

    return new TouchItem(titem, el);
}
export class TouchItem{
    constructor(public touched:TouchElement, public context:TouchElement){}
}
export class Toucher{
    protected activeContext:TouchContext;
    protected trapContext:TouchContext;
    constructor(){
        let istouch = false;
        let self = this;
        if (MobileDevice.any){
            document.addEventListener("touchstart", function(event:TouchEvent){
                istouch = true;
                log('Touch Start', 'raw');
                let touches = event.touches;

                if (!self.activeContext && touches && touches.length == 1){
                    let t = touches[0];
                    let ti = getarget(t.clientX, t.clientY);
                    self.setcontext(ti);
                }

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
    setcontext(ti:TouchItem){
        if (ti){
            if (ti.touched){
                this.activeContext = TouchContext.check(ti.touched);
            }
            if (ti.context){
                this.trapContext = TouchContext.check(ti.context);
            }
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