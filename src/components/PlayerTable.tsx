
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
import { Trash2, Filter, Download, UserRoundX, Pencil } from "lucide-react";
import PlayerForm from "./PlayerForm";

interface PlayerTableProps {
  players: Player[];
  onRemovePlayer: (id: number) => void;
  onUpdatePlayer: (player: Player) => void;
}

const PlayerTable = ({ players, onRemovePlayer, onUpdatePlayer }: PlayerTableProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  
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
  
  // Export player data to CSV
  const exportToCSV = () => {
    if (players.length === 0) return;
    
    const headers = ['Name', 'Team', 'Role', 'Status', 'Batting Avg', 'Strike Rate', 'Economy', 'Wickets', 'Catches', 'Score'];
    
    // Format the player data into rows
    const rows = playersWithScores.map(player => [
      player.name,
      player.team,
      player.role,
      player.overseas === "Yes" ? "Overseas" : "Domestic",
      player.battingAverage.toFixed(2),
      player.strikeRate.toFixed(2),
      player.bowlingEconomy ? player.bowlingEconomy.toFixed(2) : '—',
      player.wickets ? player.wickets : '—',
      player.catches,
      player.compositeScore?.toFixed(2)
    ]);
    
    // Join headers and rows into CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${players[0]?.team || 'team'}_players.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
  };
  
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    onUpdatePlayer(updatedPlayer);
    setEditingPlayer(null);
  };
  
  const handleCancelEdit = () => {
    setEditingPlayer(null);
  };
  
  // If a player is being edited, show the edit form
  if (editingPlayer) {
    return (
      <PlayerForm
        onAddPlayer={handleUpdatePlayer}
        defaultTeam={editingPlayer.team}
        initialPlayer={editingPlayer}
        onCancel={handleCancelEdit}
      />
    );
  }
  
  return (
    <motion.div 
      className="subtle-card p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Player Database ({players.length})</h2>
        
        <div className="flex items-center gap-2">
          {players.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              className="flex items-center gap-1"
            >
              <Download size={14} />
              Export
            </Button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2 md:pb-0 w-full mb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
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
          <UserRoundX size={32} className="mx-auto mb-4 opacity-40" />
          <p>No players added yet. Add your first player above.</p>
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Batting Avg</TableHead>
                <TableHead>Strike Rate</TableHead>
                <TableHead>Economy</TableHead>
                <TableHead>Wickets</TableHead>
                <TableHead>Catches</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player) => (
                <TableRow key={player.id} className="animate-fade-in">
                  <TableCell className="font-medium">{player.name}</TableCell>
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
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPlayer(player)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        <Pencil size={16} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemovePlayer(player.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
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
