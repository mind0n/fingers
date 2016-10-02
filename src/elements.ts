/// <reference path="definitions.ts" />

Element.prototype.astyle = function actualStyle(props:string[]) {
	let el:Element = this;
	let compStyle:CSSStyleDeclaration = window.getComputedStyle(el, null);
	for (let i:number = 0; i < props.length; i++) {
		let style:string = compStyle.getPropertyValue(props[i]);
		if (style != null) {
			return style;
		}
	}
	return null;
};

Element.prototype.visible = function ():boolean{
	return this.style.display != 'none' && this.style.visibility != 'hidden'; 
};

Element.prototype.hide = function():void{
	this.style.display = 'none';
};

Element.prototype.show = function():void{
	this.style.display = '';
}

Element.prototype.ondispose = function(){
	var d = this._disposers;
	if (!d){
		d = [];
		this._disposers = d;
	}
	return d;
};

namespace wo{
	class Destroyer{
		disposing:boolean;
		destroying:boolean;
		static container:HTMLElement = document.createElement("div");
		static destroy(target:Element){
			if (!target.destroyStatus){
				target.destroyStatus = new Destroyer();
			}
			if (!target.destroyStatus.disposing){
				if (target.ondispose() && target.ondispose().length > 0){
					target.destroyStatus.disposing = true;
					for(let i of target.ondispose()){
						i.call(target);
					}
				}
				if (target.dispose){
					target.destroyStatus.disposing = true;
					target.dispose();
				}
			}
			if (!target.destroyStatus.destroying){
				target.destroyStatus.destroying = true;
				Destroyer.container.appendChild(target);
				for(let i in target){
					if (i.indexOf('$') == 0){
						let tmp:any = target[i];
						if (tmp instanceof HTMLElement){
							target[i] = null;
							tmp = null;
						}else{
							delete target[i];
						}
					}
				}
				Destroyer.container.innerHTML = '';
			}
		}
	}

	export function destroy(target:any):void{
		if (target.length > 0 || target instanceof Array){
			for(let i of target){
				Destroyer.destroy(i);
			}
		} else if (target instanceof Element){
				Destroyer.destroy(target);
		}
	}

	export function centerScreen(target:any){
		let rect = target.getBoundingClientRect();
		target.style.position = "fixed";
		target.style.left = "50%";
		target.style.top = "50%";
		target.style.marginTop = -rect.height / 2 + "px";
		target.style.marginLeft = -rect.width / 2 + "px";
	}
}