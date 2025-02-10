// Boost is just an example interface, to be replaced by whatever 
// aggregate of data sources end up being needed. 
// As long as the mapping functions can still map the real data 
// sources to the input props, all will be well.
export interface Boost {
  iconName: string;
  boosterName: string;
  verified: boolean;
  boostAmmount: string;
  boostAmmountSubtitle: string;
  description: string;
  expiration: Date;
  expirationUrgent: boolean;
  progress: BoostProgress[];
  requirements: BoostRequirement[];
}

export interface BoostProgress {
  name: string;
  subtitle: string;
  achieved: boolean;
}

export interface BoostRequirement {
  name: string;
  achieved: boolean;
}

// Mapping Boost to view properties
export function mapBoostToCardProps(boost: Boost) {
  const now = new Date();
  const timeDifference = boost.expiration.getTime() - now.getTime();
  const daysUntilExpiration = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return {
    iconName: boost.iconName,
    boosterName: boost.boosterName,
    verified: boost.verified,
    boostAmmount: boost.boostAmmount,
    boostAmmountSubtitle: boost.boostAmmountSubtitle,
    description: boost.description,
    expiration: daysUntilExpiration,
    expirationUrgent: boost.expirationUrgent,
  };
}

export function mapBoostToDetailedCardProps(boost: Boost) {
  const baseProps = mapBoostToCardProps(boost);
  const progress = boost.progress.map(item => ({ title: item.name, subtitle: item.subtitle, achieved: item.achieved }))
  const requirements = boost.requirements.map(item => ({ title: item.name, subtitle: null, achieved: item.achieved }))

  return {
    ...baseProps,
    progress: progress,
    requirements: requirements
  };
}

// Mock data
const boostData: Boost[] = [
  {
    iconName: "star",
    boosterName: "Super Boost",
    verified: true,
    boostAmmount: "x1.10",
    boostAmmountSubtitle: "Extra Power",
    description: "Injects a cryptographic surge into your workflow, enhancing your processing speed and contract verification capabilities by 10%. Ideal for those who demand precision and security while leveraging blockchain integrations for decentralized applications. Perfect for smart contract deployments that need an extra push towards efficiency and validation certainty.",
    expiration: new Date("2025-12-31"),
    expirationUrgent: false,
    progress: [
      {
        name: "First Milestone",
        subtitle: "Deploy an ERC-20 contract",
        achieved: true
      },
      {
        name: "Lift Server",
        subtitle: "Raise it up high",
        achieved: true
      },
      {
        name: "Puncture Bank",
        subtitle: "Use pointy object",
        achieved: true
      },
      {
        name: "Final Goal",
        subtitle: "Complete a mainnet transaction over 1 ETH",
        achieved: false
      }
    ],
    requirements: [
      {
        name: "Verify a wallet address",
        achieved: true
      },
      {
        name: "Be covered in eth",
        achieved: true
      },
      {
        name: "Enable multi-sig authentication",
        achieved: false
      }
    ]
  },
  {
    iconName: "flame",
    boosterName: "Gas Saver Fire Burner Dark Sky",
    verified: false,
    boostAmmount: "x1.05",
    boostAmmountSubtitle: "Efficient Transactions",
    description: "Optimizes gas fees dynamically, reducing unnecessary overhead and ensuring your transactions execute at the optimal cost-to-speed ratio.",
    expiration: new Date("2025-06-30"),
    expirationUrgent: true,
    progress: [
      {
        name: "First Transaction",
        subtitle: "Send 0.01 ETH",
        achieved: true
      },
      {
        name: "Efficiency Master",
        subtitle: "Reduce gas fees by 30% in a week",
        achieved: false
      }
    ],
    requirements: [
      {
        name: "Connect to a gas tracker API",
        achieved: false
      }
    ]
  },
  {
    iconName: "shield",
    boosterName: "Guardian Node",
    verified: true,
    boostAmmount: "x1.15",
    boostAmmountSubtitle: "Enhanced Protection",
    description: "Activates a decentralized security layer for your dApp, strengthening its resistance against Sybil attacks, fraudulent transactions, and malicious nodes. Running a Guardian Node ensures that your infrastructure remains resilient, while also granting you priority access to upcoming consensus protocol improvements.",
    expiration: new Date("2026-01-01"),
    expirationUrgent: false,
    progress: [],
    requirements: [
      {
        name: "Stake at least 10,000 native tokens",
        achieved: true
      }
    ]
  },
  {
    iconName: "bolt",
    boosterName: "Lightning Relay",
    verified: false,
    boostAmmount: "x1.20",
    boostAmmountSubtitle: "Quick Reflexes",
    description: "A high-speed transaction relay that minimizes latency between your wallet and on-chain execution.",
    expiration: new Date("2025-09-15"),
    expirationUrgent: false,
    progress: [
      {
        name: "First Execution",
        subtitle: "Complete a swap in under 5 seconds",
        achieved: false
      },
      {
        name: "Second Execution",
        subtitle: "Complete a swap in under 2 seconds",
        achieved: false
      },
      {
        name: "Second Execution",
        subtitle: "Complete a swap in under 0.05 seconds",
        achieved: false
      }
    ],
    requirements: []
  },
  {
    iconName: "leaf",
    boosterName: "Green Chain",
    verified: true,
    boostAmmount: "x1.08",
    boostAmmountSubtitle: "Eco-Friendly Power",
    description: "Prioritizes low-carbon blockchain interactions, reducing your footprint while maintaining on-chain efficiency. By leveraging eco-friendly validators and low-energy consensus mechanisms, this boost ensures that every transaction contributes to a more sustainable decentralized ecosystem.",
    expiration: new Date("2025-11-20"),
    expirationUrgent: false,
    progress: [
      {
        name: "Carbon Offset",
        subtitle: "Offset 0.1 ETH worth of emissions",
        achieved: true
      }
    ],
    requirements: [
      {
        name: "Connect to a green validator pool",
        achieved: false
      }
    ]
  },
  {
    iconName: "gem",
    boosterName: "Yield Optimizer",
    verified: true,
    boostAmmount: "x1.12",
    boostAmmountSubtitle: "Treasure Hunter",
    description: "Automatically redistributes your holdings across high-yield farming opportunities, optimizing for APY returns while minimizing risk exposure. Perfect for DeFi strategists looking to maximize passive income while staying ahead of the market’s shifting liquidity pools.",
    expiration: new Date("2025-08-31"),
    expirationUrgent: true,
    progress: [],
    requirements: [
      {
        name: "Provide liquidity to a farming pool",
        achieved: true
      }
    ]
  },
  {
    iconName: "moon",
    boosterName: "Night Owl",
    verified: false,
    boostAmmount: "x1.06",
    boostAmmountSubtitle: "See in the Dark",
    description: "Optimizes transaction visibility and execution during low-traffic periods, giving you an edge in off-peak blockchain interactions.",
    expiration: new Date("2026-02-14"),
    expirationUrgent: false,
    progress: [],
    requirements: []
  }
];

export { boostData };

