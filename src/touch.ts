/// <reference path="recognizer.ts" />
/// <reference path="device.ts" />

namespace fingers{
    let inited:boolean = false;
    
    class zoomsim{
        oppo:iact;
        protected create(act:iact):void{
            let m = [document.documentElement.clientWidth/2, document.documentElement.clientHeight/2];
            this.oppo = {act:act.act, cpos:[2*m[0] - act.cpos[0], 2*m[1] - act.cpos[1]], time:act.time};
            //console.log(act.cpos[1], m[1], this.oppo.cpos[1]);
        }
        start(act:iact):iact[]{
            this.create(act);
            return [act, this.oppo];
        }
        zoom(act:iact):iact[]{
            this.create(act);
            return [act, this.oppo];
        }
        end(act:iact):iact[]{
            this.create(act);
            return [act, this.oppo];
        }
    }
    
    class offsetsim extends zoomsim{
        protected create(act:iact):void{
            this.oppo = {act:act.act, cpos:[act.cpos[0] + 100, act.cpos[1] + 100], time:act.time};
        }
    }

    let zs:zoomsim = null;
    let os:offsetsim = null;

    function getouches(event:any, isend?:boolean):any{
        if (isend){
            return event.changedTouches;
        }else{
            return event.touches;
        }
    }

    export function touch(cfg:any):any{
        let rg:Recognizer = new Recognizer(cfg);

        function createAct(name:string, x:number, y:number):iact{
            return {act:name, cpos:[x, y], time:new Date().getTime()};
        }

        function handle(cfg:any, acts:iact[]):void{
            if (!cfg || !cfg.enabled){
                return;
            }
            if (cfg.onact){
                cfg.onact(rg.inqueue);
            }
            rg.parse(acts);
        }

        if (!inited){
            document.oncontextmenu = function(){
                return false;
            };

            if (!MobileDevice.any){
                zs = new zoomsim();
                os = new offsetsim();
                document.addEventListener("mousedown", function(event){
                    let act:iact = createAct("touchstart", event.clientX, event.clientY);
                    if (event.button == 0){
                        handle(cfg, [act]);
                    } else if (event.button == 1) {
                        os.start(act);
                        handle(cfg, [act, os.oppo]);
                    } else if (event.button == 2){
                        zs.start(act);
                        handle(cfg, [act, zs.oppo]);
                    }
                }, true);

                document.addEventListener("mousemove", function(event){
                    let act:iact = createAct("touchmove", event.clientX, event.clientY);
                    if (event.button == 0){
                        handle(cfg, [act]);
                    } else if (event.button == 1) {
                        os.start(act);
                        handle(cfg, [act, os.oppo]);
                    } else if (event.button == 2){
                        zs.start(act);
                        handle(cfg, [act, zs.oppo]);
                    }
                }, true);

                document.addEventListener("mouseup", function(event){
                    let act:iact = createAct("touchend", event.clientX, event.clientY);
                    if (event.button == 0){
                        handle(cfg, [act]);
                    } else if (event.button == 1) {
                        os.start(act);
                        handle(cfg, [act, os.oppo]);
                    } else if (event.button == 2){
                        zs.start(act);
                        handle(cfg, [act, zs.oppo]);
                    }
                }, true);
            }else{
                document.addEventListener("touchstart", function(event){
                    let acts:iact[] = [];
                    let touches = getouches(event);
                    for(let i=0; i<touches.length; i++){
                        let item = event.changedTouches[i];
                        let act:iact = createAct("touchstart", item.clientX, item.clientY);
                        acts.add(act);
                    }
                    handle(cfg, acts);
                    event.stopPropagation();
                }, true);
                document.addEventListener("touchmove", function(event){
                    let acts:iact[] = [];
                    let touches = getouches(event);
                    for(let i=0; i < touches.length; i++){
                        let item = event.changedTouches[i];
                        let act:iact = createAct("touchmove", item.clientX, item.clientY);
                        acts.add(act);
                    }
                    handle(cfg, acts);
                    event.stopPropagation();
                    if (Browser.isSafari){
                        event.preventDefault();
                    }
                }, true);
                document.addEventListener("touchend", function(event){
                    let acts:iact[] = [];
                    let touches = getouches(event, true);
                    for(let i=0; i < touches.length; i++){
                        let item = event.changedTouches[i];
                        let act:iact = createAct("touchend", item.clientX, item.clientY);
                        acts.add(act);
                    }
                    handle(cfg, acts);
                    event.stopPropagation();

                }, true);
            }
            inited = true;
        }
        return cfg;
    }
}

let touch = fingers.touch;