import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeam, Team, TeamFormat } from "../contexts/TeamContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2, PlusCircle, Users, Calendar, Globe } from "lucide-react";
import { motion } from "framer-motion";
import TeamFormatSelector from "./TeamFormatSelector";

const TeamList = () => {
  const { teams, addTeam, deleteTeam, updateTeam, setActiveTeam } = useTeam();
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamFormat, setNewTeamFormat] = useState<TeamFormat>("league");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [showEditTeamDialog, setShowEditTeamDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a team name to continue.",
        variant: "destructive",
      });
      return;
    }
    
    const team = addTeam(newTeamName, newTeamFormat);
    setNewTeamName("");
    setNewTeamFormat("league");
    setShowNewTeamDialog(false);
    
    toast({
      title: "Team created",
      description: `"${team.name}" has been created successfully.`,
    });
  };

  const handleEditTeam = () => {
    if (!editingTeam) return;
    if (!editTeamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a team name to continue.",
        variant: "destructive",
      });
      return;
    }
    
    updateTeam(editingTeam.id, { name: editTeamName });
    setEditingTeam(null);
    setEditTeamName("");
    setShowEditTeamDialog(false);
    
    toast({
      title: "Team updated",
      description: `Team has been renamed to "${editTeamName}".`,
    });
  };

  const confirmDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setShowDeleteDialog(true);
  };

  const handleDeleteTeam = () => {
    if (!teamToDelete) return;
    
    deleteTeam(teamToDelete.id);
    setTeamToDelete(null);
    setShowDeleteDialog(false);
    
    toast({
      title: "Team deleted",
      description: `"${teamToDelete.name}" has been deleted.`,
    });
  };

  const handleSelectTeam = (team: Team) => {
    setActiveTeam(team);
    navigate(`/team/${team.id}`);
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setEditTeamName(team.name);
    setShowEditTeamDialog(true);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Teams</h2>
        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
          <DialogTrigger asChild>
            <Button className="bg-cricket-blue hover:bg-blue-700 flex items-center gap-2">
              <PlusCircle size={16} />
              New Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Enter team name" 
                  value={newTeamName} 
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateTeam();
                  }}
                />
              </div>
              <TeamFormatSelector 
                value={newTeamFormat} 
                onChange={setNewTeamFormat} 
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateTeam} className="bg-cricket-blue hover:bg-blue-700">
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <Users size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium mb-2">No teams yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first team to get started</p>
          <Button 
            onClick={() => setShowNewTeamDialog(true)}
            className="bg-cricket-blue hover:bg-blue-700"
          >
            Create a Team
          </Button>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {teams.map((team) => (
            <motion.div key={team.id} variants={item}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    {team.name}
                    {team.format === "league" ? (
                      <span className="text-xs py-1 px-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full flex items-center gap-1">
                        <Globe size={12} />
                        League
                      </span>
                    ) : (
                      <span className="text-xs py-1 px-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full flex items-center gap-1">
                        <Users size={12} />
                        Normal
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users size={14} />
                    {team.players.length} players
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar size={14} />
                    Created {formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="text-blue-600 border-blue-200 hover:border-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-950/50" 
                    onClick={() => handleSelectTeam(team)}
                  >
                    Manage
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(team)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => confirmDeleteTeam(team)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit Team Dialog */}
      <Dialog open={showEditTeamDialog} onOpenChange={setShowEditTeamDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input 
                placeholder="Enter team name" 
                value={editTeamName} 
                onChange={(e) => setEditTeamName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditTeam();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditTeam} className="bg-cricket-blue hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{teamToDelete?.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTeam}
            >
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamList;
