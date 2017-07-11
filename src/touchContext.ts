import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";
import {Act} from "./act";
import {Recognizer, Recognizers} from "./recognizer";
import {Q} from "./Q";
import {all, add, NamedFactory, Factory} from "../../kernel/src/common";


export class TouchContext{

    protected raq:Q<Act[]>;
    protected req:Q<Act[]>;
    protected recs:any = {};

    hastouched():any{
        return this.touchel;
    }
    constructor(public touchel:TouchElement, public contextel:TouchElement){
        this.raq = new Q<Act[]>();
        this.req = new Q<Act[]>();
    }
    pushacts(acts:Act[]){
        let raq = this.raq;
        let req = this.req;
        raq.enq(acts);

        all(this.recs, (rec:Recognizer, i:any)=>{
            if (rec.preview(raq)){
                rec.analyze(raq, req);
                if (rec.hit()){
                    console.log(rec.name);
                }
            }
        });
    }
    registrec(rec:Recognizer){
        this.recs[rec.name] = rec;
    }
    update(target:TouchElement, context:TouchElement){
        this.contextel = context;
        this.touchel = target;
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

export class TouchElement extends Element{
    touchContext:TouchItem;
    touchable:boolean = true;
    evtrap:boolean = false;
    recognizers:string[];
}

