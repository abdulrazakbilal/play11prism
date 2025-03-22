import { Player } from "../types/Player";
import { getRoleColor } from "../utils/playerUtils";
import { CircleDollarSign, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface OptimizedTeamProps {
  selectedPlayers: Player[];
  totalScore: number;
  teamName: string;
}

const OptimizedTeam = ({ selectedPlayers, totalScore, teamName }: OptimizedTeamProps) => {
  // Group players by role
  const batsmen = selectedPlayers.filter(p => p.role === "Batsman");
  const bowlers = selectedPlayers.filter(p => p.role === "Bowler");
  const allRounders = selectedPlayers.filter(p => p.role === "All-Rounder");
  const wicketKeepers = selectedPlayers.filter(p => p.role === "Wicket-Keeper");
  
  // Count overseas players
  const overseasCount = selectedPlayers.filter(p => p.overseas === "Yes").length;
  
  return (
    <motion.div 
      className="sticky top-4 subtle-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
        <span className="bg-primary/10 p-1.5 rounded-full">
          <Award size={18} className="text-primary" />
        </span>
        Optimized XI
      </h2>
      
      {teamName && (
        <div className="mb-4 text-lg font-medium text-cricket-blue">
          {teamName}
        </div>
      )}
      
      {selectedPlayers.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-sm font-semibold">Total Score: <span className="text-green-500">{totalScore.toFixed(2)}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CircleDollarSign size={16} className="text-amber-500" />
              <span className="text-sm font-semibold">Overseas: <span className="text-amber-500">{overseasCount}/4</span></span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Wicket Keepers */}
            {wicketKeepers.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">Wicket-Keepers ({wicketKeepers.length})</h3>
                <ul className="space-y-1">
                  {wicketKeepers.map(player => (
                    <li key={player.id} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className={`role-badge ${getRoleColor(player.role)}`}>{player.role.charAt(0)}</span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      {player.overseas === "Yes" && (
                        <span className="role-badge overseas-badge text-xs px-1.5">OS</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Batsmen */}
            {batsmen.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">Batsmen ({batsmen.length})</h3>
                <ul className="space-y-1">
                  {batsmen.map(player => (
                    <li key={player.id} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className={`role-badge ${getRoleColor(player.role)}`}>{player.role.charAt(0)}</span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      {player.overseas === "Yes" && (
                        <span className="role-badge overseas-badge text-xs px-1.5">OS</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* All-Rounders */}
            {allRounders.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">All-Rounders ({allRounders.length})</h3>
                <ul className="space-y-1">
                  {allRounders.map(player => (
                    <li key={player.id} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className={`role-badge ${getRoleColor(player.role)}`}>{player.role.charAt(0)}</span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      {player.overseas === "Yes" && (
                        <span className="role-badge overseas-badge text-xs px-1.5">OS</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Bowlers */}
            {bowlers.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">Bowlers ({bowlers.length})</h3>
                <ul className="space-y-1">
                  {bowlers.map(player => (
                    <li key={player.id} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className={`role-badge ${getRoleColor(player.role)}`}>{player.role.charAt(0)}</span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      {player.overseas === "Yes" && (
                        <span className="role-badge overseas-badge text-xs px-1.5">OS</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          <p>No team optimized yet. Add at least 11 players and click "Optimize Lineup".</p>
        </div>
      )}
    </motion.div>
  );
};

export default OptimizedTeam;
