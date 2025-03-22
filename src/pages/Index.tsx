
import { useState, useEffect } from "react";
import { Player } from "../types/Player";
import { optimizeLineup } from "../utils/optimization";
import { samplePlayers } from "../utils/playerUtils";
import Header from "../components/Header";
import PlayerForm from "../components/PlayerForm";
import PlayerTable from "../components/PlayerTable";
import OptimizedTeam from "../components/OptimizedTeam";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Wand2, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add the framer-motion package
import { AnimatePresence } from "framer-motion";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [optimizedTeam, setOptimizedTeam] = useState<{ selectedPlayers: Player[]; totalScore: number }>({
    selectedPlayers: [],
    totalScore: 0
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  
  // Add a player to the squad
  const handleAddPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player]);
  };
  
  // Remove a player from the squad
  const handleRemovePlayer = (id: number) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
    // Also remove from optimized team if present
    if (optimizedTeam.selectedPlayers.some(p => p.id === id)) {
      setOptimizedTeam(prev => ({
        ...prev,
        selectedPlayers: prev.selectedPlayers.filter(p => p.id !== id)
      }));
    }
  };
  
  // Optimize the lineup
  const handleOptimizeLineup = () => {
    if (players.length < 11) {
      toast({
        title: "Not enough players",
        description: `You need at least 11 players in your squad. Currently you have ${players.length}.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizing(true);
    
    // Simulate optimization delay for better UX
    setTimeout(() => {
      const result = optimizeLineup(players);
      setOptimizedTeam(result);
      setIsOptimizing(false);
      
      toast({
        title: "Optimization complete!",
        description: `Generated the best possible XI with a total score of ${result.totalScore.toFixed(2)}.`,
      });
    }, 800);
  };
  
  // Clear all players
  const handleClearPlayers = () => {
    if (players.length === 0) return;
    
    setPlayers([]);
    setOptimizedTeam({
      selectedPlayers: [],
      totalScore: 0
    });
    
    toast({
      title: "Squad cleared",
      description: "All players have been removed from your squad.",
    });
  };
  
  // Load sample data
  const handleLoadSample = () => {
    setPlayers(samplePlayers);
    
    toast({
      title: "Sample data loaded",
      description: "Added 5 sample players to your squad.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PlayerForm onAddPlayer={handleAddPlayer} />
            
            <AnimatePresence>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleOptimizeLineup}
                      disabled={isOptimizing || players.length < 11}
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
                    
                    {players.length === 0 && (
                      <Button 
                        variant="outline" 
                        onClick={handleLoadSample}
                        className="ml-2"
                      >
                        Load Sample Data
                      </Button>
                    )}
                  </div>
                  
                  {players.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={handleClearPlayers}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                <PlayerTable 
                  players={players} 
                  onRemovePlayer={handleRemovePlayer} 
                />
              </div>
            </AnimatePresence>
          </div>
          
          <div>
            <OptimizedTeam 
              selectedPlayers={optimizedTeam.selectedPlayers}
              totalScore={optimizedTeam.totalScore} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
