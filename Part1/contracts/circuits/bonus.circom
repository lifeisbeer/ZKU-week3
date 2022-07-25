// [bonus] implement an example game from part d

pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template GuessingGame() {
    // Public inputs
    signal input y; // this is the guess
    signal input pubSolnHash;

    // Private inputs
    signal input x; // this is the selection
    signal input privSalt;

    // Output
    signal output solnHashOut;
    signal output isYEqual; // indicates that y equals x
    signal output isYLess; // indicates that y is less than x

    component lessThanGuess = LessThan(7);
    lessThanGuess.in[0] <== y;
    lessThanGuess.in[1] <== 100; // range is 0-99
    lessThanGuess.out === 1;

    component lessThanSoln = LessThan(7);
    lessThanSoln.in[0] <== x;
    lessThanSoln.in[1] <== 100; // range is 0-99
    lessThanSoln.out === 1;

    // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== x;
    solnHashOut <== poseidon.out;
    pubSolnHash === solnHashOut;

    // check if y is equal to x
    component equal = IsEqual();
    equal.in[0] <== y;
    equal.in[1] <== x;
    isYEqual <== equal.out;

    // check if y is less than x
    component less = LessThan(7);
    less.in[0] <== y;
    less.in[1] <== x;
    isYLess <== less.out; // 1 if y is less than x, 0 otherwise
}

component main {public [y, pubSolnHash]} = GuessingGame();