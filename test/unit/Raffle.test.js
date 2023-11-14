const { ethers, network, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-ethers");
const { assert, expect } = require("chai");


const networkName = network.name;
const chainId = network.config.chainId;
!(developmentChains.includes(networkName)) ? describe.skip :
describe("Raffle", async function() {
    let raffle, vrfCoordinatorV2Mock, deployer;
    beforeEach(async function() {
        // // console.log("HI");
        deployer = (await getNamedAccounts).deployer;
        await deployments.fixture(["all"]);
        raffle = await ethers.getContract("Raffle", deployer);
        await raffle.deploy();
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        await vrfCoordinatorV2Mock.deploy();
        
    })

    describe("constructor", async function(){
        it("initializes raffle correctly", async function(){
            const raffleState = await raffle.getRaffleState();
            assert.equal(raffleState.toString(), "0");
            const interval = await raffle.getInterval();
            assert.equal(interval.toString(), networkConfig[chainId]["interval"])
        })
    })

    describe("enterRaffle", async function(){
        it("revert if not pay enough", async function(){
            await expect(raffle.enterRaffle()).to.be.revertedWith(
                "Raffle__NotEnoughETHEntered"
            )
        })
        it("records player when they enter", async function(){
            await raffle.enterRaffle({value: raffleEntranceFee});
            const playerFromContract = await raffle.getPlayers(0);
            assert.equal(playerFromContract, deployer);
        })
    })


})