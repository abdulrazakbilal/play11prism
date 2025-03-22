
import { Player, PlayerRole, OverseasStatus } from '../types/Player';

export const calculateCompositeScore = (player: Player): number => {
  let score = 0;
  
  switch (player.role) {
    case "Batsman":
      score = (player.battingAverage * 0.5) + (player.strikeRate * 0.3) + (player.catches * 0.2);
      break;
    case "Bowler":
      score = ((player.wickets || 0) * 0.6) - ((player.bowlingEconomy || 0) * 0.2) + (player.catches * 0.2);
      break;
    case "All-Rounder":
      const battingScore = (player.battingAverage * 0.5) + (player.strikeRate * 0.3) + (player.catches * 0.2);
      const bowlingScore = ((player.wickets || 0) * 0.6) - ((player.bowlingEconomy || 0) * 0.2) + (player.catches * 0.2);
      score = (battingScore + bowlingScore) / 2;
      break;
    case "Wicket-Keeper":
      score = (player.battingAverage * 0.4) + (player.strikeRate * 0.2) + (player.catches * 0.4);
      break;
  }
  
  return parseFloat(score.toFixed(2));
};

export const getRoleColor = (role: PlayerRole): string => {
  switch (role) {
    case "Batsman":
      return "role-batsman";
    case "Bowler":
      return "role-bowler";
    case "All-Rounder":
      return "role-all-rounder";
    case "Wicket-Keeper":
      return "role-wicket-keeper";
    default:
      return "";
  }
};

export const generateRandomId = (): number => {
  return Math.floor(Math.random() * 10000);
};

export const samplePlayers: Player[] = [
  {
    id: 1,
    name: "Virat Kohli",
    role: "Batsman",
    overseas: "No",
    battingAverage: 38.2,
    strikeRate: 137.9,
    bowlingEconomy: null,
    wickets: null,
    catches: 92,
  },
  {
    id: 2,
    name: "Jasprit Bumrah",
    role: "Bowler",
    overseas: "No",
    battingAverage: 8.2,
    strikeRate: 90.5,
    bowlingEconomy: 6.7,
    wickets: 145,
    catches: 21,
  },
  {
    id: 3, 
    name: "Jos Buttler",
    role: "Wicket-Keeper",
    overseas: "Yes",
    battingAverage: 34.1,
    strikeRate: 149.8,
    bowlingEconomy: null,
    wickets: null,
    catches: 105,
  },
  {
    id: 4,
    name: "Andre Russell",
    role: "All-Rounder",
    overseas: "Yes",
    battingAverage: 25.3,
    strikeRate: 176.2,
    bowlingEconomy: 8.9,
    wickets: 89,
    catches: 67,
  },
  {
    id: 5,
    name: "Quinton de Kock",
    role: "Wicket-Keeper",
    overseas: "Yes",
    battingAverage: 31.5,
    strikeRate: 138.7,
    bowlingEconomy: null,
    wickets: null,
    catches: 115,
  }
];
