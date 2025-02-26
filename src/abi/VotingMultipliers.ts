export const votingMultipliersAbi = [
  {
    type: "function",
    name: "acceptOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addMultiplier",
    inputs: [
      {
        name: "_multiplier",
        type: "address",
        internalType: "contract IMultiplier",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowlistedMultipliers",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IMultiplier",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalMultipliers",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalMultipliers",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      {
        name: "_multiplierIndexes",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getValidMultiplierIndexes",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingOwner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeMultiplier",
    inputs: [
      {
        name: "_multiplier",
        type: "address",
        internalType: "contract IMultiplier",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MultiplierAdded",
    inputs: [
      {
        name: "multiplier",
        type: "address",
        indexed: true,
        internalType: "contract IMultiplier",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MultiplierRemoved",
    inputs: [
      {
        name: "multiplier",
        type: "address",
        indexed: true,
        internalType: "contract IMultiplier",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferStarted",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "InvalidInitialization", inputs: [] },
  { type: "error", name: "InvalidMultiplierIndex", inputs: [] },
  { type: "error", name: "MultiplierAlreadyAllowlisted", inputs: [] },
  { type: "error", name: "MultiplierNotAllowlisted", inputs: [] },
  { type: "error", name: "NotInitializing", inputs: [] },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
] as const;
