// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SlashableStaking is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakeToken;
    uint256 public immutable stakeAmount;

    // track staker balances (0 or stakeAmount only)
    mapping(address => uint256) private _staked;

    event Staked(address indexed user, uint256 amount);
    event Slashed(address indexed user, uint256 amount, address indexed to);
    event Unstaked(address indexed user, uint256 amount);

    constructor(IERC20 _stakeToken, uint256 _stakeAmount) Ownable(msg.sender) {
        require(address(_stakeToken) != address(0), "zero token");
        require(_stakeAmount > 0, "zero stake");
        stakeToken = _stakeToken;
        stakeAmount = _stakeAmount;
    }

    /// @notice Consumer stakes exactly stakeAmount once
    function stake() external {
        require(_staked[msg.sender] == 0, "already staked");

        stakeToken.safeTransferFrom(msg.sender, address(this), stakeAmount);
        _staked[msg.sender] = stakeAmount;

        emit Staked(msg.sender, stakeAmount);
    }

    /// @notice Owner slashes a staker and transfers their funds to owner
    function slash(address user) external onlyOwner {
        uint256 amount = _staked[user];
        require(amount > 0, "not staked");

        _staked[user] = 0;
        stakeToken.safeTransfer(owner(), amount);

        emit Slashed(user, amount, owner());
    }

    /// @notice Staker voluntarily unstakes (if not slashed)
    function unstake() external {
        uint256 amount = _staked[msg.sender];
        require(amount > 0, "nothing to unstake");

        _staked[msg.sender] = 0;
        stakeToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /// @notice Check if an address has staked and how much
    function getStaked(address user) external view returns (uint256) {
        return _staked[user];
    }
}
