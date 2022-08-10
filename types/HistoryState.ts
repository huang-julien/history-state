export interface HistoryStateOpts<V> {
    /**
     * needed if the class is not extended
     */
    onStateChange?: (value: V, states: V[], type: 'redo'|'undo') => void

    /**
     * original state to assign if the state is empty
     */
    originalState: V
  }
  