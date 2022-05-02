/**
 * Used listen to changes in the events
 * 
 * It will automatically resize and manipulate with containers when state changes
 * @class State
 */
class State {
    /**
     * Current state
     */
    current: boolean

    /**
     * Previous state
     */
    previous: boolean

    constructor(value: boolean) {
        this.current = value;
        this.previous = value;
    }

    /**
     * @returns If state has changed and automatically changes it
     */
    get updated(): boolean {
        if (this.previous !== this.current) {
            this.previous = this.current;
            return true;
        }
        return false;
    }

    /**
     * Updates current value
     */
    update(value: boolean): void {
        this.current = value;
    }
}
export default State;