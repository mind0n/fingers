import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";

export class TouchContext{
    constructor(protected target:TouchElement){
        target.touchContext = this;
    }
    static check(el:TouchElement):TouchContext{
        return el.touchContext || new TouchContext(el);
    }
}

export class TouchElement extends Element{
    touchContext:TouchContext;
    touchable:boolean = true;
    evtrap:boolean = false;
}