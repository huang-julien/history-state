import { clone, isEqual } from 'lodash'
import { HistoryStateOpts } from '../types/HistoryState'
import { HistoryManager } from './HistoryManager'

/**
 * class to handle modifications state
 * @paramType S - define the type of value stored in the state
 * can be extended or implemented in an object
 */
export class HistoryState<S> {
	/**
	 * pointer to the current state array index
	 * @protected
	 */
	protected __pointer = -1

	/**
	 * original value to assign if the state array is empty
	 * @protected
	 */
	protected __originalState: S

	/**
	 * array state
	 * @protected
	 */
	protected __states: S[] = []

	/**
	 * instance to the history manager
	 * @protected
	 */
	protected __historyManager: HistoryManager | undefined

	/**
	 * callback to trigger when rollbacking
	 * @protected
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onRollback(_val: S, _states: S[]): void {
		console.warn('please extend onRedo() or pass the callback in the options')
	}

	/**
	 * callback to trigger when redoing
	 * @protected
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onRedo(_val: S, _states: S[]): void {
		console.warn('please extend onRedo() or pass the callback in the options')
	}

	constructor(opts: HistoryStateOpts<S>, historyManager?: HistoryManager) {
		if (historyManager) {
			if (!(historyManager instanceof HistoryManager)) throw new TypeError('historyManager must be an instance of HistoryManager')
			this.__historyManager = historyManager
		}
		const { onRollback, onRedo, originalState } = opts
		if(onRollback) {
			this.onRollback = onRollback
		}
		if(onRedo) {
			this.onRedo = onRedo
		}
		this.__originalState = clone(originalState)
	}

	/**
	 * get the modification state list
	 * Frozen to avoid accidental modifications
	 */
	get states(): Readonly<S[]> {
		return this.__states
	}

	/**
	 * get the current state
	 * Frozen to avoid accidental modifications
	 */
	get currentState(): S {
		return this.__pointer > -1 ? this.__states[this.__pointer] : this.__originalState
	}

	/**
	 * rollback to previous state
	 * should be triggered only by the HistoryManager if this is in a history manager instance
	 */
	rollback(): void {
		this.__pointer--
		if (this.__pointer <= -1) {
			this.onRollback(this.__originalState, this.__states)
			this.__pointer = -1
		} else {
			this.onRollback(this.__states[this.__pointer], this.__states)
		}
	}

	/**
	 * redo to next state
	 * should be triggered only by the HistoryManager if this is in a history manager instance
	 */
	redo(): void {
		if (this.__states.length > this.__pointer + 1) {
			this.__pointer++
			this.onRedo(this.__states[this.__pointer], this.__states)
		}
	}

	/**
	 * add a new state into the state array
	 * if the pointer is not pointing at the last index of the array state
	 * remove all states after the pointer before adding
	 * @param value
	 */
	registerChange(value: S): void {
		if (!isEqual(value, this.__states[this.__pointer])) {
			this.__states.length = this.__pointer + 1 >= -1 ? this.__pointer + 1 : 0
			this.__states.push(value)
			this.__pointer++
			if (this.__historyManager) {
				this.__historyManager.__addRollback({
					instance: this,
					index: this.__pointer
				})
			}
		}
	}
}