import { IHistoryChange } from '../types/HistoryManager'

/**
 * class to store traces of History changes
 *
 * point and dispatch rollback/redo to HistoryState
 *
 */
export class HistoryManager {
	private __states: IHistoryChange[] = []
  
	private __pointer = -1
  
	get states (): IHistoryChange[] {
		return this.__states
	}

	get currentState(): Readonly<IHistoryChange>|undefined {
		return this.__states[this.__pointer] ?? undefined
	}
  
	get pointerPosition (): number {
		return this.__pointer
	}
  
	/**
     * trigger roll back by looping over the array state
     * @param count
     */
	rollback (count = 1): void {
		while (count > 0) {
			this.__states[this.__pointer > -1 ? this.__pointer : 0].instance.rollback()
			if (this.__pointer > -1) { this.__pointer-- }
			if (this.__pointer <= -1) { break }
			count--
		}
	}
  
	/**
     * reassign values with redo
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
  