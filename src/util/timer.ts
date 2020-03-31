
/** Easy-to-use, object-oriented timer
 */
export class Timer {
    private id: any;
    
    constructor(callback: () => void, interval: number) {
        this.id = setInterval(callback, interval * 1000);
    }

    clear() {
        clearInterval(this.id);
    }
}
