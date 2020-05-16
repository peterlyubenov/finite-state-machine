const _ = require('underscore');
const verbose = false;

class StateMachine {
    constructor() {
        this.states = [];
        this.startState = null;
        this.endStates = [];
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

            // Get the new cargo
            cargo = state.cargo;

            if(this.endStates.includes(newState)) {
                if(cargo.length === 0) {
                    if(verbose) {
                        console.log("Reached", newState.name);
                    }

                    console.log(newState.valid)

                    break;
                }
            }
            state = newState;
        }
    }
}

class State {
    constructor(name, endState = 0) {
        this.name = name;
        this.isEnd = endState;
    }

    // Set the evaluation function for the state
    // evaluation function = function that chooses the new state
    setEval(callback) {
        this.eval = callback;
    }

    callback() {
        // Print to the console the current letter, state and new state

        if(verbose) {
            console.log("Letter:", this.letter, "State:", this.name , "New State:", this.newState.name);
        }
    }

    prepare() {
        // Set the letter we're working on
        this.letter = this.cargo.substring(0, 1);

        // Remove the letter we're working on from the cargo
        this.cargo = this.cargo.substring(1);
    }

    run(cargo) {
        this.cargo = cargo;
        // Prepare the data
        this.prepare();

        // Choose the new state based on the input
        this.newState = this.eval(this.letter, this.cargo);

        // Perform the callback function i.e. print information to the console
        this.callback();

        // Return the new state and new cargo
        return this.newState;
    }
}

const states = [
    new State("z0"),
    new State("z1"),
    new State("z2", true),
    new State("error", true)
];


states[0].setEval((letter, cargo) => {
    // If 1 => keep same state
    if(letter === "1") return states[0];

    // If 0 => if this is the only 0 in the cargo then move to z2, otherwise z1
    if(letter === "0") return cargo.includes("0") ? states[1] : states[2]

    // Error
    return states[3];
});

states[1].setEval((letter) => {
    if(letter === "1") return states[1];
    if(letter === "0") return states[2];
    // Error
    return states[3];
});

states[2].setEval(letter => {
    if(letter === "1") return states[2];
    // Error
    return states[3];
})

states[2].valid = true; //If ending at state 2 = valid word
states[3].valid = false //If ending at state 3 (error) = invalid word

const machine = new StateMachine();

// Add all states
for(let state of states) {
    machine.addState(state);
}
// Set the start state
machine.setStart(states[0]);

machine.run("01010");