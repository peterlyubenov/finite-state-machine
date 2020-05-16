const _ = require('underscore');
const states = { 
    error: 4,
    z0: 0,
    z1: 1,
    z2: 2,
}

class StateMachine {
    constructor() {
        this.handlers = {};
        this.startState = null;
        this.endStates = [];
    }

    addState(name, handler, endState = 0) {
        name = name;
        this.handlers[name] = handler;

        if(endState) {
            this.endStates.push(name);
        }
    }

    setStart(name) {
        this.startState = name;
    }

    run(cargo) {
        let handler = this.handlers[this.startState];

        if(handler === undefined) {
            throw 'Must call .setStart() before .run()'
        }

        if(this.endStates.length < 1) {
            throw 'There must be at least one endState'
        }

        while(true) {
            let newState;
            ({ newState, cargo } = handler(cargo));

            if(this.endStates.includes(newState)) {
                if(cargo.length === 0) {
                    console.log("Reached", _.invert(states)[newState]);
                    break;
                }
            }
            handler = this.handlers[newState];
        }
    }
}

class State {
    constructor(name, endState = 0) {
        this.name = name;
        this.endState = endState;
    }

    // Set the evaluation function for the state
    // evaluation function = function that chooses the new state
    setEval(callback) {
        this.eval = callback;
    }

    callback() {
        // Print to the console the current letter, state and new state
        console.log("Letter:", this.letter, "State:", _.invert(states)[state], "New State:", _.invert(states)[newState]);
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
        this.newState = this.eval(this.letter);

        // Perform the callback function i.e. print information to the console
        this.callback();

        // Return the new state and new cargo
        return { newState: this.newState, cargo: this.cargo };
    }
}

const machine = new StateMachine();

const prepareCargo = (cargo, state) => {
    const letter = cargo.substring(0, 1);
    const newState = state;
          cargo = cargo.substring(1);

    return {letter, newState, cargo};
}

const callback = (letter, state, newState) => {
    console.log("Letter:", letter, "State:", _.invert(states)[state], "New State:", _.invert(states)[newState]);
}

machine.addState(states.z0, (cargo) => {
    let letter, newState;
    ({letter, newState, cargo} = prepareCargo(cargo, states.z0));

    if(letter === "0") {
        newState = cargo.includes("0") ? states.z1 : states.z2;
    } else if(letter !== "1") {
        newState = states.error;
    }

    callback(letter, states.z0, newState);

    return { newState, cargo };
});

machine.addState(states.z1, (cargo) => {
    let letter, newState;
    ({letter, newState, cargo} = prepareCargo(cargo, states.z1));

    if(letter === "0") {
        newState = states.z2;
    } else if(letter !== "1") {
        newState = states.error;
    }

    callback(letter, states.z1, newState);

    return { newState, cargo };
});

machine.addState(states.z2, (cargo) => {
    let letter, newState;
    ({letter, newState, cargo} = prepareCargo(cargo, states.z2));

    if(letter !== "1") {
        newState = states.error;
    }

    callback(letter, states.z2, newState);

    return { newState, cargo };
}, true);

machine.addState(states.error, null, true);
machine.setStart(states.z0);

console.log("01011");
machine.run("01011");