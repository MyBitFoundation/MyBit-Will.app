export const ADDRESS = '0xcbe39b4a71988c5491ceab09a17658a03b9e4e0f';
export const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_recipient",
				"type": "address"
			},
			{
				"name": "_secBetweenProofs",
				"type": "uint256"
			},
			{
				"name": "_revokeable",
				"type": "bool"
			}
		],
		"name": "createWill",
		"outputs": [
			{
				"name": "id",
				"type": "bytes32"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "bytes32"
			}
		],
		"name": "getWill",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "expired",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "bytes32"
			}
		],
		"name": "proveExistence",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "closeContract",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "database",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_recipient",
				"type": "address"
			},
			{
				"name": "_secBetweenProofs",
				"type": "uint256"
			},
			{
				"name": "_revokeable",
				"type": "bool"
			},
			{
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "createERC20Will",
		"outputs": [
			{
				"name": "id",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "mybFee",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newFee",
				"type": "uint256"
			}
		],
		"name": "changeMYBFee",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "bytes32"
			}
		],
		"name": "claimWill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "bytes32"
			}
		],
		"name": "revokeWill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "bytes32"
			},
			{
				"name": "_newDesiredSec",
				"type": "uint256"
			}
		],
		"name": "changeSecBetweenProofs",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "mybBurner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_database",
				"type": "address"
			},
			{
				"name": "_mybTokenBurner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_creator",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_id",
				"type": "bytes32"
			}
		],
		"name": "LogERC20WillCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_creator",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_id",
				"type": "bytes32"
			}
		],
		"name": "LogWillCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_id",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "LogWillClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_id",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "LogWillRevoked",
		"type": "event"
	}
]