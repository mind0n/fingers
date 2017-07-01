import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";
import {all} from "../../kernel/src/common";
import {evtarget, addcss, delcss} from "../../kernel/src/web/element";
import {TouchItem, TouchElement, TouchContext} from "./touchContext";

export class Act{
    constructor(public name:string
    , public pos:number[]
    , public context:TouchContext
    ){}
    destroy(){
        this.context = null;
    }
}