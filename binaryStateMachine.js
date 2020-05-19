const StateMachine = require('./stateMachine');
const State = require('./state');
const words = require('./words');

const settings = require('./settings.json');

const states = [
    new State("z0"),
    new State("z1"),
    new State("z2", true),
    new State("error", true)
];

let machine;
const main = () => {
    /*
    *
    * Set evaluation functions for each state
    * (except the Error state)
    * 
    */

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

    states[3].setEval(() => states[3]);


    states[2].valid = true; //If ending at state 2 = valid word
    states[3].valid = false //If ending at state 3 (error) = invalid word

    // Initialize the state machine
    machine = new StateMachine();

    // Add all states
    for(let state of states) {
        machine.addState(state);
    }
    // Set the start state
    machine.setStart(states[0]);
}

const run = (word) => {
    return machine.run(word);
}

module.exports.init = main;
module.exports.run = run;

// main();
// let count = 0;
// words(1000).forEach(word => {
//     // if(count > 10) return;
//     const valid = machine.run(word).valid;
//     if(!settings.showOnlyValid || valid) {
//         count++;
//         console.log(word);
//     }
// });
// console.log("Count:",count);