import {all, add, diff, NamedFactory, Factory} from "../../kernel/src/common";
import {Act} from "./act";
import {Pattern, Step, Steps} from "./steps";
import {Q} from "./q";

export class Recognizers{
    static instance:NamedFactory<Recognizer> = new NamedFactory<Recognizer>();
}

export abstract class Recognizer{
    protected isactive:boolean;
    protected pattern:Pattern;
    protected accurate:boolean;
    constructor(public name:string, accurate?:boolean){
        this.pattern = new Pattern();
        this.accurate = accurate;
    }
    abstract analyze(raq:Q<Act[]>, req:Q<Act>):void;
    reset(){
        this.isactive = false;
        this.pattern.reset();
    }
    abstract preview(raq:Q<Act[]>, req?:Q<Act>):boolean;
    hit(){
        return this.pattern.satisfied();
    }
    errored(){
        return this.pattern.iserrored();
    }
    parse(acts:Act[]){
        if (acts && acts.length > 0){
            return acts[0].copy(this.name, this.accurate);
        }
        return null;
    }
}

export class TouchedRecognizer extends Recognizer{
    constructor(){
        super('touched', true);
        this.pattern
            .create().add(['tstart']).add(['tend'])
            .create().add(['tstart']).add(['tmove']).add(['tend']);
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = raq.curt();
        let rcurt = req.curt();
        if (rcurt && rcurt.name == 'dragging'){
            this.isactive = false;
        }

        if (this.isactive || (curt && curt.length == 1 && curt[0].name == 'tstart')){
            this.isactive = true;
            return true;
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = raq.curt();
        this.pattern.check(curt);
    }
}

export class DragStartRecognizer extends Recognizer{
    constructor(){
        super('dragstart');
        this.pattern
            .create().add(['tstart']).add(['tmove']).add(['tmove']).add(['tmove']);
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = raq.curt();
        if (this.isactive || (curt && curt.length == 1 && curt[0].name == 'tstart')){
            this.isactive = true;
            return true;
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = raq.curt();
        this.pattern.check(curt);
    }
}

export class DraggingRecognizer extends Recognizer{
    constructor(){
        super('dragging');
        this.pattern
            .create().add(['tmove']);
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = req.curt();
        let acurt = raq.curt();
        if (acurt && acurt.length == 1){
            if (acurt[0].name == 'tend'){
                return false;
            }
            if (this.isactive || (curt && curt.name == 'dragstart')){
                this.isactive = true;
                return true;
            }
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = raq.curt();
        this.pattern.check(curt, true);
    }
}

export class DroppedRecognizer extends Recognizer{
    constructor(){
        super('dropped');
        this.pattern
            .create().add(['tend']);
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = raq.curt();
        let ecurt = req.curt();
        if (this.isactive 
            || (curt && curt.length == 1 && curt[0].name == 'tend' && ecurt.name == 'dragging')
            || (curt && curt.length > 1 && ecurt.name == 'dragging')){
            this.isactive = true;
            return true;
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = req.curt();
        if (curt && curt.name == 'dragging'){
            let raw = raq.curt();
            this.pattern.check(raw.length==1?raw:[new Act('tend', raw[0].pos, raw[0].context)]);
        }else{
            this.pattern.error();
        }
    }
}

export class DblTouchedRecognizer extends Recognizer{
    protected firstouched:Act;
    constructor(){
        super('dbltouched');
        this.pattern
            .create().add(['touched']).add(['touched']);
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = req.curt();
        if (this.isactive || (curt && curt.name == 'touched')){
            this.isactive = true;
            return true;
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = req.curt();
        if (!this.firstouched){
            this.firstouched = curt;
        }else{
            let d = diff(curt.time, this.firstouched.time);
            if (d<200){
                this.pattern.check([curt]);
                this.pattern.check([this.firstouched]);
            }else{
                this.pattern.error();
            }
        }
    }
}

export class PinchStartRecognizer extends Recognizer{
    constructor(){
        super('pinchstart');
        this.pattern
            .create().add(['tmove', 'tmove']);
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = raq.curt();
        if (curt.length == 2){
            let a = curt[0];
            let b = curt[0];
            if (a.name == 'tmove' && b.name == 'tmove'){
                return true;
            }
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = req.curt();
        let acurt = raq.curt();
        if (!curt || (curt.name != 'pinchstart' && curt.name != 'pinchmove')){
            this.pattern.check(acurt);
        }else{
            this.pattern.error();
        }
    }
}

export class PinchMoveRecognizer extends Recognizer{
    constructor(){
        super('pinchmove');
        this.pattern
            .create().add(['tmove', 'tmove']);
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = raq.curt();
        if (curt.length == 2){
            let a = curt[0];
            let b = curt[1];
            if (a.name == 'tmove' && b.name == 'tmove'){
                return true;
            }
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = req.curt();
        let acurt = raq.curt();
        if (curt && (curt.name != 'pinchend')){
            this.pattern.check(acurt);
        }else{
            this.pattern.error();
        }
    }
}

export class PinchEndRecognizer extends Recognizer{
    constructor(){
        super('pinchend');
        this.pattern
            .create().add(['tstart'])
            .create().add(['tmove'])
            .create().add(['tend'])
            ;
    }
    preview(raq:Q<Act[]>, req?:Q<Act>){
        let curt = raq.curt();
        let ecurt = req.curt();
        if (curt.length == 1 && ecurt.name == 'pinchmove'){
            return true;
        }else if (curt.length == 2){
            let a = curt[0];
            let b = curt[1];
            if (a.name == 'tend' || b.name == 'tend'){
                return true;
            }
        }
        return false;
    }
    analyze(raq:Q<Act[]>, req:Q<Act>){
        let curt = req.curt();
        let acurt = raq.curt();
        if (curt && (curt.name == 'pinchmove' || curt.name == 'pinchstart')){
            this.pattern.satisfy();
        }else{
            this.pattern.error();
        }
    }
}