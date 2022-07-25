pragma circom 2.0.0;

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit

// This is the "Bagels" variation: which has 10 digits (0-9) intead of 6 colors and 3 holes instead of 4

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template MastermindVariation() {
    // Public inputs - this is done by the verifier so that's why it's public
    signal input pubGuessA;
    signal input pubGuessB;
    signal input pubGuessC;
    //signal input pubGuessD; // don't need as only 3 inputs
    signal input pubNumHit; // the verifier inputs hits
    signal input pubNumBlow; // and blows - the circuit then makes sure they are correct
    signal input pubSolnHash;

    // Private inputs
    signal input privSolnA;
    signal input privSolnB;
    signal input privSolnC;
    //signal input privSolnD; // don't need as only 3 inputs
    signal input privSalt;

    // Output
    signal output solnHashOut;

    var guess[3] = [pubGuessA, pubGuessB, pubGuessC];
    var soln[3] =  [privSolnA, privSolnB, privSolnC];
    var j = 0;
    var k = 0;
    component lessThanGuess[3];
    component lessThanSoln[3];
    component equalGuess[3];
    component equalSoln[3];
    var equalIdx = 0;

    // Create a constraint that the solution and guess digits are all less than 10. (why is this 10 and not 6?)
    for (j=0; j<3; j++) {
        lessThanGuess[j] = LessThan(4);
        lessThanGuess[j].in[0] <== guess[j];
        lessThanGuess[j].in[1] <== 10;
        lessThanGuess[j].out === 1;
        lessThanSoln[j] = LessThan(4);
        lessThanSoln[j].in[0] <== soln[j];
        lessThanSoln[j].in[1] <== 10;
        lessThanSoln[j].out === 1;
        for (k=j+1; k<3; k++) {
            // Create a constraint that the solution and guess digits are unique. no duplication.
            equalGuess[equalIdx] = IsEqual();
            equalGuess[equalIdx].in[0] <== guess[j];
            equalGuess[equalIdx].in[1] <== guess[k];
            equalGuess[equalIdx].out === 0;
            equalSoln[equalIdx] = IsEqual();
            equalSoln[equalIdx].in[0] <== soln[j];
            equalSoln[equalIdx].in[1] <== soln[k];
            equalSoln[equalIdx].out === 0;
            equalIdx += 1;
        }
    }

    // Count hit & blow
    var hit = 0;
    var blow = 0;
    component equalHB[16];

    for (j=0; j<3; j++) { // for every position in the solution
        for (k=0; k<3; k++) { // for every position in the guess
            equalHB[3*j+k] = IsEqual(); // 0 if !=, 1 if ==
            equalHB[3*j+k].in[0] <== soln[j];
            equalHB[3*j+k].in[1] <== guess[k];
            blow += equalHB[3*j+k].out; // increase blows by 1 if it's the same digit in solution and guess
            if (j == k) { // if it's the same digit in solution and guess AND at the same position, decrease blows by 1 and increase hits by 1
                hit += equalHB[3*j+k].out;
                blow -= equalHB[3*j+k].out;
            }
        }
    }

    // Create a constraint around the number of hits
    component equalHit = IsEqual();
    equalHit.in[0] <== pubNumHit;
    equalHit.in[1] <== hit;
    equalHit.out === 1;
    
    // Create a constraint around the number of blows
    component equalBlow = IsEqual();
    equalBlow.in[0] <== pubNumBlow;
    equalBlow.in[1] <== blow;
    equalBlow.out === 1;

    // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(4);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== privSolnA;
    poseidon.inputs[2] <== privSolnB;
    poseidon.inputs[3] <== privSolnC;
    //poseidon.inputs[4] <== privSolnD;

    solnHashOut <== poseidon.out;
    pubSolnHash === solnHashOut;
}

component main {public [pubGuessA, pubGuessB, pubGuessC, pubNumHit, pubNumBlow,pubSolnHash]} = MastermindVariation();