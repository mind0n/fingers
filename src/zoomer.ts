
/// <reference path="recognizer.ts" />

namespace fingers{
    export abstract class Zoomer{
        protected sact:iact;
        protected pact:iact;
        protected started:boolean;
        mapping:{};
        constructor(el:any){
            if (!el.$zoomer$){
                el.$zoomer$ = [this];
            }else{
                el.$zoomer$[el.$zoomer$.length] = this;
            }
        }
    }

    export class Drag extends Zoomer{
        constructor(el:any){
            super(el);
            let zoomer = this;
            this.mapping = {
                dragstart:function(act:iact, el:any){
                    zoomer.sact = act;
                    zoomer.pact = act;
                    zoomer.started = true;
                }, dragging:function(act:iact, el:any){
                    if (zoomer.started){
                        let p = zoomer.pact;
                        let offset = [act.cpos[0] - p.cpos[0], act.cpos[1] - p.cpos[1]];
                        let delta = {offset: offset}; 
                        let l = el.astyle(["left"]);
                        let t = el.astyle(["top"]);
                        el.style.left = parseInt(l) + delta.offset[0] + "px";
                        el.style.top = parseInt(t) + delta.offset[1] + "px";
                        zoomer.pact = act;
                    }
                }, dragend:function(act:iact, el:any){
                    zoomer.started = false;
                }
            }
        }
    }

    export function pointOnElement(el:any, evt:string, pos:number[]){
        let rlt = [0, 0];
        el.onmouseover = function(event:any){
            rlt = [event.offsetX, event.offsetY];
        }
        simulate(el, "mouseover", pos);
        return rlt;
    }

    export class Zoom extends Zoomer{
        protected rot:any;
        constructor(el:any){
            super(el);
            let zoomer = this;
            this.mapping = {
                zoomstart:function(act:iact, el:any){
                    zoomer.sact = act;
                    zoomer.pact = act;
                    zoomer.started = true;
                    zoomer.rot = Rotator(el);
                }, zooming:function(act:iact, el:any){
                    if (zoomer.started){
                        let p = zoomer.sact;
                        let offset = [act.cpos[0] - p.cpos[0], act.cpos[1] - p.cpos[1]];
                        let rot = act.angle - p.angle;
                        let scale = act.len / p.len;
                        let delta = {offset: offset, angle:rot, scale:scale};
                        let center = pointOnElement(el, "mouseover", act.cpos);

                        zoomer.rot.rotate({
                            pos:offset, 
                            angle:rot, 
                            center:center,
                            scale:scale
                        });
                        zoomer.pact = act;
                    }
                }, zoomend:function(act:iact, el:any){
                    zoomer.started = false;
                    zoomer.rot.commitStatus();
                }
            }
        }
    }
    
    export class Zsize extends Zoomer{
        constructor(el:any){
            super(el);
            let zoomer = this;
            this.mapping = {
                zoomstart:function(act:iact, el:any){
                    zoomer.sact = act;
                    zoomer.pact = act;
                    zoomer.started = true;
                },zooming:function(act:iact, el:any){
                    if (zoomer.started){
                        let p = zoomer.pact;
                        let offset = [act.cpos[0] - p.cpos[0], act.cpos[1] - p.cpos[1]];
                        let resize = [act.owidth - p.owidth, act.oheight - p.oheight];
                        let delta = {offset: offset, resize:resize};
                        
                        let w = el.astyle(["width"]);
                        let h = el.astyle(["height"]);
                        
                        let l = el.astyle(["left"]);
                        let t = el.astyle(["top"]);
                        
                        el.style.width = parseInt(w) + delta.resize[0] + "px";
                        el.style.height = parseInt(h) + delta.resize[1] + "px";

                        el.style.left = parseInt(l) + delta.offset[0] + "px";
                        el.style.top = parseInt(t) + delta.offset[1] + "px";
                        
                        zoomer.pact = act;
                    }
                },zoomend:function(act:iact, el:any){
                    zoomer.started = false;
                }
            }
        }
    }

    function simulate(element:any, eventName:string, pos:any) {
        function extend(destination:any, source:any) {
            for (var property in source)
                destination[property] = source[property];
            return destination;
        }

        let eventMatchers:any = {
            'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
            'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
        }

        let defaultOptions = {
            pointerX: 100,
            pointerY: 100,
            button: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        }
        if (pos) {
            defaultOptions.pointerX = pos[0];
            defaultOptions.pointerY = pos[1];
        }
        let options = extend(defaultOptions, arguments[3] || {});
        let oEvent:any, eventType:any = null;

        for (let name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }
        }

        if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = (document as any).createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    }

}
