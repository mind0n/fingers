import {definitions} from "../../kernel/src/web/definition";
import {Toucher} from "./toucher";
import {Widget} from "../../kernel/src/web/widgets/widget";
import * as R from "./recognizer";

definitions();

let w:any = window;

R.Recognizers.instance.regist('touched', new R.TouchedRecognizer());
R.Recognizers.instance.regist('dragging', new R.DraggingRecognizer());
R.Recognizers.instance.regist('dragstart', new R.DragStartRecognizer());
R.Recognizers.instance.regist('dropped', new R.DroppedRecognizer());
R.Recognizers.instance.regist('dbltouched', new R.DblTouchedRecognizer());
R.Recognizers.instance.regist('pinchstart', new R.PinchStartRecognizer());
R.Recognizers.instance.regist('pinchmove', new R.PinchMoveRecognizer());
R.Recognizers.instance.regist('pinchend', new R.PinchEndRecognizer());

let t = new Toucher();
w.touch = t;

w.w = Widget;
Widget.init({

});
