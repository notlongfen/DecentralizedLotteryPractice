const { ethers, network } = require("hardhat");
// const { networks } = require("../hardhat.config");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
// const VRF_SUBSCRIPTION_FUND_AMMOUNT = ethers.parseEther("30"); 
// const {verify} = require("../helper-hardhat-config")
const deployMock = require("./00-deploy-mock");

async function deploy() {
    const chainId = network.config.chainId;
    let vrfCoordinatorV2, vrfCoordinatorAddress, subscriptionId;
// console.log(network.name);
    if(developmentChains.includes(network.name)){
        vrfCoordinatorAddress = (await deployMock()).toString();
        vrfCoordinatorV2 = await ethers.getContractAt("VRFCoordinatorV2Mock", vrfCoordinatorAddress);
        await vrfCoordinatorV2.createSubscription();
        subscriptionId =  1n;
        await vrfCoordinatorV2.fundSubscription(subscriptionId, 100000000n);

    }else{
        vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subScriptionId"];
    }

    const entranceFee = networkConfig[chainId]["entranceFee"];
    const gasLane = networkConfig[chainId]["gasLane"];
    const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"];
    const interval = networkConfig[chainId]["interval"];

    const contractFactory = await ethers.getContractFactory("Raffle");
    const raffle = await contractFactory.deploy(
        vrfCoordinatorAddress,
        entranceFee,
        gasLane,
        subscriptionId,
        callBackGasLimit,
        interval
    );
    await raffle.waitForDeployment();

    // if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
    //     log("Verifying")
    //     await verify(raffle.address, args );
    // }   
    // log("-----------------------------------")
    console.log(`Deployed VRFCoordinatorV2Mock to address ${vrfCoordinatorAddress}`);
    console.log(`Deployed Raffle to address ${await raffle.getAddress()}`);

}


module.exports.tags = ["all", "raffle"] 