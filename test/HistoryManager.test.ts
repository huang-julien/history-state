import { HistoryState } from './../src/HistoryState'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HistoryManager } from '../src'

describe('Test history Manager', () => {
	const history = new HistoryManager()
	let data = ''

	const mockRollback = vi.fn((val: string) => {
		data = val
	})

	const mockRedo = vi.fn((val: string) => {
		data = val
	})

	const localHistory = new HistoryState<string>({
		onRedo: mockRedo,
		onRollback: mockRollback,
		originalState: data
	}, history)

	const spyOnHistoryAddRollback = vi.spyOn(history, '__addRollback')

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('add a new entry in the localhistory', () => {
		expect(localHistory.currentState).toBe(data)
		data = 'hello'
		localHistory.registerChange(data)
		expect(data).toBe('hello')
		expect(localHistory.currentState).toBe(data)
		expect(mockRollback).toHaveBeenCalledTimes(0)
		expect(mockRedo).toHaveBeenCalledTimes(0)
		expect(localHistory.states).toHaveLength(1)
		expect(spyOnHistoryAddRollback).toHaveBeenCalledOnce()
		expect(history.states).toHaveLength(1)
		expect(history.pointerPosition).toBe(0)
	})

	it('trigger Rollback', () => {
		history.rollback()
		expect(data).toBe('')
		expect(mockRollback).toHaveBeenCalledOnce()
		expect(mockRedo).toHaveBeenCalledTimes(0)
		expect(history.states).toHaveLength(1)
		expect(history.pointerPosition).toBe(-1)
	})

	it('retrigger rollback (should not change anything)', () => {
		history.rollback()
		expect(data).toBe('')
		expect(mockRollback).toHaveBeenCalledOnce()
		expect(mockRedo).toHaveBeenCalledTimes(0)
		expect(history.states).toHaveLength(1)
		expect(history.pointerPosition).toBe(-1)
	})

	it('trigger redo', () => {
		history.redo()
		expect(data).toBe('hello')
		expect(mockRedo).toHaveBeenCalledOnce()
		expect(mockRollback).toHaveBeenCalledTimes(0)
	})

	it('trigger 2 change before rollback', () => {
		data = 'test 1'
		localHistory.registerChange(data)
		data = 'test 2'
		localHistory.registerChange(data)
		history.rollback()
		expect(data).toBe('test 1')
	})
})
