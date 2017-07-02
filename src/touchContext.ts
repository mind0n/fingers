import {log} from "../../kernel/src/web/debug";
import {MobileDevice, Browser} from "../../kernel/src/web/device";
import {Act} from "./act";

export class TouchContext{
    protected raq:Q;
    protected req:Q;
    hastouched():any{
        return this.touchel;
    }
    constructor(public touchel:TouchElement, public contextel:TouchElement){
        this.raq = new Q();
        this.req = new Q();
    }
    pushacts(acts:Act[]){

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
}

export class Q{
    protected dat:any[] = [];
    protected head:number;
    protected tail:number;
    
    constructor(protected size?:number){
        if (!this.size){
            this.size = 12;
        }
        for(let i=0; i<this.size;i++){
            this.dat[i] = null;
        }
        this.head = 0;
        this.tail = 0;
    }
    
    enq(item:any, filter?:Function){
        if (!filter || !filter(this.curt())){
            this.dat[this.tail] = item;
        }else{
            return;
        }
        if (this.tail+1>=this.size){
            this.tail = this.head;
            this.head++;
        }else{
            this.tail++;
        }
        if (this.head >= this.size){
            this.head = 0;
        }
    }

    curt(){
        return this.isempty()?null: this.dat[this.tail];
    }

    deq(){
        if (this.isempty()){
            return null;
        }
        let rlt = this.dat[this.tail];
        this.tail--;
        if (this.tail<0){
            this.tail = this.size - 1;
        }
        return rlt;
    }

    isempty(){
        return this.tail == this.head;
    }
}