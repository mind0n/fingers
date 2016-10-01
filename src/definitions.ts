interface Window{
	opr:any;
	opera:any;
	chrome:any;
	StyleMedia:any;
	InstallTrigger:any;
	CSS:any;
}

interface Document{
	documentMode:any;
}
interface Object{
	read(keys:string[]):any;
	write(keys:string[], val:any):void;
}

interface Element{
	[name:string]:any;
	astyle(styles:string[]):string;
	set(val:any):void;
	get(keys:string[]):any;
	destroyStatus:any;
	ondispose:Function;
	dispose():any;
	visible():boolean;
	hide():void;
	show():void;
}

interface Node{
	cursor:any;
}

interface String{
	startsWith(str:string):boolean;
}

interface Array<T>{
	add(item:T):void;
	clear(del?:boolean):void;
}

Array.prototype.add = function (item:any) {
	this[this.length] = item;
}

Array.prototype.clear = function (keepalive?:boolean) {
	let n = this.length;
	for(let i = n - 1; i >= 0; i--){
		let tmp = this.pop();
		tmp = null;
	}
}
