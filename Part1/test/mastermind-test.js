
const  {assert,expect} =require('chai');
// make assert assertions available
const {buildPoseidon} = require('circomlibjs');
const BigNumber=require('bignumber.js');

const wasm_tester = require("circom_tester").wasm;//tools for testing circom circuits
const ethers=require('ethers');
const F1Field = require("ffjavascript").F1Field;//import finitefield library
const Scalar = require("ffjavascript").Scalar;//import BN254 curve scalar field
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");//return Bigint
const Fr = new F1Field(exports.p);//create new instance
const poseidonHash= async (items) => {
    let poseidon =await buildPoseidon()
    return ethers.BigNumber.from(poseidon.F.toObject(poseidon(items)))
}
describe("MastermindVariation", function () {// test MasterMind
    this.timeout(100000000);//timeout here at 100000000ms


    it("Circuit should calculate hash correctly ", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,1,2])
        const INPUT = {
            "pubGuessA": 0,
            "pubGuessB": 1,
            "pubGuessC": 2,
            "pubNumHit": 3,
            "pubNumBlow": 0,
            "pubSolnHash": hash,
            "privSolnA": 0,
            "privSolnB": 1,
            "privSolnC": 2,
            "privSalt": 99
        }  //declaration INPUT

        const witness = await circuit.calculateWitness(INPUT, true);//calucutate witness

        //console.log(witness);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));//Checking values with the assert statement
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));//Checking values with the assert statement

    });

    it("Circuit should calculate the other hash correctly changing salt", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([9,0,1,2])
        const INPUT = {
            "pubGuessA": 0,
            "pubGuessB": 1,
            "pubGuessC": 2,
            "pubNumHit": 3,
            "pubNumBlow": 0,
            "pubSolnHash": hash,
            "privSolnA": 0,
            "privSolnB": 1,
            "privSolnC": 2,
            "privSalt": 9
        }  //declaration INPUT

        const witness = await circuit.calculateWitness(INPUT, true);//calucutate witness

        //console.log(witness);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));//Checking values with the assert statement
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(hash)));//Checking values with the assert statement

    });

    it("Circuit should throw error with incorrect pubSolnHash ", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function

        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "1",
            "pubGuessC": "2",
            "pubNumHit": "3",
            "pubNumBlow": "0",
            "pubSolnHash":"28054929462613959132618176309409091057936595674898044978371379484577693889586",
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT
        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));

    });

    it("Circuit should throw error if wrong public hit  ", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,1,2])

        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "1",
            "pubGuessC": "2",
            "pubNumHit": "33",
            "pubNumBlow": "0",
            "pubSolnHash":hash,
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT
        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));

    });

    it("Circuit should throw error if wrong public blow  ", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,1,2])

        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "1",
            "pubGuessC": "2",
            "pubNumHit": "3",
            "pubNumBlow": "2",
            "pubSolnHash":hash,
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT

        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));

    });

    it("Circuit should throw error if wrong guess but hit and blow are correct  ", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,1,4])

        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "1",
            "pubGuessC": "4",
            "pubNumHit": "2",
            "pubNumBlow": "0",
            "pubSolnHash":hash,
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT

        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));

    });

    it("Circuit should throw error if solution numbers are out of range 10 ", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,1,2])

        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "1",
            "pubGuessC": "2",
            "pubNumHit": "3",
            "pubNumBlow": "0",
            "pubSolnHash":hash,
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "20",
            "privSalt": "99"
        }  //declaration INPUT

        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));

    });
    it("Circuit should throw error if guess numbers are out of range 10", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,11,2])
        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "11",
            "pubGuessC": "2",
            "pubNumHit": "3",
            "pubNumBlow": "0",
            "pubSolnHash": hash,
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT

        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));



    });

    it("Circuit should throw error if using duplicated numbers in guess", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,0,2])
        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "0",
            "pubGuessC": "2",
            "pubNumHit": "3",
            "pubNumBlow": "0",
            "pubSolnHash":hash,
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT
        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));



    });

    it("Circuit should throw error if using duplicated numbers in solution", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([99,0,1,2])
        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "1",
            "pubGuessC": "2",
            "pubNumHit": "3",
            "pubNumBlow": "0",
            "pubSolnHash":hash,
            "privSolnA": "0",
            "privSolnB": "0",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT
        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));


    });

    it("Circuit should throw error if using wrong salt at hash", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");// call wasm_tester function
        const hash =await poseidonHash([90,0,1,2])
        const INPUT = {
            "pubGuessA": "0",
            "pubGuessB": "1",
            "pubGuessC": "2",
            "pubNumHit": "3",
            "pubNumBlow": "0",
            "pubSolnHash":hash,
            "privSolnA": "0",
            "privSolnB": "1",
            "privSolnC": "2",
            "privSalt": "99"
        }  //declaration INPUT
        let witness
        let error

        try {
        witness = await circuit.calculateWitness(INPUT, true);
        } catch(e) {
            error=e.message
        }
        assert(error.includes("Error: Assert Failed. Error in template MastermindVariation_77 line:"));


    });

});