
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StyleVariables } from "../types";

// Font options for the dropdown
const fontOptions = [
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Raleway', sans-serif", label: "Raleway" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Source Sans Pro', sans-serif", label: "Source Sans Pro" },
  { value: "'Lato', sans-serif", label: "Lato" },
  { value: "'Nunito', sans-serif", label: "Nunito" },
  { value: "'Quicksand', sans-serif", label: "Quicksand" },
  { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Rubik', sans-serif", label: "Rubik" },
  { value: "'Work Sans', sans-serif", label: "Work Sans" },
];

interface StyleControlsProps {
  styleVariables: StyleVariables;
  onStyleChange: (variableName: string, value: string) => void;
}

const StyleControls: React.FC<StyleControlsProps> = ({ styleVariables, onStyleChange }) => {
  // Convert pixel values to numbers for sliders
  const getSizeValue = (value: string): number => {
    const numValue = parseInt(value);
    return isNaN(numValue) ? 0 : Math.min(20, Math.max(0, numValue));
  };

  // Handle slider changes
  const handleSliderChange = (variableName: string, value: number[]) => {
    onStyleChange(variableName, `${value[0]}px`);
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            {['primerColorBrand', 'primerColorBackground', 'primerColorLoader', 'primerColorFocus', 'primerColorTextPrimary', 'primerColorBorder'].map((key) => (
              <div key={key} className="space-y-2 mb-4">
                <Label htmlFor={key} className="text-sm flex justify-between">
                  <span>
                    {key === 'primerColorBrand' ? 'Brand Color' : 
                     key === 'primerColorBackground' ? 'Background Color' :
                     key === 'primerColorLoader' ? 'Loader Color' : 
                     key === 'primerColorFocus' ? 'Focus Color' :
                     key === 'primerColorTextPrimary' ? 'Text Color' :
                     'Border Color'}
                  </span>
                  <input 
                    type="color" 
                    value={styleVariables[key as keyof typeof styleVariables] || '#000000'} 
                    onChange={(e) => onStyleChange(key, e.target.value)}
                    className="w-8 h-8 p-0 border-0"
                  />
                </Label>
                <Input 
                  id={key}
                  value={styleVariables[key as keyof typeof styleVariables] || ''}
                  onChange={(e) => onStyleChange(key, e.target.value)}
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="typography">
          <AccordionTrigger>Typography</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mb-4">
              <Label htmlFor="primerTypographyBrand" className="text-sm">
                Font Family
              </Label>
              <Select 
                value={styleVariables.primerTypographyBrand} 
                onValueChange={(value) => onStyleChange('primerTypographyBrand', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger>Spacing & Sizing</AccordionTrigger>
          <AccordionContent>
            {['primerRadiusBase', 'primerSpaceBase', 'primerSizeBase', 'primerSpaceSmall'].map((key) => (
              <div key={key} className="space-y-2 mb-4">
                <Label htmlFor={key} className="text-sm">
                  {key === 'primerRadiusBase' ? 'Border Radius' : 
                   key === 'primerSpaceBase' ? 'Base Spacing' :
                   key === 'primerSizeBase' ? 'Base Size' : 'Small Spacing'}
                </Label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Slider
                      id={key}
                      min={0}
                      max={20}
                      step={1}
                      value={[getSizeValue(styleVariables[key as keyof typeof styleVariables])]}
                      onValueChange={(value) => handleSliderChange(key, value)}
                    />
                  </div>
                  <div className="w-12 text-center">
                    <Input
                      value={styleVariables[key as keyof typeof styleVariables]}
                      onChange={(e) => onStyleChange(key, e.target.value)}
                      className="text-center p-1 h-8"
                    />
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StyleControls;
