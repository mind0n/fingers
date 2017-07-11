import {all, add, NamedFactory, Factory} from "../../kernel/src/common";
import {Act} from "./act";

export class Q<T>{
    protected dat:T[] = [];
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
    
    enq(item:T, filter?:Function){
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

    curt():T{
        return this.isempty()?null: this.dat[this.index(this.tail - 1)];
    }

    protected index(n:number){
        if (this.dat.length < 1 || n>=this.dat.length){
            return 0;
        }
        if (n<0){
            return this.dat.length - 1;
        }
        return n;
    }

    deq():T{
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

    isempty():boolean{
        return this.tail == this.head;
    }

    each(handler:Function){
        let p = this.head;
        while(p != this.tail){
            let item = this.dat[p];
            handler(item, p);
            p = this.index(p+1);
        }
        // all(this.dat, (item:T, i:number)=>{
        //     if (item){
        //         handler(item, i);
        //     }else{
        //         return true;
        //     }
        // });
    }
}