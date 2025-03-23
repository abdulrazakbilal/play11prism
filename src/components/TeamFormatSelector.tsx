
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TeamFormat } from "../contexts/TeamContext";
import { Globe, Users } from "lucide-react";

interface TeamFormatSelectorProps {
  value: TeamFormat;
  onChange: (value: TeamFormat) => void;
}

const TeamFormatSelector: React.FC<TeamFormatSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <Label>Team Format</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as TeamFormat)}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex flex-col items-center space-y-2 rounded-md border-2 border-muted p-4 hover:border-accent cursor-pointer transition-all duration-200 aria-checked:border-primary aria-checked:bg-primary/5" 
             data-state={value === "league" ? "checked" : "unchecked"}
             onClick={() => onChange("league")}>
          <RadioGroupItem value="league" id="league" className="sr-only" />
          <Globe className="h-6 w-6 text-primary" />
          <div className="space-y-1 text-center">
            <Label htmlFor="league" className="font-medium">League</Label>
            <p className="text-xs text-muted-foreground">IPL-style with overseas players</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-2 rounded-md border-2 border-muted p-4 hover:border-accent cursor-pointer transition-all duration-200 aria-checked:border-primary aria-checked:bg-primary/5"
             data-state={value === "normal" ? "checked" : "unchecked"}
             onClick={() => onChange("normal")}>
          <RadioGroupItem value="normal" id="normal" className="sr-only" />
          <Users className="h-6 w-6 text-primary" />
          <div className="space-y-1 text-center">
            <Label htmlFor="normal" className="font-medium">Normal</Label>
            <p className="text-xs text-muted-foreground">Standard format without overseas restrictions</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TeamFormatSelector;
