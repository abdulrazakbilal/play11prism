
export type PlayerRole = "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";

export type OverseasStatus = "Yes" | "No";

export interface Player {
  id: number;
  name: string;
  role: PlayerRole;
  overseas: OverseasStatus;
  battingAverage: number;
  strikeRate: number;
  bowlingEconomy: number | null;
  wickets: number | null;
  catches: number;
  compositeScore?: number;
}

export interface OptimizationResult {
  selectedPlayers: Player[];
  totalScore: number;
}
