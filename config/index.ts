import { AbiItem } from "web3-utils"

export const contractAddress = process.env.ACHIEVEMENT_CONTRACT_ADDRESS

export const abi: AbiItem[] = [
	{
		inputs: [
			{ internalType: "address", name: "serverPublicKey", type: "address" },
			{ internalType: "string", name: "baseURI", type: "string" },
			{ internalType: "string", name: "gameListURI", type: "string" },
			{ internalType: "string", name: "gameURI", type: "string" },
			{
				internalType: "string",
				name: "achievementTypeListURI",
				type: "string"
			},
			{ internalType: "string", name: "achievementTypeURI", type: "string" },
			{ internalType: "string", name: "helpURI", type: "string" }
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "_holder",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "_fromGameAccount",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "_achievementTypeId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "_gameId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "_tokenId",
				type: "uint256"
			}
		],
		name: "AchievementsMinted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "_holder",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "_fromGameAccount",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "_achievementTypeId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "_gameId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "_tokenId",
				type: "uint256"
			}
		],
		name: "AchievementsMintedByHolder",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{ indexed: false, internalType: "bool", name: "approved", type: "bool" }
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "_isAllowedTransfer",
				type: "bool"
			}
		],
		name: "TransferState",
		type: "event"
	},
	{
		inputs: [{ internalType: "address", name: "operator", type: "address" }],
		name: "addOperator",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" }
		],
		name: "approve",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "address", name: "owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getAchievementTypeListURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_achievementTypeId", type: "uint256" }
		],
		name: "getAchievementTypeURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "getApproved",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getDisplayUniqueTokenURI",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getGameListURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "uint256", name: "gameId", type: "uint256" }],
		name: "getGameURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getHelpURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getIsAllowedTransfer",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getServerPublicKey",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getStorageContactAddress",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "gameAccount", type: "address" },
			{ internalType: "uint256", name: "achievementTypeId", type: "uint256" }
		],
		name: "getTokenIdByGameAccountAndAchievementTypeId",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "getTokenInfo",
		outputs: [
			{ internalType: "uint256", name: "achievementTypeId", type: "uint256" },
			{ internalType: "uint256", name: "gameId", type: "uint256" },
			{ internalType: "address", name: "fromGameAccount", type: "address" },
			{ internalType: "address", name: "firstHolder", type: "address" }
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "operator", type: "address" }
		],
		name: "isApprovedForAll",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "bytes", name: "signature", type: "bytes" },
			{ internalType: "address", name: "mintAccount", type: "address" },
			{ internalType: "uint256", name: "achievementTypeId", type: "uint256" },
			{ internalType: "uint256", name: "gameId", type: "uint256" }
		],
		name: "mint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "bytes[]", name: "signatureList", type: "bytes[]" },
			{ internalType: "address", name: "mintAccount", type: "address" },
			{
				internalType: "uint256[]",
				name: "achievementTypeIdList",
				type: "uint256[]"
			},
			{ internalType: "uint256[]", name: "gameIdList", type: "uint256[]" }
		],
		name: "multipleMint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "address", name: "", type: "address" }],
		name: "operators",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "ownerOf",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "address", name: "operator", type: "address" }],
		name: "removeOperator",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" }
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "bytes", name: "data", type: "bytes" }
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "string", name: "achievementTypeListURI", type: "string" }
		],
		name: "setAchievementTypeListURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "string", name: "achievementTypeURI", type: "string" }
		],
		name: "setAchievementTypeURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "operator", type: "address" },
			{ internalType: "bool", name: "approved", type: "bool" }
		],
		name: "setApprovalForAll",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "string", name: "newBaseURI", type: "string" }],
		name: "setBaseURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "bool", name: "displayUniqueTokenURI", type: "bool" }
		],
		name: "setDisplayUniqueTokenURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "string", name: "gameListURI", type: "string" }],
		name: "setGameListURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "string", name: "gameURI", type: "string" }],
		name: "setGameURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "string", name: "helpURI", type: "string" }],
		name: "setHelpURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "bool", name: "isAllowedTransfer", type: "bool" }],
		name: "setIsAllowedTransfer",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "serverPublicKey", type: "address" }
		],
		name: "setServerPublicKey",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "contractAddress", type: "address" }
		],
		name: "setStorageContactAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
		name: "supportsInterface",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
		name: "tokenByIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "uint256", name: "index", type: "uint256" }
		],
		name: "tokenOfOwnerByIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "tokenURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" }
		],
		name: "transferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}
]
