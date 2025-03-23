
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player } from '../types/Player';

export interface Team {
  id: string;
  name: string;
  players: Player[];
  createdAt: Date;
}

interface TeamContextType {
  teams: Team[];
  activeTeam: Team | null;
  setActiveTeam: (team: Team | null) => void;
  addTeam: (name: string) => Team;
  updateTeam: (teamId: string, updatedTeam: Partial<Team>) => void;
  deleteTeam: (teamId: string) => void;
  addPlayerToTeam: (teamId: string, player: Player) => void;
  updatePlayerInTeam: (teamId: string, updatedPlayer: Player) => void;
  removePlayerFromTeam: (teamId: string, playerId: number) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  // Load teams from localStorage on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        // Convert string dates back to Date objects
        const teamsWithProperDates = parsedTeams.map((team: any) => ({
          ...team,
          createdAt: new Date(team.createdAt)
        }));
        setTeams(teamsWithProperDates);
      } catch (error) {
        console.error('Error parsing teams from localStorage:', error);
      }
    }
  }, []);

  // Save teams to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  const addTeam = (name: string): Team => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      players: [],
      createdAt: new Date()
    };
    
    setTeams(prevTeams => [...prevTeams, newTeam]);
    return newTeam;
  };

  const updateTeam = (teamId: string, updatedTeam: Partial<Team>) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId ? { ...team, ...updatedTeam } : team
      )
    );
    
    // Also update activeTeam if it's the team being modified
    if (activeTeam?.id === teamId) {
      setActiveTeam(prev => prev ? { ...prev, ...updatedTeam } : null);
    }
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
    
    // Clear activeTeam if it's the deleted team
    if (activeTeam?.id === teamId) {
      setActiveTeam(null);
    }
  };

  const addPlayerToTeam = (teamId: string, player: Player) => {
    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            players: [...team.players, { ...player, team: team.name }]
          };
        }
        return team;
      })
    );
    
    // Also update activeTeam if it's the team being modified
    if (activeTeam?.id === teamId) {
      setActiveTeam(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: [...prev.players, { ...player, team: prev.name }]
        };
      });
    }
  };

  const updatePlayerInTeam = (teamId: string, updatedPlayer: Player) => {
    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            players: team.players.map(player => 
              player.id === updatedPlayer.id ? { ...updatedPlayer, team: team.name } : player
            )
          };
        }
        return team;
      })
    );
    
    // Also update activeTeam if it's the team being modified
    if (activeTeam?.id === teamId) {
      setActiveTeam(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.map(player => 
            player.id === updatedPlayer.id ? { ...updatedPlayer, team: prev.name } : player
          )
        };
      });
    }
  };

  const removePlayerFromTeam = (teamId: string, playerId: number) => {
    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            players: team.players.filter(player => player.id !== playerId)
          };
        }
        return team;
      })
    );
    
    // Also update activeTeam if it's the team being modified
    if (activeTeam?.id === teamId) {
      setActiveTeam(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.filter(player => player.id !== playerId)
        };
      });
    }
  };

  return (
    <TeamContext.Provider value={{
      teams,
      activeTeam,
      setActiveTeam,
      addTeam,
      updateTeam,
      deleteTeam,
      addPlayerToTeam,
      updatePlayerInTeam,
      removePlayerFromTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
