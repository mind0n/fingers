import {definitions} from "../../kernel/src/web/definition";
import {Toucher} from "./toucher";
import {Widget} from "../../kernel/src/web/widgets/widget";
import {Recognizers, TouchedRecognizer} from "./recognizer";

definitions();

let w:any = window;

Recognizers.instance.regist('touched', new TouchedRecognizer())

let t = new Toucher();
w.touch = t;

w.w = Widget;
Widget.init({

});
