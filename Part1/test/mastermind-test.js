//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const { assert } = require("chai");
const { buildPoseidon } = require('circomlibjs')
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;

exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const poseidonHash = async (items) => {
    let poseidon = await buildPoseidon()
    return poseidon.F.toObject(poseidon(items))
}

describe("MastermindVariation Success Test: Tests where the circuit should work", function () {
    this.timeout(100000000);

    it("T1: Correct guess, 3 hits, 0 blows", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [0, 1, 2];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 3;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
    });

    it("T2: Incorrect guess, 0 hits, 0 blows", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [3, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
    });

    it("T3: Incorrect guess, 1 hit, 0 blows", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [0, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 1;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
    });

    it("T4: Incorrect guess, 0 hits, 1 blow", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [3, 0, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 1;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
    });

    it("T5: Incorrect guess, 1 hit, 1 blow", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [0, 2, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 1;
        const blows = 1;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
    });
});

describe("MastermindVariation Failure Test: Tests where the circuit should throw an error", function () {
    this.timeout(100000000);

    it("T6: Solution out of range (>10)", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [10, 1, 2];
        const guess = [3, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T7: Solution out of range (negative)", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [-1, 1, 2];
        const guess = [3, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T8: Guess out of range (>10)", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [99, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T9: Guess out of range (negative)", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [-100, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T10: Repeated digit in solution", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [1, 1, 2];
        const guess = [3, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T11: Repeated digit in guess", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [3, 3, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T12: Wrong number of hits", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [0, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T13: Wrong number of blows", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [2, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T14: Wrong hash, different salt", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [3, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([567, sol[0], sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("T15: Wrong hash, different solution", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom"); // Get the circuit
        const sol = [0, 1, 2];
        const guess = [3, 4, 5];
        const salt = 123;
        const hash = await poseidonHash([salt, 9, sol[1], sol[2]]);
        const hits = 0;
        const blows = 0;
        const INPUT = {
            "pubGuessA": guess[0],
            "pubGuessB": guess[1],
            "pubGuessC": guess[2],
            "pubNumHit": hits,
            "pubNumBlow": blows,
            "pubSolnHash": hash,
            "privSolnA": sol[0],
            "privSolnB": sol[1],
            "privSolnC": sol[2],
            "privSalt": salt
        };
        
        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });
        
});