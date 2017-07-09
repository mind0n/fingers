import {all, add, NamedFactory, Factory} from "../../kernel/src/common";
import {Act} from "./act";

export class Recognizers{
    static instance:NamedFactory<Recognizer> = new NamedFactory<Recognizer>();
}

export abstract class Recognizer{
    protected isactive:boolean;
    protected pattern:Pattern;
    constructor(public name:string){
        this.pattern = new Pattern();
    }
    abstract analyze(raq:Q<Act[]>, req:Q<Act[]>):void;
    reset(){
        this.isactive = false;
        this.pattern.reset();
    }
    abstract preview(raq:Q<Act[]>):boolean;
}

export class TouchedRecognizer extends Recognizer{
    constructor(){
        super('touched');
        this.pattern
            .create().add(['tstart']).add(['tend'])
            .create().add(['tstart']).add(['tmove']).add(['tend']);
    }
    preview(raq:Q<Act[]>){
        let curt = raq.curt();
        if (this.isactive || (curt.length == 1 && curt[0].name == 'tstart')){
            this.isactive = true;
            return true;
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act[]>){
        let curt = raq.curt();
        this.pattern.check(curt);
    }
}

export class Step{
    status:boolean;
    constructor(public name:string[]){

    }
    reset(){
        this.status = false;
    }
}
export class Steps extends Factory<Step>{
    errored:boolean;
    reset(){
        all(this.list, (item:Step, i:number)=>{
            item.status = false;
        });
    }
    add(name:string[]){
        this.regist(new Step(name));
        return this;
    }
    arrived():boolean{
        let rlt = true;
        all(this.list, (item:Step, i:number)=>{
            rlt = rlt && item.status;
        });
        return rlt;
    }
    check(acts:Act[]){
        let step = <Step>all(this.list, (step:Step, i:number)=>{
            if (!step.status){
                return true;
            }
        }, null, true);
        if (acts.length == step.name.length){
            let rlt = true;
            let idx = -1;
            all(acts, (act:Act, i:number)=>{
                let n = step.name[i];
                if (act.name != n){
                    rlt = false;
                    idx = i;
                    return true;
                }
            });
            if (rlt){
                step.status = true;
            }else if (idx > 0){
                this.errored = true;
            }
        }else{
            this.errored = true;
        }
    }
}
export class Pattern{
    protected q:Q<Steps>
    constructor(){
        this.q = new Q<Steps>();
    }
    create():Pattern{
        let steps = new Steps();
        this.q.enq(steps);
        return this;
    }
    add(name:string[]):Pattern{
        let curt = this.q.curt();
        curt.add(name);
        return this;
    }
    check(acts:Act[]){
        this.q.each((steps:Steps, i:number)=>{
            if (!steps.errored){
                steps.check(acts);
            }
        });
    }
    satisfied():boolean{
        let rlt = false;
        this.q.each((item:Steps, i:number)=>{
            if (item.arrived()){
                rlt = true;
                return true;
            }
        });
        return rlt;
    }
    reset(){
        this.q.each((item:Steps, i:number)=>{
            item.reset();
        });
    }
}

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