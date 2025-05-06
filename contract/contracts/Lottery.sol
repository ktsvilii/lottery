// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Lottery is VRFConsumerBaseV2Plus, ReentrancyGuard {
    address private immutable contractOwner;
    uint256 private immutable subscriptionId;

    bytes32 internal constant KEY_HASH =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    uint256 public constant TICKET_PRICE_WEI = 1e14; // 100000000000000 ~ 0.0001 ETH ~ 1$
    uint8 public constant NUMBER_RANGE = 37;

    uint16 public constant REQUEST_CONFIRMATIONS = 3;
    uint32 public constant CALLBACK_GAS_LIMIT = 2500000;
    uint8 public constant NUMBER_OF_WORDS = 1;

    uint256 public jackpot;
    uint256 private operationsBalance;
    uint256 private ownerBalance;
    uint256 public nextTicketId;
    uint256[] public allTicketIds;

    uint256[5] private DEFAULT_COMBINATION;

    // LotteryTicket struct
    struct LotteryTicket {
        uint256 id;
        address owner;
        uint256 purchaseTimestamp;
        uint256[5] playerCombination;
        uint256[5] winningCombination;
        uint8 matchingNumbers;
        uint256 reward;
        bool isRewardClaimed;
        bool playerCombinationSubmitted;
        bool winningCombinationGenerated;
    }

    // Mappings
    mapping(address => uint256[]) public playerTicketIds;

    mapping(uint256 => LotteryTicket) public tickets;

    mapping(uint256 => uint256) public requestIdToTicketId;

    // Events
    event TicketPurchased(address indexed player, uint256 indexed ticketNumber);

    event PlayerCombinationSubmitted(
        address indexed player,
        uint256[5] combination
    );

    event RandomNumberGenerated(
        uint256 indexed requestId,
        uint256 indexed ticketNumber,
        uint256 number
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

    // Modifiers
    modifier _onlyOwner() {
        require(msg.sender == contractOwner, "Only for owner");
        _;
    }

    constructor(
        uint256 _subscriptionId
    ) VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) {
        contractOwner = msg.sender;
        subscriptionId = _subscriptionId;
    }

    // Main logic
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
            reward: 0,
            isRewardClaimed: false,
            playerCombinationSubmitted: false,
            winningCombinationGenerated: false
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

        _requestRandomNumber(ticketId);
    }

    function previewResults(
        uint256 ticketId
    )
        external
        view
        returns (
            uint8 matchingNumbers,
            uint256 rewardAmount,
            uint256[5] memory playerCombination,
            uint256[5] memory winningCombination
        )
    {
        LotteryTicket storage ticket = tickets[ticketId];

        require(ticket.owner == msg.sender, "Only ticket owner can view");
        require(ticket.owner != address(0), "Ticket does not exist");
        require(ticket.playerCombinationSubmitted, "Combination not submitted");
        require(
            ticket.winningCombinationGenerated,
            "Winning combination is not generated"
        );

        matchingNumbers = _checkWinningCombination(
            ticket.playerCombination,
            ticket.winningCombination
        );
        rewardAmount = _calculateReward(matchingNumbers);
        playerCombination = ticket.playerCombination;
        winningCombination = ticket.winningCombination;
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

        uint256 rewardAmount = _calculateReward(matchingNumbers);
        require(rewardAmount > 0, "No reward to claim");

        uint256 payout = rewardAmount;
        if (jackpot >= rewardAmount) {
            jackpot -= rewardAmount;
        } else {
            payout = jackpot;
            jackpot = 0;
        }
        ticket.matchingNumbers = matchingNumbers;
        ticket.reward = payout;
        ticket.isRewardClaimed = true;

        _sendReward(ticket.owner, payout);

        emit RewardClaimed(ticket.owner, ticketId, payout);
    }

    // Internal utils
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
        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        uint256 ticketId = requestIdToTicketId[requestId];
        uint256 randomWord = randomWords[0];

        tickets[ticketId].winningCombination = _generateWinningCombination(
            randomWord
        );
        tickets[ticketId].winningCombinationGenerated = true;

        emit RandomNumberGenerated(requestId, ticketId, randomWord);
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

    function _calculateReward(
        uint8 matchingNumbers
    ) internal view returns (uint256) {
        require(matchingNumbers <= 5, "Unexpected matching number count");

        if (matchingNumbers == 0) {
            return 0;
        } else if (matchingNumbers == 1) {
            return (TICKET_PRICE_WEI * 80) / 100;
        } else if (matchingNumbers == 2) {
            return (jackpot * 5) / 100;
        } else if (matchingNumbers == 3) {
            return (jackpot * 15) / 100;
        } else if (matchingNumbers == 4) {
            return (jackpot * 35) / 100;
        } else {
            return (jackpot * 75) / 100;
        }
    }

    function _sendReward(address recipient, uint256 amount) internal {
        require(amount > 0, "No reward to send");
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Reward transfer failed");
    }

    function distribute(uint256 amount) private {
        jackpot += (amount * 90) / 100;
        operationsBalance += (amount * 5) / 100;
        ownerBalance += (amount * 5) / 100;
        emit Distribute(msg.sender, amount);
    }

    // Util functions
    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function getJackpot() public view returns (uint256) {
        return jackpot;
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

    function getPlayerTickets() external view returns (LotteryTicket[] memory) {
        uint256[] memory ids = playerTicketIds[msg.sender];
        LotteryTicket[] memory result = new LotteryTicket[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = tickets[ids[i]];
        }
        return result;
    }

    function fundJackpot(uint256 amount) external {
        jackpot += amount;
        emit FundJackpot(msg.sender, amount);
    }

    function withdrawOwnerBalance() public payable _onlyOwner {
        require(ownerBalance > 0, "Nothing to withdraw");
        uint256 amount = ownerBalance;
        ownerBalance = 0;
        (bool success, ) = payable(contractOwner).call{value: amount}("");
        require(success, "OwnerBalance withdrawal failed");
        emit OwnerBalanceWithdraw(contractOwner, amount);
    }

    function withdrawOperationsBalance() public payable _onlyOwner {
        require(operationsBalance > 0, "Nothing to withdraw");
        uint256 amount = operationsBalance;
        operationsBalance = 0;
        (bool success, ) = payable(contractOwner).call{value: amount}("");
        require(success, "OperationsBalance withdrawal failed");
        emit OperationsBalanceWithdraw(contractOwner, amount);
    }

    receive() external payable {
        distribute(msg.value);
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
