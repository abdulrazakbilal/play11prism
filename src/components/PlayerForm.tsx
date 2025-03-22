import { useState } from "react";
import { Player, PlayerRole, OverseasStatus } from "../types/Player";
import { generateRandomId } from "../utils/playerUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface PlayerFormProps {
  onAddPlayer: (player: Player) => void;
  defaultTeam?: string;
}

const PlayerForm = ({ onAddPlayer, defaultTeam = "" }: PlayerFormProps) => {
  const [name, setName] = useState("");
  const [team] = useState(defaultTeam);
  const [role, setRole] = useState<PlayerRole>("Batsman");
  const [overseas, setOverseas] = useState<OverseasStatus>("No");
  const [battingAverage, setBattingAverage] = useState("");
  const [strikeRate, setStrikeRate] = useState("");
  const [bowlingEconomy, setBowlingEconomy] = useState("");
  const [wickets, setWickets] = useState("");
  const [catches, setCatches] = useState("");
  
  const resetForm = () => {
    setName("");
    // Keep the team name as it's now managed by the parent component
    setRole("Batsman");
    setOverseas("No");
    setBattingAverage("");
    setStrikeRate("");
    setBowlingEconomy("");
    setWickets("");
    setCatches("");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name) {
      toast({
        title: "Missing information",
        description: "Please enter player name",
        variant: "destructive",
      });
      return;
    }
    
    if (!battingAverage || !strikeRate || !catches) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if ((role === "Bowler" || role === "All-Rounder") && (!bowlingEconomy || !wickets)) {
      toast({
        title: "Missing information",
        description: "Bowlers and All-Rounders require bowling economy and wickets",
        variant: "destructive",
      });
      return;
    }
    
    // Create player object
    const newPlayer: Player = {
      id: generateRandomId(),
      name,
      team, // Use the team from props
      role,
      overseas,
      battingAverage: parseFloat(battingAverage),
      strikeRate: parseFloat(strikeRate),
      bowlingEconomy: role === "Batsman" || role === "Wicket-Keeper" ? null : parseFloat(bowlingEconomy),
      wickets: role === "Batsman" || role === "Wicket-Keeper" ? null : parseFloat(wickets),
      catches: parseFloat(catches),
    };
    
    // Add player
    onAddPlayer(newPlayer);
    
    // Show success toast
    toast({
      title: "Player added",
      description: `${name} has been added to ${team}`,
    });
    
    // Reset form
    resetForm();
  };
  
  return (
    <motion.div 
      className="form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <span className="bg-primary/10 p-1.5 rounded-full">
          <Plus size={18} className="text-primary" />
        </span>
        Add Player
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team name is now hidden since it's passed from parent */}
          <input type="hidden" value={team} />
          
          {/* Player Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Virat Kohli"
              className="w-full"
            />
          </div>
          
          {/* Player Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as PlayerRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select player role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Batsman">Batsman</SelectItem>
                <SelectItem value="Bowler">Bowler</SelectItem>
                <SelectItem value="All-Rounder">All-Rounder</SelectItem>
                <SelectItem value="Wicket-Keeper">Wicket-Keeper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Overseas Status */}
          <div className="space-y-2">
            <Label htmlFor="overseas">Overseas Player?</Label>
            <Select value={overseas} onValueChange={(value) => setOverseas(value as OverseasStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Overseas status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Batting Average */}
          <div className="space-y-2">
            <Label htmlFor="battingAverage">Batting Average</Label>
            <Input
              id="battingAverage"
              type="number"
              step="0.01"
              value={battingAverage}
              onChange={(e) => setBattingAverage(e.target.value)}
              placeholder="e.g. 32.5"
              className="w-full"
            />
          </div>
          
          {/* Strike Rate */}
          <div className="space-y-2">
            <Label htmlFor="strikeRate">Strike Rate</Label>
            <Input
              id="strikeRate"
              type="number"
              step="0.01"
              value={strikeRate}
              onChange={(e) => setStrikeRate(e.target.value)}
              placeholder="e.g. 138.6"
              className="w-full"
            />
          </div>
          
          {/* Bowling Economy */}
          <div className="space-y-2">
            <Label htmlFor="bowlingEconomy" className="flex justify-between">
              <span>Bowling Economy</span>
              {(role === "Batsman" || role === "Wicket-Keeper") && (
                <span className="text-xs text-slate-500">(Optional for {role})</span>
              )}
            </Label>
            <Input
              id="bowlingEconomy"
              type="number"
              step="0.01"
              value={bowlingEconomy}
              onChange={(e) => setBowlingEconomy(e.target.value)}
              placeholder={role === "Batsman" || role === "Wicket-Keeper" ? "N/A for this role" : "e.g. 7.2"}
              className="w-full"
              disabled={role === "Batsman" || role === "Wicket-Keeper"}
            />
          </div>
          
          {/* Wickets */}
          <div className="space-y-2">
            <Label htmlFor="wickets" className="flex justify-between">
              <span>Wickets</span>
              {(role === "Batsman" || role === "Wicket-Keeper") && (
                <span className="text-xs text-slate-500">(Optional for {role})</span>
              )}
            </Label>
            <Input
              id="wickets"
              type="number"
              value={wickets}
              onChange={(e) => setWickets(e.target.value)}
              placeholder={role === "Batsman" || role === "Wicket-Keeper" ? "N/A for this role" : "e.g. 45"}
              className="w-full"
              disabled={role === "Batsman" || role === "Wicket-Keeper"}
            />
          </div>
          
          {/* Catches */}
          <div className="space-y-2">
            <Label htmlFor="catches">Catches</Label>
            <Input
              id="catches"
              type="number"
              value={catches}
              onChange={(e) => setCatches(e.target.value)}
              placeholder="e.g. 28"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-cricket-blue hover:bg-blue-700 text-white">
            Add Player
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PlayerForm;
