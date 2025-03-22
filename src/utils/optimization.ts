
import { Player, OptimizationResult } from '../types/Player';
import { calculateCompositeScore } from './playerUtils';

// Optimizes the team lineup
export const optimizeLineup = (players: Player[]): OptimizationResult => {
  // Add composite scores to players if not already present
  const playersWithScores = players.map(player => ({
    ...player,
    compositeScore: player.compositeScore || calculateCompositeScore(player)
  }));

  // Get the team name from the first player
  const teamName = players[0]?.team || "Unknown Team";
  
  // Constraints
  const MAX_PLAYERS = 11;
  const MAX_OVERSEAS = 4;
  const REQUIRED_ROLES = {
    "Batsman": { min: 3, max: 6 },
    "Bowler": { min: 3, max: 6 },
    "All-Rounder": { min: 1, max: 4 },
    "Wicket-Keeper": { min: 1, max: 2 }
  };

  // Sort players by score within each role
  const roleGroups: Record<string, Player[]> = {
    "Batsman": [],
    "Bowler": [],
    "All-Rounder": [],
    "Wicket-Keeper": []
  };

  // Group players by role
  playersWithScores.forEach(player => {
    if (roleGroups[player.role]) {
      roleGroups[player.role].push(player);
    }
  });

  // Sort each group by composite score (descending)
  Object.keys(roleGroups).forEach(role => {
    roleGroups[role].sort((a, b) => 
      (b.compositeScore || 0) - (a.compositeScore || 0)
    );
  });

  // Initial selection with minimum requirements
  let selectedPlayers: Player[] = [];
  let overseasCount = 0;
  let totalScore = 0;

  // First, select minimum number of players from each role
  Object.entries(REQUIRED_ROLES).forEach(([role, constraints]) => {
    const candidatesForRole = roleGroups[role];
    const selectedForRole: Player[] = [];
    
    let i = 0;
    while (selectedForRole.length < constraints.min && i < candidatesForRole.length) {
      const player = candidatesForRole[i];
      
      // Check overseas constraint
      if (player.overseas === "Yes" && overseasCount >= MAX_OVERSEAS) {
        i++;
        continue;
      }
      
      selectedForRole.push(player);
      if (player.overseas === "Yes") overseasCount++;
      i++;
    }
    
    selectedPlayers = [...selectedPlayers, ...selectedForRole];
    // Remove selected players from their groups
    selectedForRole.forEach(player => {
      const index = roleGroups[role].findIndex(p => p.id === player.id);
      if (index !== -1) roleGroups[role].splice(index, 1);
    });
  });

  // Calculate how many more players we need
  const remainingSlots = MAX_PLAYERS - selectedPlayers.length;
  
  // Combine remaining players from all roles
  const remainingCandidates = [
    ...roleGroups["Batsman"],
    ...roleGroups["Bowler"],
    ...roleGroups["All-Rounder"],
    ...roleGroups["Wicket-Keeper"]
  ].sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0));
  
  // Select remaining players based on highest score, respecting constraints
  let i = 0;
  while (selectedPlayers.length < MAX_PLAYERS && i < remainingCandidates.length) {
    const player = remainingCandidates[i];
    
    // Check overseas constraint
    if (player.overseas === "Yes" && overseasCount >= MAX_OVERSEAS) {
      i++;
      continue;
    }
    
    // Check role constraints
    const currentRoleCount = selectedPlayers.filter(p => p.role === player.role).length;
    if (currentRoleCount >= REQUIRED_ROLES[player.role].max) {
      i++;
      continue;
    }
    
    selectedPlayers.push(player);
    if (player.overseas === "Yes") overseasCount++;
    
    // Remove this player from consideration for future selections
    i++;
  }

  // Calculate total score of selected players
  totalScore = selectedPlayers.reduce((sum, player) => sum + (player.compositeScore || 0), 0);

  return {
    selectedPlayers,
    totalScore,
    teamName
  };
};
