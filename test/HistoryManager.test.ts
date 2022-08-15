import { HistoryState } from './../src/HistoryState'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HistoryManager } from '../src'

describe('Test history Manager', () => {
	const history = new HistoryManager()
	let data = ''

	const mockOnStateChange = vi.fn((val: string) => {
		data = val
	})

	const localHistory = new HistoryState<string>({
		onStateChange: mockOnStateChange,
		originalState: data
	}, history)

	const spyOnHistoryAddRollback = vi.spyOn(history, '__addRollback')

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('add a new entry in the localhistory', () => {
		expect(localHistory.currentState).toBe(data)
		data = 'hello'
		localHistory.commitChange(data)
		expect(data).toBe('hello')
		expect(localHistory.currentState).toBe(data)
		expect(mockOnStateChange).toHaveBeenCalledTimes(0)
		expect(localHistory.states).toHaveLength(1)
		expect(spyOnHistoryAddRollback).toHaveBeenCalledOnce()
		expect(history.states).toHaveLength(1)
		expect(history.pointerPosition).toBe(0)
	})

	it('trigger Rollback', () => {
		history.undo()
		expect(data).toBe('')
		expect(mockOnStateChange).toHaveBeenCalledOnce()
		expect(history.states).toHaveLength(1)
		expect(history.pointerPosition).toBe(-1)
	})

	it('retrigger rollback (should not change anything)', () => {
		history.undo()
		expect(data).toBe('')
		expect(mockOnStateChange).toHaveBeenCalledOnce()
		expect(history.states).toHaveLength(1)
		expect(history.pointerPosition).toBe(-1)
	})

	it('trigger redo', () => {
		history.redo()
		expect(data).toBe('hello')
		expect(mockOnStateChange).toHaveBeenCalledOnce()
	})

	it('trigger 2 change before rollback', () => {
		data = 'test 1'
		localHistory.commitChange(data)
		data = 'test 2'
		localHistory.commitChange(data)
		history.undo()
		expect(data).toBe('test 1')
	})
})
