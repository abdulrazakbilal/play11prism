
import { Player, OptimizationResult } from '../types/Player';
import { calculateCompositeScore } from './playerUtils';

// This is a simplified version of the optimization algorithm for the frontend
// In a real application, this would be implemented on the backend with a proper LP solver
export const optimizeLineup = (players: Player[]): OptimizationResult => {
  // Calculate composite scores for all players
  const playersWithScores = players.map(player => {
    const compositeScore = calculateCompositeScore(player);
    return { ...player, compositeScore };
  });
  
  // Sort players by composite score in descending order
  const sortedPlayers = [...playersWithScores].sort((a, b) => 
    (b.compositeScore || 0) - (a.compositeScore || 0)
  );
  
  // Initialize counters and constraints
  let selectedPlayers: Player[] = [];
  let batsmenCount = 0;
  let bowlersCount = 0;
  let allRoundersCount = 0;
  let wicketKeepersCount = 0;
  let overseasCount = 0;
  
  // Function to check if player meets the team constraints
  const meetsConstraints = (player: Player): boolean => {
    if (selectedPlayers.length >= 11) return false;
    
    if (player.overseas === "Yes" && overseasCount >= 4) return false;
    
    if (player.role === "Batsman" && batsmenCount >= 6) return false;
    if (player.role === "Bowler" && bowlersCount >= 6) return false;
    if (player.role === "All-Rounder" && allRoundersCount >= 4) return false;
    if (player.role === "Wicket-Keeper" && wicketKeepersCount >= 2) return false;
    
    return true;
  };
  
  // First pass: select players while respecting constraints
  for (const player of sortedPlayers) {
    if (meetsConstraints(player)) {
      selectedPlayers.push(player);
      
      if (player.overseas === "Yes") overseasCount++;
      
      if (player.role === "Batsman") batsmenCount++;
      else if (player.role === "Bowler") bowlersCount++;
      else if (player.role === "All-Rounder") allRoundersCount++;
      else if (player.role === "Wicket-Keeper") wicketKeepersCount++;
    }
  }
  
  // Second pass: ensure we meet minimum requirements
  if (selectedPlayers.length < 11) {
    // Logic to fill in the remaining spots while ensuring constraints
    const remainingPlayers = sortedPlayers.filter(
      player => !selectedPlayers.includes(player)
    );
    
    // Prioritize required player roles
    if (wicketKeepersCount < 1) {
      const wicketKeeper = remainingPlayers.find(p => p.role === "Wicket-Keeper");
      if (wicketKeeper) {
        selectedPlayers.push(wicketKeeper);
        wicketKeepersCount++;
        if (wicketKeeper.overseas === "Yes") overseasCount++;
      }
    }
    
    if (batsmenCount < 3) {
      const batsmen = remainingPlayers
        .filter(p => p.role === "Batsman" && !selectedPlayers.includes(p))
        .slice(0, 3 - batsmenCount);
      
      for (const batsman of batsmen) {
        if (selectedPlayers.length < 11 && (batsman.overseas === "No" || overseasCount < 4)) {
          selectedPlayers.push(batsman);
          batsmenCount++;
          if (batsman.overseas === "Yes") overseasCount++;
        }
      }
    }
    
    if (bowlersCount < 3) {
      const bowlers = remainingPlayers
        .filter(p => p.role === "Bowler" && !selectedPlayers.includes(p))
        .slice(0, 3 - bowlersCount);
      
      for (const bowler of bowlers) {
        if (selectedPlayers.length < 11 && (bowler.overseas === "No" || overseasCount < 4)) {
          selectedPlayers.push(bowler);
          bowlersCount++;
          if (bowler.overseas === "Yes") overseasCount++;
        }
      }
    }
    
    if (allRoundersCount < 1) {
      const allRounder = remainingPlayers.find(p => p.role === "All-Rounder" && !selectedPlayers.includes(p));
      if (allRounder && selectedPlayers.length < 11 && (allRounder.overseas === "No" || overseasCount < 4)) {
        selectedPlayers.push(allRounder);
        allRoundersCount++;
        if (allRounder.overseas === "Yes") overseasCount++;
      }
    }
    
    // Fill remaining spots with best available players
    while (selectedPlayers.length < 11) {
      const remainingEligible = remainingPlayers.filter(
        p => !selectedPlayers.includes(p) && (p.overseas === "No" || overseasCount < 4)
      );
      
      if (remainingEligible.length === 0) break;
      
      const nextBest = remainingEligible[0];
      selectedPlayers.push(nextBest);
      
      if (nextBest.overseas === "Yes") overseasCount++;
      
      if (nextBest.role === "Batsman") batsmenCount++;
      else if (nextBest.role === "Bowler") bowlersCount++;
      else if (nextBest.role === "All-Rounder") allRoundersCount++;
      else if (nextBest.role === "Wicket-Keeper") wicketKeepersCount++;
    }
  }
  
  // Calculate total score of selected team
  const totalScore = selectedPlayers.reduce(
    (sum, player) => sum + (player.compositeScore || 0),
    0
  );
  
  return {
    selectedPlayers,
    totalScore: parseFloat(totalScore.toFixed(2))
  };
};
