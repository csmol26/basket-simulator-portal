
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { predefinedThemes } from "../StyleVarsEditor";

interface ThemeSelectorProps {
  activeTheme: string;
  onChangeTheme: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ activeTheme, onChangeTheme }) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="theme-select" className="mb-2 block">
          Select Theme
        </Label>
        <Select 
          value={activeTheme} 
          onValueChange={onChangeTheme}
        >
          <SelectTrigger id="theme-select">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {predefinedThemes.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {predefinedThemes.slice(0, 6).map((theme) => (
          <Card 
            key={theme.id}
            className={`cursor-pointer transition-all hover:shadow-md ${activeTheme === theme.id ? 'ring-2 ring-primary' : 'border-gray-200'}`}
            onClick={() => onChangeTheme(theme.id)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <RadioGroup value={activeTheme} className="flex">
                <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} checked={activeTheme === theme.id} />
              </RadioGroup>
              <Label htmlFor={`theme-${theme.id}`} className="cursor-pointer">
                {theme.name}
              </Label>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
