const { network, ethers } = require("hardhat");
const {developmentChains} = require("../helper-hardhat-config")
const BASE_FEE = ethers.parseEther("0.25"); //0.25 is the premium. Cost 0.25 Link per request
const GAS_PRICE_LINK = 1;
module.exports = async function deployMock(){
    if(developmentChains.includes(network.name)){
        const contractFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
        const contract = await contractFactory.deploy(BASE_FEE, GAS_PRICE_LINK);
        await contract.waitForDeployment();
        const address = await contract.getAddress();
        
        return address;
    }
 }
module.exports.tags = ["all", "mocks"]