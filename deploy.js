const {ethers}=require("hardhat");
async function main(){
const Decentragram =await ethers.getContractFactory("Decentragram");
const decentragram =await Decentragram.deploy();
await decentragram.deployed();
console.log("DEcentragram deployed to:",decentragram.address);
}
main()
.then(()=>process.exit(0))
.catch(error=> {
  console.error(error);
  process.exit(1);
});

