# A simple library for state history management

## Basic usage

````ts 
let data = ''

const dataHistory = new HistoryState<string>({
    onRollback: (value: string) => {
        data = value
    },
    onRedo: (value: string) => {
        data = value
    },
    originalState = ''
})

data = 'hello'

dataHistory.registerChange(data)

dataHistory.rollback() // data === ''
data.redo() // data === 'hello'
````

## Manage multiple HistoryState

if you need to manage multiple HistoryState, pass a HistoryManager instance as the second param in the constructor

````ts
let hello = 'hello'
let world = 'world'

const statesHistory = new HistoryManager()

const helloStateHistory = new HistoryState({
    onRollback: (value: string) => {
        hello = value
    },
    onRedo: (value: string) => {
        hello = value
    },
    originalState: hello
}, statesHistory)

const worldStateHistory = new HistoryState({
    onRollback: (value: string) => {
        world = value
    },
    onRedo: (value: string) => {
        world = value
    },
    originalState: world
}, statesHistory)

hello = 'test'
helloStateHistory.registerChange(hello)

/* call the redo and rollback from HistoryManager */
statesHistory.rollback() // hello === 'hello'; world === 'world';
statesHistory.redo() // hello === 'test'; world === 'world';
````

In this case, don't call `redo()` and `rollback()` on the `HistoryState` instances but call theses methods from the `HistoryManager` instance

## Extend HistoryState
A class can extends the `HistoryState` class.
Instead of passing `onRedo` and `onRollback` in the options, these methods can be overriden.

````ts
type THistoryState = {hello: string, world: string}

class SomeData extends HistoryState<THistoryState> {

    notSaved = 'data not kept in history'
    #hello = 'hello'
    #world = 'world'

    constructor() {
        super({ hello: 'hello', world: 'world' })
    }

    get hello() {
        return this.#hello;
    }

    set hello(v: string) {
        this.#hello = v
        this.onChange()
    }

    get hello() {
        return this.#world;
    }

    set hello(v: string) {
        this.#world = v
        this.onChange()
    }
    
    onChange() {
        this.registerChange({
            hello: this.#hello,
            world: this.#world
        })
    }

    onRollback(s: THistoryState) {
        const { hello, world } = s
        this.#hello = hello
        this.#world = world
    }

    onRedo(s: THistoryState) {
        const { hello, world } = s
        this.#hello = hello
        this.#world = world
    }
}
````

Note:  Feel free to fork it and improve it