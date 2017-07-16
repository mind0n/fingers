import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";
import {Act} from "./act";
import {Recognizer, Recognizers} from "./recognizer";
import {Q} from "./Q";
import {all, add, NamedFactory, Factory} from "../../kernel/src/common";


export class TouchContext{

    protected raq:Q<Act[]>;
    protected req:Q<Act>;
    protected recs:any = {};

    hastouched():any{
        return this.touchel;
    }
    constructor(public touchel:TouchElement, public contextel:TouchElement, public activel?:TouchElement){
        this.raq = new Q<Act[]>();
        this.req = new Q<Act>();
    }
    pushacts(acts:Act[]){
        let raq = this.raq;
        let req = this.req;
        raq.enq(acts);
        let hit = false;

        all(this.recs, (rec:Recognizer, i:any)=>{
            if (!rec.errored() && rec.preview(raq, req)){
                rec.analyze(raq, req);
                if (rec.hit()){
                    hit = true;
                    let a = rec.parse(acts); //new Act(rec.name, [], this);
                    //console.log(a.name, a.time);
                    this.req.enq(a);
                    return true;
                }
            }
        });
        TouchElement.check(this.touchel);
        TouchElement.check(this.contextel);
        TouchElement.check(this.activel);
        if (hit){
            let act = this.req.curt();
            if (act.accurate){
                this.touchel.trigger(act);
            }else{
                this.activel.trigger(act);
            }
            return act;
        }
    }
    registrec(rec:Recognizer){
        this.recs[rec.name] = rec;
    }
    update(target:TouchElement, context:TouchElement){
        this.contextel = context;
        this.touchel = target || context;
        this.activel = this.activel || target || context;
        TouchElement.check(this.touchel);
        TouchElement.check(this.contextel);
        TouchElement.check(this.activel);
        // if (!this.activel){
        //     this.activel = this.touchel;
        // }
        // if (!this.touchel || !this.activel){
        //     debugger;
        // }
        let recs = this.recs;
        let recognizers = target?target.recognizers:context.recognizers;
        all(recognizers, (rec:string, i:any)=>{
            let r = Recognizers.instance.get(rec);
            if (r){
                recs[rec] = r;
            }
        });        
    }
    reset(){
        //this.raq.clear();
        //this.req.clear();
        all(this.recs, (rec:Recognizer, i:any)=>{
            let r = rec
            if (r){
                r.reset();
            }
        });        
    }
}


export class TouchItem{
    constructor(protected target:TouchElement){
        target.touchContext = this;
    }
    static check(el:TouchElement):TouchItem{
        return el.touchContext || new TouchItem(el);
    }
}

export abstract class TouchElement extends Element{
    static check(target:TouchElement){
        if (target && !target.trigger){
            target.trigger = function(act:Act){
                let el = <any>this;
                if (el[`on${act.name}`]){
                    el[`on${act.name}`](act);
                }
            };
        }
    }
    touchContext:TouchItem;
    touchable:boolean = true;
    evtrap:boolean = false;
    recognizers:string[];
    abstract trigger(act:Act):void;
}

