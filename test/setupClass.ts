import { HistoryState } from './../src/HistoryState'


export class DataExtended extends HistoryState<string> {

	private __data = ''

	constructor() {
		super({
			originalState: ''
		})
	}

	__onStateChange(value: string) {
		this.__data = value
	}

	get data() {
		return this.__data
	}

	set data(value: string) {
		this.__data = value
		this.commitChange(value)
	}
}