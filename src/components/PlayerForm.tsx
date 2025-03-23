
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player, PlayerRole, OverseasStatus } from '../types/Player';
import { useTeam } from '../contexts/TeamContext';

interface PlayerFormProps {
  onAddPlayer: (player: Player) => void;
  defaultTeam: string;
  initialPlayer?: Player;
  onCancel?: () => void;
}

const PlayerForm = ({ onAddPlayer, defaultTeam, initialPlayer, onCancel }: PlayerFormProps) => {
  const { activeTeam } = useTeam();
  const isLeagueFormat = activeTeam?.format === "league";
  
  // Create a dynamic schema based on the form values
  const createPlayerSchema = () => {
    return z.object({
      id: z.number().optional(),
      name: z.string().min(1, 'Name is required'),
      team: z.string(),
      role: z.enum(['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] as const),
      overseas: isLeagueFormat 
        ? z.enum(['Yes', 'No'] as const)
        : z.enum(['No'] as const).default('No'),
      battingAverage: z.preprocess(
        (val) => val === '' ? null : Number(val),
        z.number().min(0).nullish()
          .superRefine((val, ctx) => {
            if ((formValues?.role === 'Batsman' || formValues?.role === 'All-Rounder' || formValues?.role === 'Wicket-Keeper') && (val === null || val === undefined)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Batting average is required for this role',
              });
            }
          }),
      ),
      strikeRate: z.preprocess(
        (val) => val === '' ? null : Number(val),
        z.number().min(0).nullish()
          .superRefine((val, ctx) => {
            if ((formValues?.role === 'Batsman' || formValues?.role === 'All-Rounder' || formValues?.role === 'Wicket-Keeper') && (val === null || val === undefined)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Strike rate is required for this role',
              });
            }
          }),
      ),
      bowlingEconomy: z.preprocess(
        (val) => val === '' ? null : Number(val),
        z.number().min(0).nullish()
          .superRefine((val, ctx) => {
            if ((formValues?.role === 'Bowler' || formValues?.role === 'All-Rounder') && (val === null || val === undefined)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Bowling economy is required for this role',
              });
            }
          }),
      ),
      wickets: z.preprocess(
        (val) => val === '' ? null : Number(val),
        z.number().min(0).nullish()
          .superRefine((val, ctx) => {
            if ((formValues?.role === 'Bowler' || formValues?.role === 'All-Rounder') && (val === null || val === undefined)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Wickets are required for this role',
              });
            }
          }),
      ),
      catches: z.preprocess(
        (val) => val === '' ? null : Number(val),
        z.number().min(0, 'Catches must be a positive number')
      ),
    });
  };

  const defaultValues = initialPlayer || {
    id: Date.now(),
    name: '',
    team: defaultTeam,
    role: 'Batsman' as PlayerRole,
    overseas: isLeagueFormat ? 'No' as OverseasStatus : 'No' as OverseasStatus,
    battingAverage: null,
    strikeRate: null,
    bowlingEconomy: null,
    wickets: null,
    catches: 0,
  };

  const form = useForm<z.infer<ReturnType<typeof createPlayerSchema>>>({
    resolver: zodResolver(createPlayerSchema()),
    defaultValues,
  });

  const formValues = form.watch();

  const onSubmit = (data: z.infer<ReturnType<typeof createPlayerSchema>>) => {
    // Ensure all required fields are provided based on role
    const newPlayer: Player = {
      id: data.id || Date.now(),
      name: data.name,
      team: data.team,
      role: data.role,
      overseas: isLeagueFormat ? data.overseas : 'No',
      battingAverage: data.battingAverage || 0,
      strikeRate: data.strikeRate || 0,
      bowlingEconomy: data.bowlingEconomy,
      wickets: data.wickets,
      catches: data.catches || 0,
    };

    onAddPlayer(newPlayer);
    form.reset();
  };

  const isBattingRequired = formValues?.role === 'Batsman' || formValues?.role === 'All-Rounder' || formValues?.role === 'Wicket-Keeper';
  const isBowlingRequired = formValues?.role === 'Bowler' || formValues?.role === 'All-Rounder';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-6">
        {initialPlayer ? 'Edit Player' : 'Add Player'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Player name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Overseas Field - only show for league format */}
            {isLeagueFormat && (
              <FormField
                control={form.control}
                name="overseas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overseas Player</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Overseas status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Batting Average Field */}
            <FormField
              control={form.control}
              name="battingAverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isBattingRequired ? "font-medium" : "font-normal text-muted-foreground"}>
                    Batting Average{isBattingRequired ? "*" : " (Optional)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={isBattingRequired ? "Required" : "Optional"}
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Strike Rate Field */}
            <FormField
              control={form.control}
              name="strikeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isBattingRequired ? "font-medium" : "font-normal text-muted-foreground"}>
                    Strike Rate{isBattingRequired ? "*" : " (Optional)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={isBattingRequired ? "Required" : "Optional"}
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bowling Economy Field */}
            <FormField
              control={form.control}
              name="bowlingEconomy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isBowlingRequired ? "font-medium" : "font-normal text-muted-foreground"}>
                    Bowling Economy{isBowlingRequired ? "*" : " (Optional)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={isBowlingRequired ? "Required" : "Optional"}
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Wickets Field */}
            <FormField
              control={form.control}
              name="wickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isBowlingRequired ? "font-medium" : "font-normal text-muted-foreground"}>
                    Wickets{isBowlingRequired ? "*" : " (Optional)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={isBowlingRequired ? "Required" : "Optional"}
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Catches Field */}
            <FormField
              control={form.control}
              name="catches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catches</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of catches"
                      {...field}
                      value={field.value === null ? '0' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="bg-cricket-blue hover:bg-blue-700">
              {initialPlayer ? 'Update Player' : 'Add Player'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlayerForm;
