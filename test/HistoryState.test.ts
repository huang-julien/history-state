import { HistoryState } from './../src/HistoryState'
import { DataExtended } from './setupClass'
import { describe, expect, it, vi } from 'vitest'
import { HistoryManager } from '../src'

describe('test history state as a class', () => {

	const extended = new DataExtended()


	it('rollback', () => {
		extended.data = 'hello'
		expect(extended.data).toBe('hello')
		extended.undo()
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
		onStateChange: (value: string) => {
			data = value
		},
		originalState: ''
	})

	it('rollback', () => {
		data = 'hello'
		historyState.commitChange(data)
		expect(data).toBe('hello')
		historyState.undo()
		expect(data).toBe('')
	})

	it('redo', () => {
		historyState.redo()
		expect(data).toBe('hello')
	})
})

describe('test history state throws with HistoryManager', () => {
	const history = new HistoryManager()
	let data = ''

	const mockOnStateChange = vi.fn((val: string) => {
		data = val
	})

	const localHistory = new HistoryState<string>({
		onStateChange: mockOnStateChange,
		originalState: data
	}, history)

	it.fails('throw when undoing State', () => {
		expect(localHistory.undo).toThrowError('This HistoryState instance has a HistoryManager, please call undo from the HistoryManager instance')
	})

	it.fails('throw when redoing state', () => {
		expect(localHistory.redo).toThrowError('This HistoryState instance has a HistoryManager, please call undo from the HistoryManager instance')
	})
})