pragma solidity 0.6.5;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/** 
    @title Recycleist smart contract
    @author ssozuer
*/
contract Recycleist is Pausable {
	using SafeMath for uint256;

	// #### STATE VARIABLE DECLARATIONS #### //
	address public owner;
	uint256 public recycleIdCounter;
	uint256 public contributionIdCounter;
	mapping(address => uint256) public balancesOf; // holds eth balances of recycle creators
	mapping(uint256 => address) public recycleCreators; // holds who did create the recycle
	mapping(address => mapping(uint256 => bool)) public joinedUsers; // holds the information about if a user joined or did not joined the recycle
	mapping(address => mapping(uint256 => bool)) public contributedUsers; // holds the contribution information of a user
	mapping(address => mapping(uint256 => bool)) public approvedContributions; // holds the contribution approval information

	mapping(uint256 => Recycle) public recycles;
	mapping(uint256 => Contribution) public contributions;

	// #### STRUCT DECLARATIONS #### //
	struct Recycle {
		uint256 id;
		string description;
		RecycleType recycleType;
		State state;
		uint256 goal;
		uint256 deadline;
		uint256 totalReward;
		address createdBy;
		uint256 createdTime;
	}

	struct Contribution {
		uint256 id;
		uint256 recycleId;
		string description;
		uint256 amount;
		address createdBy;
		uint256 createdTime;
	}

	// ##### ENUM DEFINITIONS ##### //
	enum State { STARTED, ENDED }
	enum RecycleType { PLASTIC, PAPER, GLASS }

	// ##### MODIFIER DECLARATIONS ##### //
	modifier onlyOwner() {
		require(msg.sender == owner, "Only owner of the this contract can run this operation!");
		_;
	}

	modifier foundRecycle(uint256 _recycleId) {
		require(recycleCreators[_recycleId] != address(0), "Could not found recycle");
		_;
	}

	modifier mustRecycleOwner(uint256 _recycleId) {
		require(recycleCreators[_recycleId] == msg.sender, "User is not creator of the recycle");
		_;
	}

	modifier hasEnoughAmount(uint256 _recycleReward) {
		require(
			balancesOf[msg.sender].add(msg.value) > _recycleReward,
			"No sufficient amount to create recycle"
		);
		_;
	}

	modifier recycleDeadlineMustPassed(uint256 _recycleId) {
		require(block.timestamp > recycles[_recycleId].deadline, "Recycle deadline must be passed");
		_;
	}

	modifier recycleDeadlineMustNotPassed(uint256 _recycleId) {
		require(
			block.timestamp <= recycles[_recycleId].deadline,
			"Recycle deadline must not be passed"
		);
		_;
	}

	modifier recycleMustStarted(uint256 _recycleId) {
		require(recycles[_recycleId].state == State.STARTED, "Recycle must be started");
		_;
	}

	modifier recycleMustEnded(uint256 _recycleId) {
		require(recycles[_recycleId].state == State.ENDED, "Recycle must be ended");
		_;
	}

	modifier userIsNotJoin(uint256 _recycleId) {
		require(joinedUsers[msg.sender][_recycleId] != true, "User has already joined the recycle");
		_;
	}

	modifier userIsJoined(uint256 _recycleId) {
		require(
			joinedUsers[msg.sender][_recycleId] != false,
			"User has not already joined the recycle"
		);
		_;
	}

	modifier userIsNotContribute(uint256 _recycleId) {
		require(
			contributedUsers[msg.sender][_recycleId] != true,
			"User has already contributed the recycle"
		);
		_;
	}

	modifier userIsContributed(uint256 _recycleId) {
		require(
			contributedUsers[msg.sender][_recycleId] != false,
			"User has not already contributed the recycle"
		);
		_;
	}

	modifier contributionNotApproved(address _contributor, uint256 _contributionId) {
		require(
			approvedContributions[_contributor][_contributionId] != true,
			"Contribution has been approved"
		);
		_;
	}

	modifier contributionMustBeApproved(address _contributor, uint256 _contributionId) {
		require(
			approvedContributions[_contributor][_contributionId] == true,
			"Contribution has not been approved"
		);
		_;
	}

	// ###### EVENT DECLARATIONS ##### //
	event RecycleTokenClaimed(address indexed tokenOwner, uint256 tokenAmount);
	event RecycleCreated(address indexed recycleCretor, uint256 indexed recycleId);
	event RecycleClosed(uint256 indexed recycleId);
	event ContributionCreated(
		address indexed contributionCreator,
		uint256 indexed recycleId,
		uint256 indexed contributionId
	);
	event ContributionApproved(uint256 indexed recycleId, uint256 indexed contributionId);
	event UserJoinedRecycle(address indexed user, uint256 indexed recycleId);
	event RewardClaimed(
		address indexed user,
		uint256 indexed recycleId,
		uint256 indexed contributionId,
		uint256 amount
	);

	/**
		Recycle.ist constructor
	 */
	constructor() public {
		owner = msg.sender;
		recycleIdCounter = 0;
		contributionIdCounter = 0;
	}

	/**
		Fallback function to hold eth balance
    */
	receive() external payable {}

	/**
		The method returns balance of the Recycle.ist contract
	*/
	function getRecycleistEthBalance() public view returns (uint256) {
		return address(this).balance;
	}

	/**
		The method allows users to create 'Recycle'
		@param  _description Recycle description
		@param  _recycleType Recycle type(PLASTIC=0, PAPER=1, GLASS=2)
		@param  _state       Recycle state(STARTED=0, ENDED=0)
		@param  _goal		 Recycle goal in kilogram(i.e. 100kg)
		@param  _deadline    Recycle deadline(for testing purposes the metric is minutes)
		@param  _totalReward Recycle total reward. The reward will be shared among the contributors(recylesists)
		@return returns bool
	*/
	function createRecycle(
		string memory _description,
		RecycleType _recycleType,
		State _state,
		uint256 _goal,
		uint256 _deadline,
		uint256 _totalReward
	) public payable whenNotPaused hasEnoughAmount(_totalReward) returns (bool) {
		require(bytes(_description).length > 0, "Description must be given for the recycle");
		require(
			_recycleType == RecycleType.PLASTIC ||
				_recycleType == RecycleType.PAPER ||
				_recycleType == RecycleType.GLASS,
			"Recycle type must be given for the recycle"
		);
		require(_goal > 0, "Goal must be given for the recycle");
		require(_deadline > 0, "Deadline must be given for the recycle");
		require(_totalReward > 0, "Total reward must be given for the recycle");

		uint256 time = block.timestamp;
		recycles[recycleIdCounter] = Recycle({
			id: recycleIdCounter,
			description: _description,
			recycleType: _recycleType,
			state: _state,
			goal: _goal,
			deadline: time + _deadline * 60,
			totalReward: _totalReward,
			createdBy: msg.sender,
			createdTime: time
		});
		balancesOf[msg.sender] = balancesOf[msg.sender].add(msg.value);
		recycleCreators[recycleIdCounter] = msg.sender;
		recycleIdCounter++;

		// send eth value to the contract
		address(this).transfer(msg.value);
		emit RecycleCreated(msg.sender, recycleIdCounter);
		return true;
	}

	/**
		The method allows recycle creator to close the recycle after recycle deadline
		@param _recycleId Recycle Id
	*/
	function closeRecycle(uint256 _recycleId)
		public
		whenNotPaused
		foundRecycle(_recycleId)
		mustRecycleOwner(_recycleId)
		recycleDeadlineMustPassed(_recycleId)
	{
		Recycle storage recycle = recycles[_recycleId];
		recycle.state = State.ENDED;
		emit RecycleClosed(_recycleId);
	}

	/**
		The method allows fetch a recycle by recyle id
		@param _recycleId Recycle id		
	*/
	function getRecycle(uint256 _recycleId)
		public
		view
		returns (
			uint256 id,
			string memory description,
			uint256 recycleType,
			uint256 state,
			uint256 goal,
			uint256 deadline,
			uint256 totalReward,
			address createdBy,
			uint256 createdTime
		)
	{
		id = recycles[_recycleId].id;
		description = recycles[_recycleId].description;
		recycleType = uint256(recycles[_recycleId].recycleType);
		state = uint256(recycles[_recycleId].state);
		goal = recycles[_recycleId].goal;
		deadline = recycles[_recycleId].deadline;
		totalReward = recycles[_recycleId].totalReward;
		createdBy = recycles[_recycleId].createdBy;
		createdTime = recycles[_recycleId].createdTime;
		return (
			id,
			description,
			recycleType,
			state,
			goal,
			deadline,
			totalReward,
			createdBy,
			createdTime
		);
	}

	/**
		 The method returns the all stored recycles
		 @return recycleList
    */
	function getRecycles() public view returns (Recycle[] memory) {
		Recycle[] memory recycleList = new Recycle[](recycleIdCounter);
		for (uint256 i = 0; i < recycleIdCounter; i++) {
			Recycle storage recycle = recycles[i];
			recycleList[i] = recycle;
		}
		return recycleList;
	}

	/**
		The method allows users to join an active recycle
		@param _recycleId Recycle id
	*/
	function joinRecycle(uint256 _recycleId)
		public
		whenNotPaused
		foundRecycle(_recycleId)
		recycleMustStarted(_recycleId)
		recycleDeadlineMustNotPassed(_recycleId)
		userIsNotJoin(_recycleId)
	{
		joinedUsers[msg.sender][_recycleId] = true;
		emit UserJoinedRecycle(msg.sender, _recycleId);
	}

	/**
		The method returns whether an user joined or not joined a recycle
		@param _recycleId Recycle id
		@return bool 
	*/
	function isUserJoinedRecycle(uint256 _recycleId) public view returns (bool) {
		return joinedUsers[msg.sender][_recycleId];
	}

	/**
		The method allows users to contribute an active recycle
		@param _recycleId   Recycle id
		@param _description Recycle contribution description
		@param _amount      Recycle contribution that defines the amount of the contribution
		
		@return bool
	*/
	function contributeRecycle(
		uint256 _recycleId,
		string memory _description,
		uint256 _amount
	)
		public
		whenNotPaused
		foundRecycle(_recycleId)
		recycleMustStarted(_recycleId)
		recycleDeadlineMustNotPassed(_recycleId)
		userIsJoined(_recycleId)
		userIsNotContribute(_recycleId)
		returns (bool)
	{
		contributions[contributionIdCounter] = Contribution({
			id: contributionIdCounter,
			recycleId: _recycleId,
			description: _description,
			amount: _amount,
			createdBy: msg.sender,
			createdTime: block.timestamp
		});

		contributedUsers[msg.sender][_recycleId] = true;
		contributionIdCounter++;

		emit ContributionCreated(msg.sender, _recycleId, contributionIdCounter);
		return true;
	}

	/**
		The method returns a contribution by contribution id
		@param _contributionId Contribution id
    */
	function getContribution(uint256 _contributionId)
		public
		view
		returns (
			uint256 id,
			uint256 recycleId,
			string memory description,
			uint256 amount,
			address createdBy,
			uint256 createdTime
		)
	{
		id = contributions[_contributionId].id;
		recycleId = contributions[_contributionId].recycleId;
		description = contributions[_contributionId].description;
		amount = contributions[_contributionId].amount;
		createdBy = contributions[_contributionId].createdBy;
		createdTime = contributions[_contributionId].createdTime;
		return (id, recycleId, description, amount, createdBy, createdTime);
	}

	/**
		The method returns all stored contributions
		@return contributionList
	*/
	function getContributions() public view returns (Contribution[] memory) {
		Contribution[] memory contributionList = new Contribution[](contributionIdCounter);
		for (uint256 i = 0; i < contributionIdCounter; i++) {
			Contribution storage contribution = contributions[i];
			contributionList[i] = contribution;
		}
		return contributionList;
	}

	/**
		The method allows recycle creators to approve contributions made by recyleists
		@param _recycleId      Recycle id
		@param _contributionId Contribution id
	*/
	function approveContribution(uint256 _recycleId, uint256 _contributionId)
		public
		whenNotPaused
		mustRecycleOwner(_recycleId)
		contributionNotApproved(contributions[_contributionId].createdBy, _contributionId)
		returns (bool)
	{
		approvedContributions[contributions[_contributionId].createdBy][_contributionId] = true;
		emit ContributionApproved(_recycleId, _contributionId);
		return true;
	}

	/**
		The method returns whether a given contribution id is approved or not
		@param _contributionId Contribution id
		@return bool
	*/
	function isContributionApproved(uint256 _contributionId) public view returns (bool) {
		return approvedContributions[contributions[_contributionId].createdBy][_contributionId];
	}

	/**
		The method allows users whom contributed a recycle to claim their rewards after recycle deadline
		@dev this method has reentrancy attack security prevention.(hope so :) )
		@param _recycleId       Recycle id
		@param _contributionId  Contribution id
	*/
	bool locked;
	modifier noReentrancy() {
		require(!locked);
		locked = true;
		_;
		locked = false;
	}

	function claimReward(uint256 _recycleId, uint256 _contributionId)
		public
		payable
		whenNotPaused
		noReentrancy
		recycleMustEnded(_recycleId)
		userIsContributed(_recycleId)
		contributionMustBeApproved(contributions[_contributionId].createdBy, _contributionId)
		returns (bool)
	{
		uint256 goal = recycles[_recycleId].goal;
		uint256 totalReward = recycles[_recycleId].totalReward;
		uint256 contributionAmount = contributions[_contributionId].amount;
		uint256 earnedReward = (totalReward.mul(contributionAmount)).div(goal);

		// transfer the earned eth value to the contributor
		address payable contributor = msg.sender;
		contributor.transfer(earnedReward);

		// substract the earned amount from the recycle creator's balance
		address recycleCreator = recycles[_recycleId].createdBy;
		balancesOf[recycleCreator] = balancesOf[recycleCreator].sub(earnedReward);

		emit RewardClaimed(msg.sender, _recycleId, _contributionId, earnedReward);
		return true;
	}

	/**
		The method pauses the contract
	*/
	function pauseApp() public onlyOwner {
		super._pause();
	}

	/**
		The method unpauses a contract if the contract is paused
	*/
	function unpauseApp() public onlyOwner {
		super._unpause();
	}
}
