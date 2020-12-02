# recycleist

Recycleist is a blockchain based recycle waste management system with the main goal which is incentivizing people about recycling. Anyone can create a _recycle events_ by providing reward. The reward money is ether and it is given the users who contributed the _recycle events_.
For Live [Demo](https://recycleist.herokuapp.com/)

# Features

The main stakeholders are _recycle owner_ and _recycle contributor_ in this system.

- A user can create a recycle and becomes a recycle owner.
  -- By providing: description, recycle type(plastic,paper or glass), goal, deadline and reward
- A recycle owner can close the recycle after the recycle's deadline. After that, the recycle contributors can claim their rewards.
- A user can join a recycle in order to obtain reward
- A user can contribute a recycle and becomes a recycle contributor.
  -- Before that the user must join the recycle. Otherwise the user's contribution will not be allowed.
- A recycle owner can approve the contributions made by the contributors.
- A recycle contributor can claim their rewards after a recycle is ended.

### Rinkeby Testnet Contract Address

```sh
0xf02dB988e473258E07479a0BF0205D88B3Ffd1F1
```

### Tech

For smartcontract back-end development:

- Truffle
- Ganache
- Solidity(version 0.6.5)
- Metamask
- Infura

For front-end development:

- ReactJS
- rimble-ui
- Javascript
- Jquery
- CSS
- web3.js

### Installation

After the download the repository into your local machine, you can follow steps in below to run application in local.

To deploy smartcontract into the local blockchain

```sh
$ cd recycleist/
$ truffle migrate
```

Then, note the smartcontract deployed address and open the contract.js file in your code editor

```sh
$ ~/recycleist/client/src/contract.js
```

In contract.js file, change the contract address value according to your address

```sh
$ const contractAddress = "0xf02dB988e473258E07479a0BF0205D88B3Ffd1F1";
```

To start web application, in the _recycleist_ folder

```sh
$ cd client/
$ npm start
```

### Test Cases

There are total 26 test cases.

Contract: Recycles.ist Test Cases
✓ - should have enough balance to create recycle
✓ - should be able to create recycle when the amount is sufficient
✓ - should emit a RecycleCreated event when a recycle is created
✓ - should not create a recycle when the app is paused
✓ - should be able to get a recycle by recycle id
✓ - should be able to get all stored recycles
✓ - should not join a non exist recycle
✓ - should join a recycle
✓ - should not join a recycle if already joined
✓ - should emit a UserJoinedRecycle event when joined a recycle
✓ - should not join a recycle when the app is paused
✓ - should not contribute a non exists recycle
✓ - should not contribute if not joined a recycle
✓ - should contribute if joined a recycle
✓ - should emit a ContributionCreated event when contribution is made
✓ - should not contribute if already contributed the same recycle
✓ - should be able to get contribution by contribution id
✓ - should be able to get all stored contributions
✓ - should not contribute when the app is paused
✓ - should not approve if not recycle owner
✓ - should approve a contribution when the approver is recycle owner and contribution is not approved before
✓ - should not approve if a contribution is approved before
✓ - should not approve when the app is paused
✓ - should not allow to claim reward tokens if user is not contributed
✓ - should not allow to claim reward tokens if contribution is not approved
✓ - should claim reward tokens if joined a recycle and made an approved contribution
