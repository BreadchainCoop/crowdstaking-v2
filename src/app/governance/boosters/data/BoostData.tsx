// Boost is just an example interface, to be replaced by whatever
// aggregate of data sources end up being needed.
// As long as the mapping functions can still map the real data
// sources to the input props, all will be well.
export interface Boost {
  iconName: string;
  boosterName: string;
  verified: boolean;
  boostAmmount: string;
  descriptionShort: string;
  descriptionLong: string;
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
    descriptionShort: boost.descriptionShort,
    descriptionLong: boost.descriptionLong,
    expiration: daysUntilExpiration,
    expirationUrgent: boost.expirationUrgent,
  };
}

export function mapBoostToDetailedCardProps(boost: Boost) {
  const baseProps = mapBoostToCardProps(boost);
  const progress = boost.progress.map((item) => ({
    title: item.name,
    subtitle: item.subtitle,
    achieved: item.achieved,
  }));
  const requirements = boost.requirements.map((item) => ({
    title: item.name,
    subtitle: null,
    achieved: item.achieved,
  }));

  return {
    ...baseProps,
    progress: progress,
    requirements: requirements,
  };
}

const boostData: Boost[] = [
  {
    iconName: "bullseye",
    boosterName: "Voting Streaks",
    verified: false, // TODO: should check if user has an active boost and if so, set to true
    boostAmmount: "x1.10", // TODO: should fetch from smart contract
    descriptionShort: "Maintain a Breadchain voting cycle streak.",
    descriptionLong:
      "Maintain a Breadchain voting cycle streak. Break your streak and you will have to start over.",
    expiration: new Date("2025-12-31"), // TODO: should fetch from userToValidUntil
    expirationUrgent: false, // TODO: should be true if expiration is within 30 days
    progress: [
      {
        name: "Start (no booster)",
        subtitle: "",
        achieved: true,
      },
      {
        name: "Lift Server",
        subtitle: "Raise it up high",
        achieved: true,
      },
      {
        name: "Streak of 2 voting cycles",
        subtitle: "",
        achieved: true,
      },
      {
        name: "Streak of 4 voting cycles",
        subtitle: "",
        achieved: false,
      },
      {
        name: "Streak of 6 voting cycles",
        subtitle: "",
        achieved: false,
      },
    ],
    requirements: [],
  },
];

export { boostData };
