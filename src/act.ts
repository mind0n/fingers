import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";
import {all} from "../../kernel/src/common";
import {evtarget, addcss, delcss} from "../../kernel/src/web/element";
import {TouchItem, TouchElement, TouchContext} from "./touchContext";

export class Act{
    constructor(public name:string
    , public pos:number[]
    , public context:TouchContext
    , public time?:Date
    , public accurate?:boolean
    ){
        this.time = time || new Date();
    }
    copy(name?:string, accurate?:boolean):Act{
        let rlt = new Act(name || this.name, [this.pos[0], this.pos[1]], this.context, this.time, accurate);
        return rlt;
    }
    destroy(){
        this.context = null;
    }
}