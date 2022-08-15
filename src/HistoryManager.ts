import { IHistoryChange } from '../types/HistoryManager'

/**
 * class to store traces of History changes
 *
 * point and dispatch rollback/redo to HistoryState
 *
 */
export class HistoryManager {
	/**
	 * stack of IHistoryChange
	 */
	private __states: IHistoryChange[] = []
  
	/**
	 * current pointer
	 */
	private __pointer = -1
  
	/**
	 * return the states stack
	 */
	get states (): IHistoryChange[] {
		return this.__states
	}

	/**
	 * getter of the current state
	 */
	get currentState(): Readonly<IHistoryChange>|undefined {
		return this.__states[this.__pointer] ?? undefined
	}
  
	/**
	 * getter of the pointer
	 */
	get pointerPosition (): number {
		return this.__pointer
	}
  
	/**
	 * It rolls back the state of the object to the previous state
	 * @param count - The number of states to rollback.
	 */
	rollback (count = 1): void {
		while (count > 0) {
			this.__states[this.__pointer > -1 ? this.__pointer : 0].instance.undo()
			if (this.__pointer > -1) { this.__pointer-- }
			if (this.__pointer <= -1) { break }
			count--
		}
	}
  
	/**
	 * If there are more states than the current pointer, increment the pointer and call the redo function
	 * of the state at the current pointer
	 */
	redo (): void {
		if (this.__states.length > (this.__pointer + 1)) {
			this.__pointer++
			const change = this.__states[this.__pointer]
			change.instance.redo()
		}
	}

	/**
     * add new states into the state array
     * if the pointer is not pointing at the last index of the array state
     * remove all states after the pointer before adding
     * @param change
	 * should be oly triggered by the HistoryState class
     */
	__addRollback (change: IHistoryChange): void {
		if (this.__states.length > 0 && this.__pointer < (this.__states.length - 1)) {
			this.__states.length = (this.__pointer + 1)
		}
		this.__states.push(change)
		this.__pointer++
	}
}
  