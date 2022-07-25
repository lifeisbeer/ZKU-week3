// [bonus] unit test for bonus.circom

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

describe("Bonus Test:", function () {
    this.timeout(100000000);

    it("Success Test 1: Correct guess", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 42;
        const y = 42;
        const salt = 123;
        const hash = await poseidonHash([salt, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
        assert(Fr.eq(Fr.e(witness[2]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[3]),Fr.e(0)));
    });   
    
    it("Success Test 2: Incorrect guess, y less than x", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 42;
        const y = 0;
        const salt = 123;
        const hash = await poseidonHash([salt, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
        assert(Fr.eq(Fr.e(witness[2]),Fr.e(0)));
        assert(Fr.eq(Fr.e(witness[3]),Fr.e(1)));
    });

    it("Success Test 3: Incorrect guess, y greater than x", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 42;
        const y = 99;
        const salt = 123;
        const hash = await poseidonHash([salt, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));
        assert(Fr.eq(Fr.e(witness[2]),Fr.e(0)));
        assert(Fr.eq(Fr.e(witness[3]),Fr.e(0)));
    });

    it("Failure Test 4: y out of range (>99)", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 42;
        const y = 100;
        const salt = 123;
        const hash = await poseidonHash([salt, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("Failure Test 5: y out of range (negative)", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 42;
        const y = 100;
        const salt = 123;
        const hash = await poseidonHash([salt, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("Failure Test 6: x out of range (>99)", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 101;
        const y = 12;
        const salt = 123;
        const hash = await poseidonHash([salt, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("Failure Test 7: x out of range (negative)", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = -100;
        const y = 21;
        const salt = 123;
        const hash = await poseidonHash([salt, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("Failure Test 8: Wrong hash, different salt", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 1;
        const y = 2;
        const salt = 123;
        const hash = await poseidonHash([4, x]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
            "privSalt": salt
        };

        try {
            circuit.calculateWitness(INPUT, true);
        } catch (e) {
            error = e.message;
            assert(error.includes("Error: Error: Assert Failed."));
        }
    });

    it("Failure Test 8: Wrong hash, different x", async function () {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom"); // Get the circuit
        const x = 1;
        const y = 2;
        const salt = 123;
        const hash = await poseidonHash([salt, 3]);
        const INPUT = {
            "y": y,
            "pubSolnHash": hash,
            "x": x,
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