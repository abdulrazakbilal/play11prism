
import { Player } from "../types/Player";
import { calculateCompositeScore, getRoleColor } from "../utils/playerUtils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Wand2, Users } from "lucide-react";

interface OptimizedTeamProps {
  selectedPlayers: Player[];
  totalScore: number;
}

const OptimizedTeam = ({ selectedPlayers, totalScore }: OptimizedTeamProps) => {
  // Count player types
  const overseasCount = selectedPlayers.filter(p => p.overseas === "Yes").length;
  const batsmanCount = selectedPlayers.filter(p => p.role === "Batsman").length;
  const bowlerCount = selectedPlayers.filter(p => p.role === "Bowler").length;
  const allRounderCount = selectedPlayers.filter(p => p.role === "All-Rounder").length;
  const wicketKeeperCount = selectedPlayers.filter(p => p.role === "Wicket-Keeper").length;
  
  // Get team name from the first player (all players in the optimized team should be from the same team)
  const teamName = selectedPlayers.length > 0 ? selectedPlayers[0].team : "";
  
  // Sort players by role for display
  const sortedPlayers = [...selectedPlayers].sort((a, b) => {
    const roleOrder = {
      "Wicket-Keeper": 1,
      "Batsman": 2,
      "All-Rounder": 3,
      "Bowler": 4
    };
    
    return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
  });
  
  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <span className="bg-primary/10 p-1.5 rounded-full">
            <Wand2 size={18} className="text-primary" />
          </span>
          Optimized Playing XI
        </h2>
        
        {selectedPlayers.length > 0 && (
          <div className="text-xl font-semibold text-cricket-blue">
            Score: {totalScore.toFixed(2)}
          </div>
        )}
      </div>
      
      {selectedPlayers.length === 0 ? (
        <motion.div 
          className="text-center py-16 text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Users size={42} className="mx-auto mb-4 opacity-40" />
          <p className="mb-2">Add players to generate your optimized XI</p>
          <p className="text-sm">You need a minimum of 11 players with the right balance</p>
        </motion.div>
      ) : (
        <div>
          {teamName && (
            <div className="mb-4 text-xl font-semibold text-center bg-cricket-blue/10 py-2 rounded-lg">
              {teamName}
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600 dark:text-slate-400">Batsmen</div>
              <div className="text-xl font-semibold">{batsmanCount}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600 dark:text-slate-400">Bowlers</div>
              <div className="text-xl font-semibold">{bowlerCount}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600 dark:text-slate-400">All-Rounders</div>
              <div className="text-xl font-semibold">{allRounderCount}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600 dark:text-slate-400">Overseas</div>
              <div className="text-xl font-semibold">{overseasCount} / 4</div>
            </div>
          </div>
          
          <ScrollArea className="h-[420px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedPlayers.map((player, index) => (
                <motion.div 
                  key={player.id}
                  className="player-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`role-badge ${getRoleColor(player.role)} mb-1`}>
                        {player.role}
                      </span>
                      {player.overseas === "Yes" && (
                        <span className="role-badge overseas-badge ml-2">Overseas</span>
                      )}
                      <h3 className="text-lg font-semibold">{player.name}</h3>
                    </div>
                    <div className="player-score-pill">
                      {calculateCompositeScore(player).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Batting Avg:</span>
                      <span className="font-medium">{player.battingAverage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Strike Rate:</span>
                      <span className="font-medium">{player.strikeRate.toFixed(2)}</span>
                    </div>
                    
                    {(player.role === "Bowler" || player.role === "All-Rounder") && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Economy:</span>
                          <span className="font-medium">{player.bowlingEconomy?.toFixed(2) || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Wickets:</span>
                          <span className="font-medium">{player.wickets || "—"}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Catches:</span>
                      <span className="font-medium">{player.catches}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </motion.div>
  );
};

export default OptimizedTeam;
