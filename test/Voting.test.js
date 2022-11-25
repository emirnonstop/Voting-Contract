//const VotingContract = artifacts.require("VotingContract")
const {expect} = require("chai")
const {ethers} = require("hardhat")


describe("VotingContract", function() {
    let owner
    let addr1
    let addr2
    let addr3 
    let addr4

    let voting
    let paymnets
    let candidates 
    let timeEnd

    beforeEach(async function(){ 
        [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners()

        const VotingContract = await ethers.getContractFactory("VotingContract", owner)
        voting = await VotingContract.deploy()
        await voting.deployed()

        voting = await VotingContract.deploy()
        await voting.deployed()

        candidates = [addr1.getAddress(), addr2.getAddress(), addr3.getAddress()]
    })

    async function sendMoney(sender){ 
        const amount = 100 
        const txData =  { 
            to: voting.address,
            value: amount
        }
        const tx = await sender.sendTransaction(txData)
        await tx.wait()
        return [tx, amount]
    }

    it("shouldnt have any ether by default", async function () {
        const balance = await voting.getBalance()
        expect(balance).to.eq(0)
    });

    it('should be created by owner', async function(){
        await expect(voting.connect(addr1).createVoting(1, 1, 0, candidates))
                .to.be.revertedWith("you are not an owner!");
        
    });

    it("should allow to owner to withdraw fees", async function () {
        await expect(voting.connect(addr2).withdrawFees(0))
             .to.be.revertedWith("you are not an owner!");
    });

    
    it("should allow to send money ", async function(){
        const [sendMoneyTx, amount] = await sendMoney(addr1)
        
        await expect(() => sendMoneyTx) 
            .to.changeEtherBalance(voting, amount);
        
        const timestamp = (
            await ethers.provider.getBlock(sendMoneyTx.blockNumner)
        ).timestamp

    })


    // it("should return all elections", async function(){ 
    //     const voting_1 = await VotingContract.deploy()
    //     await voting_1.deployed()

    // })


    it("should get Voting Info", async function(){ 
        const str = await voting.getVoteInfo()
        expect(str).to.eq("You should pay (X + F) ETH to take a part in the Voting!")
    })

})