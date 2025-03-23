
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Player } from "../types/Player";
import { optimizeLineup } from "../utils/optimization";
import Header from "../components/Header";
import PlayerForm from "../components/PlayerForm";
import PlayerTable from "../components/PlayerTable";
import OptimizedTeam from "../components/OptimizedTeam";
import Footer from "../components/Footer";
import { useTeam } from "../contexts/TeamContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Wand2, RefreshCw, ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const TeamManagement = () => {
  const { teamId } = useParams();
  const { teams, activeTeam, setActiveTeam, addPlayerToTeam, removePlayerFromTeam, updatePlayerInTeam } = useTeam();
  const [optimizedTeam, setOptimizedTeam] = useState<{ selectedPlayers: Player[]; totalScore: number, teamName: string }>({
    selectedPlayers: [],
    totalScore: 0,
    teamName: ""
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Set the active team based on the URL parameter
  useEffect(() => {
    if (teamId) {
      const team = teams.find(t => t.id === teamId);
      if (team) {
        setActiveTeam(team);
      } else {
        // Team not found, redirect to home
        toast({
          title: "Team not found",
          description: "The requested team could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [teamId, teams, setActiveTeam, navigate, toast]);
  
  // Add a player to the squad
  const handleAddPlayer = (player: Player) => {
    if (!activeTeam) return;
    
    addPlayerToTeam(activeTeam.id, {
      ...player,
      team: activeTeam.name,
      id: player.id || Date.now() // Ensure unique ID
    });
    
    toast({
      title: "Player added",
      description: `${player.name} has been added to ${activeTeam.name}.`,
    });
  };
  
  // Update a player in the squad
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    if (!activeTeam) return;
    
    updatePlayerInTeam(activeTeam.id, updatedPlayer);
    
    toast({
      title: "Player updated",
      description: `${updatedPlayer.name} has been updated.`,
    });
    
    // Also update in optimized team if present
    if (optimizedTeam.selectedPlayers.some(p => p.id === updatedPlayer.id)) {
      setOptimizedTeam(prev => ({
        ...prev,
        selectedPlayers: prev.selectedPlayers.map(p => 
          p.id === updatedPlayer.id ? updatedPlayer : p
        )
      }));
    }
  };
  
  // Remove a player from the squad
  const handleRemovePlayer = (id: number) => {
    if (!activeTeam) return;
    
    removePlayerFromTeam(activeTeam.id, id);
    
    // Also remove from optimized team if present
    if (optimizedTeam.selectedPlayers.some(p => p.id === id)) {
      setOptimizedTeam(prev => ({
        ...prev,
        selectedPlayers: prev.selectedPlayers.filter(p => p.id !== id)
      }));
    }
    
    toast({
      title: "Player removed",
      description: "Player has been removed from your squad.",
    });
  };
  
  // Optimize the lineup
  const handleOptimizeLineup = () => {
    if (!activeTeam) return;
    
    if (activeTeam.players.length < 11) {
      toast({
        title: "Not enough players",
        description: `You need at least 11 players in your squad. Currently you have ${activeTeam.players.length}.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizing(true);
    
    // Simulate optimization delay for better UX
    setTimeout(() => {
      const result = optimizeLineup(activeTeam.players);
      setOptimizedTeam(result);
      setIsOptimizing(false);
      
      toast({
        title: "Optimization complete!",
        description: `Generated the best possible XI for ${result.teamName} with a total score of ${result.totalScore.toFixed(2)}.`,
      });
    }, 800);
  };
  
  if (!activeTeam) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 mb-8">
          <div className="max-w-md mx-auto text-center py-12">
            <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
            <h2 className="text-2xl font-semibold mb-4">No Team Selected</h2>
            <p className="mb-6 text-slate-600 dark:text-slate-400">Please select a team from the home page to manage players.</p>
            <Link to="/">
              <Button className="bg-cricket-blue hover:bg-blue-700">
                Go to Home
              </Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 mb-8">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Teams
          </Button>
          
          <h1 className="text-xl font-semibold">{activeTeam.name}</h1>
          
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center gap-1">
            <Home size={14} />
            Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PlayerForm onAddPlayer={handleAddPlayer} defaultTeam={activeTeam.name} />
            
            <AnimatePresence>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={handleOptimizeLineup}
                    disabled={isOptimizing || activeTeam.players.length < 11}
                    className="bg-cricket-blue hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Optimize Lineup
                      </>
                    )}
                  </Button>
                </div>
                
                <PlayerTable 
                  players={activeTeam.players} 
                  onRemovePlayer={handleRemovePlayer} 
                  onUpdatePlayer={handleUpdatePlayer}
                />
              </div>
            </AnimatePresence>
          </div>
          
          <div>
            <OptimizedTeam 
              selectedPlayers={optimizedTeam.selectedPlayers}
              totalScore={optimizedTeam.totalScore}
              teamName={optimizedTeam.teamName}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamManagement;
