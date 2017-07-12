import {all, add, NamedFactory, Factory} from "../../kernel/src/common";
import {Act} from "./act";
import {Q} from "./q";

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
        this.errored = false;
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
        return rlt && !this.errored;
    }
    check(acts:Act[], repeat?:boolean){
        let step = <Step>all(this.list, (step:Step, i:number)=>{
            if (!step.status){
                return true;
            }
        }, null, repeat);
        if (!step){
            this.errored = true;
        }else{
            if (acts && acts.length == step.name.length){
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
    error(){
        this.q.each((item:Steps, i:number)=>{
            item.errored = true;
        });
    }
    check(acts:Act[], repeat?:boolean){
        this.q.each((steps:Steps, i:number)=>{
            if (!steps.errored){
                steps.check(acts, repeat);
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
