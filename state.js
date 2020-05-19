const settings = require('./settings.json');
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

        if(settings.verbose) {
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

module.exports = State;