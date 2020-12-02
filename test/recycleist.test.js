

let Recycleist = artifacts.require('Recycleist');
let catchRevert = require('./exception_helpers').catchRevert;

let BN = web3.utils.BN;


contract('Recycles.ist Test Cases', (accounts) => {
    let recycleist;
    const owner = accounts[0];
    const recycleCreator = accounts[1];
    const recycleContributor1 = accounts[2];
    const recycleContributor2 = accounts[3];
    const notRecycleCreator = accounts[4];

    beforeEach(async () => {
        recycleist = await Recycleist.new();
    });

    let description = 'New recycle challenge';
    let recycleType = 0;
    let state = 0;
    let goal = 100;
    let deadline = 1; // in minutes
    let totalReward = web3.utils.toWei('0.05'); // 0.05 ether
    let value = web3.utils.toWei('0.06'); // 0.06 ether
    let contributionAmount = 5; // 5kg
    let contributionDescription = 'New recycle contribution';

    it('- should have enough balance to create recycle', async () => {
        const amount = web3.utils.toWei('0.04');
        await catchRevert(recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: amount }));
    });

    it('- should be able to create recycle when the amount is sufficient', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        const result = await recycleist.getRecycle(0);

        assert.equal(result[0], 0, 'the id of the last created recycle does no match the expected value');
        assert.equal(result[1], description, 'the description of the last created recycle does no match the expected value');
        assert.equal(result[2], recycleType, 'the recycle type of the last created recycle does no match the expected value');
        assert.equal(result[3], 0, 'the state of the last created recycle does no match the expected value');
        assert.equal(result[4], goal, 'the goal of the last created recycle does no match the expected value');
        assert.equal(new BN(result[5]).toString(), new BN(result[8]).add(new BN(deadline * 60)).toString(), 'the deadline of the last created recycle does no match the expected value');
        assert.equal(result[6], totalReward, 'the reward of the last created recycle does no match the expected value');
        assert.equal(result[7], recycleCreator, 'the recycleCreator of the last created recycle does no match the expected value');

        const recycles = await recycleist.getRecycles();
        assert.equal(recycles.length, 1, 'recycle is not properly created');
    });

    it('- should emit a RecycleCreated event when a recycle is created', async () => {
        const tx = await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });

        let eventEmitted = false;
        if (tx.logs[0].event === 'RecycleCreated') {
            eventEmitted = true;
        }
        assert.equal(eventEmitted, true, 'a RecycleCreated event is not emitted');
    });

    it('- should not create a recycle when the app is paused', async () => {
        await recycleist.pauseApp({ from: owner });
        await catchRevert(recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value }));
    });

    it('- should be able to get a recycle by recycle id', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        const result = await recycleist.getRecycle(0);

        assert.equal(result[0], 0, 'the id of the last created recycle does no match the expected value');
        assert.equal(result[1], description, 'the description of the last created recycle does no match the expected value');
        assert.equal(result[2], recycleType, 'the recycle type of the last created recycle does no match the expected value');
        assert.equal(result[3], 0, 'the state of the last created recycle does no match the expected value');
        assert.equal(result[4], goal, 'the goal of the last created recycle does no match the expected value');
        assert.equal(new BN(result[5]).toString(), new BN(result[8]).add(new BN(deadline * 60)).toString(), 'the deadline of the last created recycle does no match the expected value');
        assert.equal(result[6], totalReward, 'the reward of the last created recycle does no match the expected value');
        assert.equal(result[7], recycleCreator, 'the recycleCreator of the last created recycle does no match the expected value');
    });

    it('- should be able to get all stored recycles', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        const recycles = await recycleist.getRecycles();
        assert.equal(recycles.length, 1, 'can not retrieve stored recycles');
    });

    it('- should not join a non exist recycle', async () => {
        const invalidRecycleId = 99999999999;
        await catchRevert(recycleist.joinRecycle(invalidRecycleId, { from: recycleContributor1 }));
    });

    it('- should join a recycle', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });

        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        const status = await recycleist.isUserJoinedRecycle(0, { from: recycleContributor1 });
        assert.equal(status, true, 'should join a recycle when a user is not joined it already');
    });

    it('- should not join a recycle if already joined', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });

        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await catchRevert(recycleist.joinRecycle(0, { from: recycleContributor1 }));
    });

    it('- should emit a UserJoinedRecycle event when joined a recycle', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });

        const tx = await recycleist.joinRecycle(0, { from: recycleContributor2 });
        let eventEmitted = false;

        if (tx.logs[0].event === 'UserJoinedRecycle') {
            eventEmitted = true;
        }
        assert.equal(eventEmitted, true, 'not emitted a UserJoinedRecycle event');
    });

    it('- should not join a recycle when the app is paused', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.pauseApp({ from: owner });

        await catchRevert(recycleist.joinRecycle(0, { from: recycleContributor1 }));
    });

    it('- should not contribute a non exists recycle', async () => {
        const invalidRecycleId = 9999999;
        await catchRevert(recycleist.contributeRecycle(invalidRecycleId, contributionDescription, contributionAmount, { from: recycleContributor1 }));
    });

    it('- should not contribute if not joined a recycle', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await catchRevert(recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 }));
    });

    it('- should contribute if joined a recycle', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });

        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 });
        const result = await recycleist.getContribution(0);

        assert.equal(result[0], 0, 'the id of the last created contribution does no match the expected value');
        assert.equal(result[1], 0, 'the recycle id of the last created contribution does no match the expected value');
        assert.equal(result[2], contributionDescription, 'the description type of the last created contribution does no match the expected value');
        assert.equal(result[3], contributionAmount, 'the amount of the last created contribution does no match the expected value');
        assert.equal(result[4], recycleContributor1, 'the creator of the last created contribution does no match the expected value');
    });

    it('- should emit a ContributionCreated event when contribution is made', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });

        const tx = await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 });

        let eventEmitted = false;
        if (tx.logs[0].event === 'ContributionCreated') {
            eventEmitted = true;
        }
        assert.equal(eventEmitted, true, 'not emitted a ContributionCreated event');
    });

    it('- should not contribute if already contributed the same recycle', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 });

        await catchRevert(recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 }));
    });

    it('- should be able to get contribution by contribution id', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 });

        const result = await recycleist.getContribution(0);
        assert.equal(result[0], 0, 'the id of the last created contribution does no match the expected value');
    });

    it('- should be able to get all stored contributions ', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 });

        const contributions = await recycleist.getContributions();
        assert.equal(contributions.length, 1, 'contribution is not properly created');
    });

    it('- should not contribute when the app is paused', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.pauseApp({ from: owner });

        await catchRevert(recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 }));
    });

    it('- should not approve if not recycle owner', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 })

        await catchRevert(recycleist.approveContribution(0, 0, { from: notRecycleCreator }));
    });

    it('- should approve a contribution when the approver is recycle owner and contribution is not approved before', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 })

        await recycleist.approveContribution(0, 0, { from: recycleCreator })
        const result = await recycleist.isContributionApproved(0);
        assert.equal(result, true, 'contribution should be approved');
    });

    it('- should not approve if a contribution is approved before', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 })

        await recycleist.approveContribution(0, 0, { from: recycleCreator })
        await catchRevert(recycleist.approveContribution(0, 0, { from: recycleCreator }));
    });

    it('- should not approve when the app is paused', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 })
        await recycleist.pauseApp({ from: owner });

        await catchRevert(recycleist.approveContribution(0, 0, { from: recycleCreator }));
    });


    it('- should not allow to claim reward tokens if user is not contributed', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });

        setTimeout(async () => {
            await catchRevert(recycleist.claimReward(0, 0, { from: recycleContributor1 }));
        }, 1000 * 60);
    });

    it('- should not allow to claim reward tokens if contribution is not approved', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 })

        setTimeout(async () => {
            await catchRevert(recycleist.claimReward(0, 0, { from: recycleContributor1 }));
        }, 1000 * 60)
    });

    it('- should claim reward tokens if joined a recycle and made an approved contribution', async () => {
        await recycleist.createRecycle(description, recycleType, state, goal, deadline, totalReward, { from: recycleCreator, value: value });
        await recycleist.joinRecycle(0, { from: recycleContributor1 });
        await recycleist.contributeRecycle(0, contributionDescription, contributionAmount, { from: recycleContributor1 })
        await recycleist.approveContribution(0, 0, { from: recycleCreator })

        setTimeout(async () => {
            await recycleist.closeRecycle(0, { from: recycleCreator })
            const tx = await recycleist.claimReward(0, 0, { from: recycleContributor1 });
            let eventEmitted = false;
            if (tx.logs[0].event === 'RewardClaimed') {
                eventEmitted = true;
            }
            assert.equal(eventEmitted, true, 'should claim reward tokens after recycle deadline passed, contribution approved');
        }, 1000 * 60);
    });

});