/// <reference path="./definitions.ts" />
/// <reference path="./patterns.ts" />

namespace fingers{
    export interface iact{
        act:string,
        cpos:number[],
        rpos?:number[],
        oheight?:number,
        owidth?:number,
        len?:number,
        angle?:number,
        time?:number
    }

    export class Recognizer{
        inqueue:any[] = [];
        outqueue:iact[] = [];
        patterns:ipattern[] = [];
        cfg:any;

        constructor(cfg:any){
            let defpatterns = ["zoomend", "zoomstart", "zooming", "dbltouched", "touched", "dropped", "dragging"];
            
            if (!cfg){
                cfg = {patterns:defpatterns};
            }

            if (!cfg.patterns){
                cfg.patterns = defpatterns;
            }

            this.cfg = cfg;
            for(let i of cfg.patterns){
                if (Patterns[i]){
                    this.patterns.add(Patterns[i]);
                }
            }

        }

        parse(acts:iact[]):void{
            if (!this.cfg.qlen){
                this.cfg.qlen = 12;
            }

            this.inqueue.splice(0, 0, acts);
            if (this.inqueue.length > this.cfg.qlen){
                this.inqueue.splice(this.inqueue.length - 1, 1);
            }
            
            if (this.cfg.on && this.cfg.on.tap){
                for(let i of acts){
                    //acts.length >= 1 && acts[0].act == "touchstart" &&
                    if (i.act == "touchstart"){
                        this.cfg.on.tap(acts[0]);
                        break;
                    }
                }
            }

            for(let pattern of this.patterns){
                if (pattern.verify(acts, this.inqueue, this.outqueue)){
                    let rlt = pattern.recognize(this.inqueue, this.outqueue);
                    if (rlt){
                        this.outqueue.splice(0, 0, rlt);
                        if (this.outqueue.length > this.cfg.qlen){
                            this.outqueue.splice(this.outqueue.length - 1, 1);
                        }
                        let q = this.inqueue;
                        this.inqueue = [];
                        q.clear();
                        if (this.cfg.on && this.cfg.on[rlt.act]){
                            this.cfg.on[rlt.act](rlt);
                        }
                        if (this.cfg.onrecognized){
                            this.cfg.onrecognized(rlt);
                        }
                        break;
                    }
                }
            }
        }
    }
}