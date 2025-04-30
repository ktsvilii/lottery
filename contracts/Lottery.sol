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
    uint32 public constant CALLBACK_GAS_LIMIT = 200_000;
    uint8 public constant NUMBER_OF_WORDS = 1;

    // --- Storage Variables ---
    uint256 public jackpot;
    uint256 private operationsBalance;
    uint256 private ownerBalance;
    uint256 public nextTicketId;

    uint256[5] private DEFAULT_COMBINATION;

    struct LotteryTicket {
        uint256 id;
        address owner;
        uint256 purchaseTimestamp;
        uint256[5] playerCombination;
        uint256[5] winningCombination;
        uint256 randomWord;
        bool isRewardClaimed;
        bool playerCombinationSubmitted;
        bool winningCombinationGenerated;
    }

    mapping(address => uint256) public addressToActiveTicketNumber;
    mapping(uint256 => LotteryTicket) public tickets;
    mapping(uint256 => uint256) public requestIdToTicketId;

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
    event Distribute(address indexed owner, uint256 indexed amount);
    event OwnerBalanceWithdraw(address indexed owner, uint256 indexed amount);
    event OperationsBalanceWithdraw(
        address indexed owner,
        uint256 indexed amount
    );

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

    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function getJackpot() public view returns (uint256) {
        return jackpot;
    }

    function getActiveTicketNumber(
        address walletAddress
    ) public view returns (uint256) {
        return addressToActiveTicketNumber[walletAddress];
    }

    function buyTicket() public payable {
        require(tx.origin == msg.sender, "Only real players!");
        require(msg.value == TICKET_PRICE_WEI, "Transaction value is too low!");

        LotteryTicket memory newTicket = LotteryTicket({
            id: nextTicketId++,
            owner: msg.sender,
            purchaseTimestamp: block.timestamp,
            playerCombination: DEFAULT_COMBINATION,
            winningCombination: DEFAULT_COMBINATION,
            randomWord: 0,
            isRewardClaimed: false,
            playerCombinationSubmitted: false,
            winningCombinationGenerated: false
        });

        tickets[newTicket.id] = newTicket;
        addressToActiveTicketNumber[msg.sender] = newTicket.id;

        distribute(msg.value);

        emit TicketPurchased(msg.sender, newTicket.id);
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

        searchedTicket.playerCombination = playerCombination;
        searchedTicket.playerCombinationSubmitted = true;

        emit PlayerCombinationSubmitted(msg.sender, playerCombination);

        _requestRandomNumber(ticketId);
    }

    function getResults(uint256 ticketId) external nonReentrant {
        LotteryTicket storage ticket = tickets[ticketId];

        require(
            ticket.owner == msg.sender,
            "Only ticket owner can use the ticket"
        );
        require(ticket.owner != address(0), "Ticket does not exist");
        require(ticket.randomWord != 0, "Combination is not generated yet");
        require(
            !ticket.winningCombinationGenerated,
            "Winning combination already generated"
        );

        _generateWinningCombination(ticket);
        ticket.winningCombinationGenerated = true;

        emit WinningCombinationGenerated(ticketId, ticket.winningCombination);

        uint8 matchingNumbers = _checkWinningCombination(
            ticket.playerCombination,
            ticket.winningCombination
        );

        uint256 rewardAmount = _calculateReward(matchingNumbers);

        emit LotteryResults(
            ticket.owner,
            ticket.id,
            ticket.playerCombination,
            ticket.winningCombination,
            matchingNumbers,
            rewardAmount
        );

        uint256 payout = rewardAmount;
        if (rewardAmount > 0) {
            if (jackpot >= rewardAmount) {
                jackpot -= rewardAmount;
            } else {
                payout = jackpot;
                jackpot = 0;
            }

            ticket.isRewardClaimed = true;
            delete addressToActiveTicketNumber[ticket.owner];

            _sendReward(ticket.owner, payout);
        }
        emit RewardClaimed(ticket.owner, ticketId, payout);
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
        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        uint256 ticketId = requestIdToTicketId[requestId];
        tickets[ticketId].randomWord = randomWords[0];

        emit RandomNumberGenerated(requestId, ticketId, randomWords[0]);
    }

    function _generateWinningCombination(
        LotteryTicket storage ticket
    ) internal {
        uint8[37] memory used;
        uint256 count = 0;
        bytes32 randomBytes = keccak256(abi.encode(ticket.randomWord));
        uint24 randomIndex = 0;

        while (count < 5) {
            if (randomIndex >= 32) {
                randomBytes = keccak256(abi.encode(randomBytes));
                randomIndex = 0;
            }
            uint8 number = uint8(randomBytes[randomIndex]) % NUMBER_RANGE;
            randomIndex++;

            if (used[number] == 0) {
                used[number] = 1;
                ticket.winningCombination[count] = number;
                count++;
            }
        }
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
        if (matchingNumbers == 0 || matchingNumbers == 1) {
            return 0;
        } else if (matchingNumbers == 2) {
            return TICKET_PRICE_WEI;
        } else if (matchingNumbers == 3) {
            return (jackpot * 5) / 100;
        } else if (matchingNumbers == 4) {
            return (jackpot * 30) / 100;
        } else if (matchingNumbers == 5) {
            return jackpot;
        } else {
            revert("Unexpected matching number count");
        }
    }

    function _sendReward(address recipient, uint256 amount) internal {
        require(amount > 0, "No reward to send");
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Reward transfer failed");
    }

    function distribute(uint256 amount) private {
        jackpot += (amount * 85) / 100;
        operationsBalance += (amount * 10) / 100;
        ownerBalance += (amount * 5) / 100;
        emit Distribute(msg.sender, amount);
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
