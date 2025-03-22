
import { useState } from "react";
import { Player } from "../types/Player";
import { calculateCompositeScore, getRoleColor } from "../utils/playerUtils";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Trash2, Filter } from "lucide-react";

interface PlayerTableProps {
  players: Player[];
  onRemovePlayer: (id: number) => void;
}

const PlayerTable = ({ players, onRemovePlayer }: PlayerTableProps) => {
  const [filter, setFilter] = useState<string>("all");
  
  // Calculate composite scores dynamically
  const playersWithScores = players.map(player => ({
    ...player,
    compositeScore: calculateCompositeScore(player)
  }));
  
  // Apply filters
  const filteredPlayers = playersWithScores.filter(player => {
    if (filter === "all") return true;
    if (filter === "overseas" && player.overseas === "Yes") return true;
    if (filter === "domestic" && player.overseas === "No") return true;
    if (filter === player.role.toLowerCase()) return true;
    return false;
  });
  
  // Sort by composite score (descending)
  const sortedPlayers = [...filteredPlayers].sort(
    (a, b) => (b.compositeScore || 0) - (a.compositeScore || 0)
  );
  
  const getValueOrDash = (value: any) => {
    return value !== null && value !== undefined ? value : "—";
  };
  
  return (
    <motion.div 
      className="subtle-card p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Player Database ({players.length})</h2>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-cricket-blue text-white" : ""}
          >
            All
          </Button>
          <Button 
            variant={filter === "batsman" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("batsman")}
            className={filter === "batsman" ? "bg-cricket-blue text-white" : ""}
          >
            Batsmen
          </Button>
          <Button 
            variant={filter === "bowler" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("bowler")}
            className={filter === "bowler" ? "bg-cricket-blue text-white" : ""}
          >
            Bowlers
          </Button>
          <Button 
            variant={filter === "all-rounder" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("all-rounder")}
            className={filter === "all-rounder" ? "bg-cricket-blue text-white" : ""}
          >
            All-Rounders
          </Button>
          <Button 
            variant={filter === "wicket-keeper" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("wicket-keeper")}
            className={filter === "wicket-keeper" ? "bg-cricket-blue text-white" : ""}
          >
            Wicket-Keepers
          </Button>
          <Button 
            variant={filter === "overseas" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("overseas")}
            className={filter === "overseas" ? "bg-cricket-blue text-white" : ""}
          >
            Overseas
          </Button>
        </div>
      </div>
      
      {players.length === 0 ? (
        <motion.div 
          className="text-center py-12 text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Filter size={32} className="mx-auto mb-4 opacity-40" />
          <p>No players added yet. Add your first player above.</p>
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Batting Avg</TableHead>
                <TableHead>Strike Rate</TableHead>
                <TableHead>Economy</TableHead>
                <TableHead>Wickets</TableHead>
                <TableHead>Catches</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player) => (
                <TableRow key={player.id} className="animate-fade-in">
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.team}</TableCell>
                  <TableCell>
                    <span className={`role-badge ${getRoleColor(player.role)}`}>
                      {player.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {player.overseas === "Yes" ? (
                      <span className="role-badge overseas-badge">Overseas</span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400 text-sm">Domestic</span>
                    )}
                  </TableCell>
                  <TableCell>{player.battingAverage.toFixed(2)}</TableCell>
                  <TableCell>{player.strikeRate.toFixed(2)}</TableCell>
                  <TableCell>{getValueOrDash(player.bowlingEconomy?.toFixed(2))}</TableCell>
                  <TableCell>{getValueOrDash(player.wickets)}</TableCell>
                  <TableCell>{player.catches}</TableCell>
                  <TableCell className="text-right font-semibold">
                    <span className="player-score-pill">
                      {player.compositeScore?.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemovePlayer(player.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

export default PlayerTable;
