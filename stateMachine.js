const settings = require('./settings.json');
class StateMachine {
    constructor() {
        this.states = [];
        this.startState = null;
        this.endStates = [];
        this.stateHistory = [];
    }

    addState(state) {
        this.states.push(state);

        if(state.isEnd) {
            this.endStates.push(state);
        }
    }

    setStart(state) {
        this.startState = state;
    }

    run(cargo) {
        this.stateHistory = [];
        let state = this.startState;

        if(!this.startState) {
            throw 'Must call .setStart() before .run()'
        }

        if(this.endStates.length < 1) {
            throw 'There must be at least one endState'
        }

        while(true) {
            // Run the cargo through the current state
            let newState = state.run(cargo);

            this.addStateToHistory(state);

            // Get the new cargo
            cargo = state.cargo;

            if(this.endStates.includes(newState)) {
                if(cargo.length === 0) {
                    if(settings.verbose) {
                        console.log("Reached", newState.name);
                    }

                    // Return whether the word is valid or not, depending on the end state
                    return {
                        valid: newState.valid,
                        history: this.stateHistory,
                    };
                }
            }
            state = newState;
        }
    }

    addStateToHistory(state) {
        this.stateHistory.push({
            name: state.name,
            newState: state.newState.name,
            letter: state.letter
        })

    }
}

module.exports = StateMachine;