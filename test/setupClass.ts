import { HistoryState } from './../src/HistoryState'


export class DataExtended extends HistoryState<string> {

	private __data = ''

	constructor() {
		super({
			originalState: ''
		})
	}

	onRedo(value: string) {
		this.__data = value
	}

	onRollback(value: string) {
		this.__data = value
	}

	get data() {
		return this.__data
	}

	set data(value: string) {
		this.__data = value
		this.registerChange(value)
	}
}