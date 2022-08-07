export interface HistoryStateOpts<V> {
    /**
     * needed if the class is not extended
     */
    onRollback?: (value: V, states: V[]) => void
  
    /**
     * needed if the class is not extended
     */
    onRedo?: (value: V, states: V[]) => void
    /**
     * original state to assign if the state is empty
     */
    originalState: V
  }
  