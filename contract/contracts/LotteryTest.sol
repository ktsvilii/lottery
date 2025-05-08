// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LotteryTest is VRFConsumerBaseV2Plus, ReentrancyGuard {
    address private immutable contractOwner;
    uint256 private immutable subscriptionId;
    address private immutable vrfCoordinator;

    bytes32 internal constant KEY_HASH =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    LotteryTicket public testTicket;

    uint256 public constant TICKET_PRICE_WEI = 1e15; // 100000000000000 ~ 0.001 ETH ~ 10$
    uint8 public constant NUMBER_RANGE = 37;

    uint16 public constant REQUEST_CONFIRMATIONS = 3;
    uint32 public constant CALLBACK_GAS_LIMIT = 2500000;
    uint8 public constant NUMBER_OF_WORDS = 1;

    uint256 public jackpot;
    uint256 private operationsBalance;
    uint256 private ownerBalance;
    uint256 public nextTicketId = 1;
    uint256[] public allTicketIds;

    uint256[5] private DEFAULT_COMBINATION;

    struct LotteryTicket {
        uint256 id;
        address owner;
        uint256 purchaseTimestamp;
        uint256[5] playerCombination;
        uint256[5] winningCombination;
        uint8 matchingNumbers;
        uint256 potentialReward;
        uint256 actualReward;
        bool isRewardClaimed;
        bool playerCombinationSubmitted;
        bool winningCombinationGenerated;
        bool randomNumberRequested;
    }

    mapping(address => uint256[]) public playerTicketIds;
    mapping(uint256 => LotteryTicket) public tickets;
    mapping(uint256 => uint256) public requestIdToTicketId;

    event TicketPurchased(address indexed player, uint256 indexed ticketNumber);
    event RandomWordsRequested(
        uint256 indexed requestId,
        uint256 indexed ticketId
    );
    event PlayerCombinationSubmitted(
        address indexed player,
        uint256[5] combination
    );
    event RandomNumberGenerated(
        uint256 indexed requestId,
        uint256 indexed ticketNumber,
        uint256 number
    );
    event WinningCombinationGenerated(
        uint256 indexed ticketNumber,
        uint256[5] combination
    );
    event LotteryResults(
        address indexed owner,
        uint256 indexed ticketNumber,
        uint256[5] playerCombination,
        uint256[5] winningCombination,
        uint8 matchingNumbers,
        uint256 indexed rewardAmount
    );
    event RewardClaimed(
        address indexed player,
        uint256 indexed ticketId,
        uint256 indexed amount
    );
    event FundJackpot(address indexed sender, uint256 indexed amount);

    event Distribute(address indexed owner, uint256 indexed amount);
    event OwnerBalanceWithdraw(address indexed owner, uint256 indexed amount);
    event OperationsBalanceWithdraw(
        address indexed owner,
        uint256 indexed amount
    );
    event JackpotWithdraw(address indexed owner, uint256 indexed amount);

    modifier _onlyOwner() {
        require(msg.sender == contractOwner, "Only for owner");
        _;
    }

    constructor(
        address _vrfCoordinator,
        uint256 _subscriptionId
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        contractOwner = msg.sender;
        subscriptionId = _subscriptionId;
        vrfCoordinator = _vrfCoordinator;
    }

    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function getJackpot() public view returns (uint256) {
        return jackpot;
    }

    function getOperationsBalance() external view returns (uint256) {
        return operationsBalance;
    }

    function getOwnerBalance() external view returns (uint256) {
        return ownerBalance;
    }

    function getTestTicket() external view returns (LotteryTicket memory) {
        return testTicket;
    }

    function getPlayerTickets() external view returns (LotteryTicket[] memory) {
        uint256[] memory ids = playerTicketIds[msg.sender];
        LotteryTicket[] memory result = new LotteryTicket[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = tickets[ids[i]];
        }
        return result;
    }

    function assignTestTicket() public {
        testTicket.owner = msg.sender;
        uint256 ticketId = nextTicketId++;

        LotteryTicket memory newTicket = LotteryTicket({
            id: ticketId,
            owner: msg.sender,
            purchaseTimestamp: block.timestamp,
            playerCombination: DEFAULT_COMBINATION,
            winningCombination: DEFAULT_COMBINATION,
            matchingNumbers: 0,
            potentialReward: 0,
            actualReward: 0,
            isRewardClaimed: false,
            playerCombinationSubmitted: false,
            winningCombinationGenerated: false,
            randomNumberRequested: false
        });

        tickets[newTicket.id] = newTicket;
        playerTicketIds[msg.sender].push(ticketId);
        allTicketIds.push(ticketId);
    }

    function buyTicket() public payable returns (LotteryTicket memory) {
        require(tx.origin == msg.sender, "Only real players!");
        require(msg.value == TICKET_PRICE_WEI, "Transaction value is too low!");

        LotteryTicket memory newTicket = LotteryTicket({
            id: nextTicketId,
            owner: msg.sender,
            purchaseTimestamp: block.timestamp,
            playerCombination: DEFAULT_COMBINATION,
            winningCombination: DEFAULT_COMBINATION,
            matchingNumbers: 0,
            potentialReward: 0,
            actualReward: 0,
            isRewardClaimed: false,
            playerCombinationSubmitted: false,
            winningCombinationGenerated: false,
            randomNumberRequested: false
        });

        tickets[newTicket.id] = newTicket;
        playerTicketIds[msg.sender].push(nextTicketId);
        allTicketIds.push(nextTicketId);

        nextTicketId++;

        distribute(msg.value);

        emit TicketPurchased(msg.sender, newTicket.id);
        return newTicket;
    }

    function submitCombination(
        uint256 ticketId,
        uint256[5] memory playerCombination
    ) public {
        LotteryTicket storage searchedTicket = tickets[ticketId];

        require(searchedTicket.owner == msg.sender, "You are not the owner");
        require(
            !searchedTicket.playerCombinationSubmitted,
            "Already submitted"
        );

        for (uint256 i = 0; i < playerCombination.length; i++) {
            require(
                playerCombination[i] >= 0 && playerCombination[i] <= 36,
                "Number out of range (0-36)"
            );
            for (uint256 j = i + 1; j < playerCombination.length; j++) {
                require(
                    playerCombination[i] != playerCombination[j],
                    "Duplicate numbers not allowed"
                );
            }
        }

        searchedTicket.playerCombination = playerCombination;
        searchedTicket.playerCombinationSubmitted = true;

        emit PlayerCombinationSubmitted(msg.sender, playerCombination);

        require(!searchedTicket.randomNumberRequested, "Already requested");
        searchedTicket.randomNumberRequested = true;

        _requestRandomNumber(ticketId);
    }

    function claimReward(uint256 ticketId) external nonReentrant {
        LotteryTicket storage ticket = tickets[ticketId];

        require(ticket.owner == msg.sender, "Only ticket owner can claim");
        require(ticket.owner != address(0), "Ticket does not exist");
        require(ticket.playerCombinationSubmitted, "Combination not submitted");
        require(ticket.winningCombinationGenerated, "Winning not generated");
        require(!ticket.isRewardClaimed, "Reward already claimed");

        uint8 matchingNumbers = _checkWinningCombination(
            ticket.playerCombination,
            ticket.winningCombination
        );

        // require(
        //     matchingNumbers == ticket.matchingNumbers,
        //     "Tampering detected"
        // );

        uint256 actualRewardAmount = _calculateReward(matchingNumbers);
        require(actualRewardAmount > 0, "No reward to claim");

        uint256 payout = actualRewardAmount <= jackpot
            ? actualRewardAmount
            : jackpot;
        jackpot = jackpot >= payout ? jackpot - payout : 0;

        ticket.actualReward = payout;
        ticket.isRewardClaimed = true;

        _sendReward(ticket.owner, payout);

        emit RewardClaimed(ticket.owner, ticketId, payout);
    }

    function test_requestRandomNumber(
        uint256 ticketId
    ) external returns (uint256) {
        return _requestRandomNumber(ticketId);
    }

    function _requestRandomNumber(uint256 ticketId) private returns (uint256) {
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: KEY_HASH,
                subId: subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUMBER_OF_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        requestIdToTicketId[requestId] = ticketId;
        emit RandomWordsRequested(requestId, ticketId);
        return requestId;
    }

    function test_fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) external {
        fulfillRandomWords(requestId, randomWords);
    }

    function test_setWinningCombination(
        uint256 ticketId,
        uint256[5] memory combination
    ) external {
        tickets[ticketId].winningCombination = combination;
        tickets[ticketId].winningCombinationGenerated = true;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        uint256 ticketId = requestIdToTicketId[requestId];
        LotteryTicket storage ticket = tickets[ticketId];

        require(!ticket.winningCombinationGenerated, "Already generated");

        uint256 randomWord = randomWords[0];

        ticket.winningCombinationGenerated = true;

        ticket.winningCombination = _generateWinningCombination(randomWord);
        ticket.matchingNumbers = _checkWinningCombination(
            ticket.playerCombination,
            ticket.winningCombination
        );
        ticket.potentialReward = _calculateReward(ticket.matchingNumbers);

        emit RandomNumberGenerated(requestId, ticketId, randomWord);
    }

    function getWinningCombination() external view returns (uint256[5] memory) {
        return testTicket.winningCombination;
    }

    function test_generateWinningCombination(
        uint256 randomWord
    ) external pure returns (uint256[5] memory) {
        return _generateWinningCombination(randomWord);
    }

    function _generateWinningCombination(
        uint256 randomWord
    ) internal pure returns (uint256[5] memory) {
        uint8[37] memory used;
        uint256[5] memory combination;
        uint256 count = 0;
        bytes32 randomBytes = keccak256(abi.encode(randomWord));
        uint8 randomIndex = 0;

        while (count < 5) {
            if (randomIndex >= 32) {
                randomBytes = keccak256(abi.encode(randomBytes, randomIndex));
                randomIndex = 0;
            }
            uint8 number = uint8(randomBytes[randomIndex]) % 37;
            randomIndex++;

            if (used[number] == 0) {
                used[number] = 1;
                combination[count] = number;
                count++;
            }
        }

        return combination;
    }

    function test_checkWinningCombination(
        uint256[5] memory playerCombination,
        uint256[5] memory winningCombination
    ) external pure returns (uint8) {
        return _checkWinningCombination(playerCombination, winningCombination);
    }

    function _checkWinningCombination(
        uint256[5] memory playerCombination,
        uint256[5] memory winningCombination
    ) internal pure returns (uint8) {
        uint8 matches = 0;
        bool[5] memory matched;

        for (uint8 i = 0; i < playerCombination.length; i++) {
            for (uint8 j = 0; j < winningCombination.length; j++) {
                if (
                    !matched[j] && playerCombination[i] == winningCombination[j]
                ) {
                    matches += 1;
                    matched[j] = true;
                    break;
                }
            }
        }

        return matches;
    }

    function test_calculateReward(
        uint8 matchingNumbers
    ) external view returns (uint256) {
        return _calculateReward(matchingNumbers);
    }

    function _calculateReward(
        uint8 matchingNumbers
    ) internal view returns (uint256) {
        require(matchingNumbers <= 5, "Unexpected matching number count");

        uint256[6] memory rewards = [
            0,
            0.0007 ether,
            0.0012 ether,
            0.01 ether,
            0.1 ether,
            jackpot
        ];

        return rewards[matchingNumbers];
    }

    function test_sendReward(address recipient, uint256 amount) external {
        _sendReward(recipient, amount);
    }

    function _sendReward(address recipient, uint256 amount) internal {
        require(amount > 0, "No reward to send");
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Reward transfer failed");
    }

    function getAllTickets()
        external
        view
        _onlyOwner
        returns (LotteryTicket[] memory)
    {
        uint256 len = allTicketIds.length;
        LotteryTicket[] memory result = new LotteryTicket[](len);
        for (uint256 i = 0; i < len; i++) {
            result[i] = tickets[allTicketIds[i]];
        }
        return result;
    }

    function getTicketById(
        uint256 ticketId
    ) external view returns (LotteryTicket memory) {
        LotteryTicket memory ticket = tickets[ticketId];
        require(ticket.owner == msg.sender, "You are not the ticket owner");
        return ticket;
    }

    function fundJackpot(uint256 amount) external {
        jackpot += amount;
        emit FundJackpot(msg.sender, amount);
    }

    function testDistribute(uint256 amount) external {
        distribute(amount);
    }

    function distribute(uint256 amount) private {
        jackpot += (amount * 90) / 100;
        operationsBalance += (amount * 5) / 100;
        ownerBalance += (amount * 5) / 100;
        emit Distribute(msg.sender, amount);
    }

    function withdrawOwnerBalance() public _onlyOwner {
        require(ownerBalance > 0, "Nothing to withdraw");
        uint256 amount = ownerBalance;
        ownerBalance = 0;
        (bool success, ) = payable(contractOwner).call{value: amount}("");
        require(success, "OwnerBalance withdrawal failed");
        emit OwnerBalanceWithdraw(contractOwner, amount);
    }

    function withdrawOperationsBalance() public _onlyOwner {
        require(operationsBalance > 0, "Nothing to withdraw");
        uint256 amount = operationsBalance;
        operationsBalance = 0;
        (bool success, ) = payable(contractOwner).call{value: amount}("");
        require(success, "OperationsBalance withdrawal failed");
        emit OperationsBalanceWithdraw(contractOwner, amount);
    }

    function withdrawJackpot() external _onlyOwner {
        require(jackpot > 0, "Nothing to withdraw");
        uint256 amount = jackpot;
        jackpot = 0;
        (bool success, ) = payable(contractOwner).call{value: amount}("");
        require(success, "Jackpot withdrawal failed");
        emit JackpotWithdraw(contractOwner, amount);
    }

    receive() external payable {
        distribute(msg.value);
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
