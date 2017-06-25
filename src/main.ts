import {definitions} from "../../kernel/src/web/definition";
import {Toucher} from "./toucher";
import {Widget} from "../../kernel/src/web/widgets/widget";

definitions();

let w:any = window;
let t = new Toucher();
w.touch = t;

w.w = Widget;
Widget.init({

});
