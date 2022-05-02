/**
 * Used listen to changes in the events
 * 
 * It will automatically resize and manipulate with containers when state changes
 * @class State
 */
class State {
    current: boolean
    previous: boolean

    constructor(value: boolean) {
        this.current = value;
        this.previous = value;
    }

    get updated(): boolean {
        if (this.previous !== this.current) {
            this.previous = this.current;
            return true;
        }
        return false;
    }

    update(value: boolean): void {
        this.current = value;
    }
}
export default State;