import brick from 'trik_brick';
import script from 'trik_script';

import { delay } from '../util/common'; /* TODO: maybe something can be done to TS relative imports? They are quite annoying... */

class WorkingClass {
    private prop: number;
    constructor(param: number) {
        this.prop = param;
    }

    get_prop() {
        return this.prop;
    }
}

export function example_main() {
    
    const display = brick.display();
    display.clear()
    display.addLabel("Hello, trik", 0, 0);

    console.log("You can use many standard JS APIs!");
    
    setInterval(() => console.log("And even lambdas!"), 1000);
    
    /* This one is non-standard, as  */
    delay(2);
    
    console.log("Array pretty-printing:", [1,2,3]);
    console.log("Object pretty-printing:", {"a":1, "b": "fun", "c": {}});
    console.log("Class pretty-printing:", new WorkingClass(42));

    
    script.writeToFile("file.txt", "Hello, file API");
    
    console.log("Happy hacking!");
};
