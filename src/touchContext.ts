import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";

export class TouchContext{
    hastouched():any{
        return this.touchel;
    }
    constructor(public touchel:TouchElement, public contextel:TouchElement){}
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
}