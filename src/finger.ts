/// <reference path="touch.ts" />
/// <reference path="zoomer.ts" />
/// <reference path="elements.ts" />

namespace fingers{
    function elAtPos(pos:number[]):any{
        let rlt:any = null;
        let cache:any[] = [];
        while(true){
            let el:any = document.elementFromPoint(pos[0], pos[1]);
            if (!el){
                break;
            }
            var ps = el.astyle(['position']);
            if (el == document.body || el.tagName.toLowerCase() == "html" || el == window){
                rlt = null;
                break;
            }else if (el.$evtrap$){
                rlt = null;
                break;
            }else if (el.$touchable$){
                rlt = el.getarget?el.getarget():el
                rlt.$touchel$ = el;
                break;
            }else{
                if (el.$evtignore$ || ps == 'absolute' || ps == 'fixed'){
                    el.style.display = "none";
                    cache.add(el);
                }else{
                    break;
                }
            }
        }
        for(let i of cache){
            i.style.display = "";
        }
        return rlt;
    }

    let activeEl:any;
    let inited:boolean=false;
    let cfg:any = null;

    function all(node:Node, settings:any, result?:any[]):any[]{
        let rlt:any[] = result || [];
        if (!node || !settings){
            return rlt;
        }
        var cb = settings.callback;
        var ft = settings.filter;
        
        cb(node);
        if (!node.childNodes){
            console.error("Unexpected target node:", node);
            debugger;
            return;
        }
        for(let i=0; i<node.childNodes.length; i++){
            let cnode = node.childNodes[i];
            if (!ft || ft(cnode)){
                if (cb){
                    cb(cnode);
                }else{
                    rlt.add(cnode);
                }
            }
            all(cnode, settings, rlt);
        }
        return rlt;
    }
    export function finger(els:any, undef:any):any{
        let el:any = null;
        let typ = typeof(els);
        if (typ == 'string'){
            if ((window as any).$){
                els = (window as any).$(els);
            }else{
                els = document.querySelector(els);
            }
        }
        if (els.length === undef){
            els = [els];
        }
        for(let el of els){
            if (!cfg){
                cfg = touch({
                    on:{ 
                        tap:function(act:iact){
                            activeEl = elAtPos(act.cpos);
                        }
                    },onact:function(inq:any){
                    },onrecognized:function(act:iact){
                        if (activeEl && activeEl.$zoomer$){
                            let zm = activeEl.$zoomer$;
                            for(let i of zm){
                                if (i.mapping[act.act]){
                                    i.mapping[act.act](act, activeEl);
                                }
                            }
                        }
                    }
                });
                cfg.enabled = true;
            }
            el.$touchable$ = true;
            all(el, {callback:function(nd:any){nd.$evtignore$ = true;}});
        }
        return {
            zoomable:function(){
                for(let el of els){
                    let zoomer = new Zoom(el);
                }
                return this;
            },zsizable:function(){
                for(let el of els){
                    let zsize = new Zsize(el);
                }
                return this;
            },draggable:function(){
                for(let el of els){
                    let drag = new Drag(el);
                }
                return this;
            }
        };
    }
}

let finger = fingers.finger;