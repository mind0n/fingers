import {all, add, NamedFactory, Factory} from "../../kernel/src/common";
import {Act} from "./act";
import {Pattern, Step, Steps} from "./steps";
import {Q} from "./q";

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
    hit(){
        return this.pattern.satisfied();
    }
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

export class DragStartRecognizer extends Recognizer{
    constructor(){
        super('dragstart');
        this.pattern
            .create().add(['tstart']).add(['tmove']).add(['tmove'])
            .create().add(['tstart']).add(['tmove']).add(['tmove']).add(['tmove']);
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