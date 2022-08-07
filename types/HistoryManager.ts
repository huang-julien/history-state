import { HistoryState } from '../src/HistoryState'

/**
 * define the instance to add to the history state
 */
export interface IHistoryChange {
    // eslint-disable-next-line
    instance: HistoryState<any>
    index: number
}
  