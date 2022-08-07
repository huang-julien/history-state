import { HistoryState } from './../src/HistoryState'
import { DataExtended } from './setupClass'
import { describe, expect, it } from 'vitest'

describe('test history state as a class', () => {

	const extended = new DataExtended()


	it('rollback', () => {
		extended.data = 'hello'
		expect(extended.data).toBe('hello')
		extended.rollback()
		expect(extended.data).toBe('')
	})

	it('redo', () => {
		extended.redo()
		expect(extended.data).toBe('hello')
	})
})

describe('test history state as standalone', () => {
	let data = ''

	const historyState = new HistoryState<string>({
		onRedo: (value: string) => {
			data = value
		},
		onRollback: (value: string) => {
			data = value
		},
		originalState: ''
	})

	it('rollback', () => {
		data = 'hello'
		historyState.registerChange(data)
		expect(data).toBe('hello')
		historyState.rollback()
		expect(data).toBe('')
	})

	it('redo', () => {
		historyState.redo()
		expect(data).toBe('hello')
	})
})