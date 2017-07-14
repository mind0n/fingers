import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";
import {all, add} from "../../kernel/src/common";
import {evtarget, addcss, delcss} from "../../kernel/src/web/element";
import {TouchItem, TouchElement, TouchContext} from "./touchContext";
import {Act} from "./act";
import {simulate} from "../../kernel/src/web/simulate";


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

function getarget(x:number, y:number):TouchContext{
    let list = pointel(x, y);
    let titem:TouchElement = null;
    let el = <TouchElement>all(list, (item:TouchElement, i:number)=>{
        if (item.evtrap){
            return true;
        }else if (item.touchable && !titem){
            titem = item;
        }
    });

    return new TouchContext(titem, el);
}

export class Toucher{
    protected context:TouchContext;
    protected disabled:boolean;
    constructor(){
        let istouch = false;
        let self = this;
        self.context = new TouchContext(null, null);
        if (MobileDevice.any){
            document.addEventListener("touchstart", function(event:TouchEvent){
                istouch = true;
                if (!self.disabled){
                    let touches = event.touches;
                    let acts:Act[] = [];
                    if (!self.context.hastouched() && touches && touches.length == 1){
                        log(`Touch Start ${touches.length}`, 'raw');
                        let t = touches[0];
                        let ti = getarget(t.clientX, t.clientY);
                        self.setcontext(ti);
                        add(acts, new Act('tstart', [t.clientX, t.clientY], self.context));
                    }else{
                        acts = self.touchconvert('tstart', event);
                    }

                    event.stopPropagation();
                }
            }, true);
            document.addEventListener("touchmove", function(event:TouchEvent){
                istouch = true;
                if (!self.disabled){
                    let acts = self.touchconvert('tmove', event);
                    event.stopPropagation();
                    if (Browser.isSafari){
                        event.preventDefault();
                    }
                }
            }, true);
            document.addEventListener("touchend", function(event:TouchEvent){
                istouch = true;
                if (!self.disabled){
                    let acts = self.touchconvert('tend', event);
                    event.stopPropagation();
                }
            }, true);
            document.addEventListener("touchcancel", function(event:TouchEvent){
                istouch = true;
                if (!self.disabled){
                    let acts = self.touchconvert('tcancel', event);
                    event.stopPropagation();
                }
            }, true);
        }else{
            document.addEventListener("mousedown", function(event:MouseEvent){
                if (!istouch && !self.disabled){
                    if (event.button == 0){
                        if (!self.context.hastouched()){
                            let ti = getarget(event.clientX, event.clientY);
                            self.setcontext(ti);
                        }
                        let acts = self.mouseconvert('tstart', event);
                        self.context.pushacts(acts);
                    }
                }
            }, true);
            document.addEventListener("mousemove", function(event:MouseEvent){
                if (!istouch && !self.disabled){
                    let acts = self.mouseconvert('tmove', event);
                }
            }, true);
            document.addEventListener("mouseup", function(event:MouseEvent){
                if (!istouch && !self.disabled){
                    if (event.button == 0){
                        let acts = self.mouseconvert('tend', event);
                    }
                }
            }, true);
            document.addEventListener("mousewheel", function(event:MouseWheelEvent){
                if (!self.disabled){                
                    log('Wheel', 'raw');
                    let acts:Act[] = [];
                }
                //add(acts, new Act('tstart', [event.clientX, event.clientY], self.context));
            }, true);
            document.addEventListener("DOMMouseScroll", function(event:MouseWheelEvent){
                if (!self.disabled){
                    log('Firefox Wheel', 'raw');
                    let acts:Act[] = [];
                }
                //add(acts, new Act('tstart', [event.clientX, event.clientY], self.context));
            }, true);
        }
    }
    protected mouseconvert(name:string, event:MouseEvent){
        let self = this;
        log(`${name}`, 'raw');
        let acts:Act[] = [];
        add(acts, new Act(name, [event.clientX, event.clientY], self.context));
        return acts;
    }
    protected touchconvert(name:string, event:TouchEvent){
        let self = this;
        let touches = event.touches;
        log(`${name} ${touches.length}`, 'raw');
        let acts:Act[] = [];
        all(touches, (item:Touch, i:number)=>{
            add(acts, new Act(name, [item.clientX, item.clientY], self.context));
        });
        return acts;
    }
    enable(){
        this.disabled = false;
    }
    disable(){
        this.disabled = true;
    }
    reset(){
        if (this.context){this.context.reset();}
    }
    clear(){
        this.context = null;
    }
    simulate(acts:any[]){
        let list:Act[] = [];
        all(acts, (item:any, i:number)=>{
            add(list, new Act(item.name, item.pos || [], this.context, item.time));
        });
        this.context.pushacts(list);
        return this;
    }
    setcontext(ti:TouchContext){
        this.context.update(ti.touchel, ti.contextel);
        return this;
    }
    trap(target:any){
        target.evtrap = true;
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