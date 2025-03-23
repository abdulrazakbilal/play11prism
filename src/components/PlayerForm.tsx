
import { useState, useEffect } from "react";
import { Player, PlayerRole, OverseasStatus } from "../types/Player";
import { useForm } from "react-hook-form";
import { generateRandomId } from "../utils/playerUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface PlayerFormProps {
  onAddPlayer: (player: Player) => void;
  defaultTeam: string;
  playerToEdit?: Player | null;
  onCancelEdit?: () => void;
}

// Dynamic schema creation function based on role
const createFormSchema = (role: PlayerRole) => {
  const isBowler = role === "Bowler";
  
  return z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    role: z.enum(["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"] as const),
    overseas: z.enum(["Yes", "No"] as const),
    battingAverage: isBowler 
      ? z.number().nullable().optional()
      : z.number().min(0, { message: "Must be 0 or greater" }),
    strikeRate: isBowler
      ? z.number().nullable().optional()
      : z.number().min(0, { message: "Must be 0 or greater" }),
    bowlingEconomy: z.number().min(0, { message: "Must be 0 or greater" }).nullable(),
    wickets: z.number().min(0, { message: "Must be 0 or greater" }).nullable(),
    catches: z.number().min(0, { message: "Must be 0 or greater" }),
  });
};

const PlayerForm = ({ onAddPlayer, defaultTeam, playerToEdit, onCancelEdit }: PlayerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<PlayerRole>(playerToEdit?.role || "Batsman");
  
  const form = useForm<z.infer<typeof z.object({})>>({
    resolver: zodResolver(createFormSchema(selectedRole)),
    defaultValues: {
      name: playerToEdit?.name || "",
      role: playerToEdit?.role || "Batsman",
      overseas: playerToEdit?.overseas || "No",
      battingAverage: playerToEdit?.battingAverage !== null ? playerToEdit?.battingAverage : 0,
      strikeRate: playerToEdit?.strikeRate !== null ? playerToEdit?.strikeRate : 0,
      bowlingEconomy: playerToEdit?.bowlingEconomy,
      wickets: playerToEdit?.wickets,
      catches: playerToEdit?.catches || 0,
    },
  });

  // Update form validation schema when role changes
  useEffect(() => {
    form.trigger(); // Re-validate with new schema
  }, [selectedRole, form]);

  // Watch for role changes
  const role = form.watch("role");
  useEffect(() => {
    setSelectedRole(role as PlayerRole);
  }, [role]);

  const showBowlingFields = role === "Bowler" || role === "All-Rounder";
  const isBowler = role === "Bowler";

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // For bowlers, set batting stats to defaults if they're empty
    if (isBowler) {
      if (data.battingAverage === undefined || data.battingAverage === null) {
        data.battingAverage = 0;
      }
      if (data.strikeRate === undefined || data.strikeRate === null) {
        data.strikeRate = 0;
      }
    }
    
    // Create player object with all required fields
    const playerData: Player = {
      id: playerToEdit?.id || generateRandomId(),
      name: data.name,
      team: defaultTeam,
      role: data.role,
      overseas: data.overseas,
      battingAverage: data.battingAverage,
      strikeRate: data.strikeRate,
      bowlingEconomy: data.bowlingEconomy,
      wickets: data.wickets,
      catches: data.catches
    };
    
    onAddPlayer(playerData);
    
    // Reset form if not editing
    if (!playerToEdit) {
      form.reset({
        name: "",
        role: "Batsman",
        overseas: "No",
        battingAverage: 0,
        strikeRate: 0,
        bowlingEconomy: null,
        wickets: null,
        catches: 0,
      });
    } else if (onCancelEdit) {
      onCancelEdit();
    }
    
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      className="subtle-card p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6">
        {playerToEdit ? `Edit ${playerToEdit.name}` : `Add Player to ${defaultTeam}`}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Virat Kohli" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedRole(value as PlayerRole);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Batsman">Batsman</SelectItem>
                        <SelectItem value="Bowler">Bowler</SelectItem>
                        <SelectItem value="All-Rounder">All-Rounder</SelectItem>
                        <SelectItem value="Wicket-Keeper">Wicket-Keeper</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="overseas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overseas Player</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Is overseas?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="battingAverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Batting Average
                    {isBowler && <span className="text-xs text-slate-500 ml-1">(Optional)</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="strikeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Strike Rate
                    {isBowler && <span className="text-xs text-slate-500 ml-1">(Optional)</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="catches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catches</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {showBowlingFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bowlingEconomy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bowling Economy</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wickets</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="bg-cricket-blue hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {playerToEdit ? "Update Player" : "Add Player"}
            </Button>
            
            {playerToEdit && onCancelEdit && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default PlayerForm;
