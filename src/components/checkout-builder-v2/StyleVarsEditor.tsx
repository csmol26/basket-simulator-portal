
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Style variables with default values
export const initialStyleVariables = {
  primerColorBrand: "#18A94B",
  primerTypographyBrand: "'Poppins', sans-serif",
  primerColorBackground: "transparent",
  primerRadiusBase: "16px",
  primerSpaceBase: "4px",
  primerSizeBase: "4px",
  primerColorLoader: "",
  primerColorFocus: "#DE00D1",
  primerSpaceSmall: "8px", // Adding this variable for component spacing
};

export const variableDescriptions = {
  primerColorBrand: "Controls the brand color across the checkout",
  primerTypographyBrand: "Controls the brand font family across the checkout",
  primerColorBackground: "Controls the background color across the checkout",
  primerRadiusBase: "Controls the base radius unit across the checkout",
  primerSpaceBase: "Controls the base spacing unit across the checkout",
  primerSizeBase: "Controls the base size unit across the checkout",
  primerColorLoader: "Controls the loader color across the checkout (leave empty to use brand color)",
  primerColorFocus: "Controls the interactive focus color across the checkout",
  primerSpaceSmall: "Controls the small spacing value between elements",
};

export const jsonToCssVariable = {
  primerColorBrand: "--primer-color-brand",
  primerTypographyBrand: "--primer-typography-brand",
  primerColorBackground: "--primer-color-background",
  primerRadiusBase: "--primer-radius-base",
  primerSpaceBase: "--primer-space-base",
  primerSizeBase: "--primer-size-base",
  primerColorLoader: "--primer-color-loader",
  primerColorFocus: "--primer-color-focus",
  primerSpaceSmall: "--primer-space-small",
};

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

interface StyleVarsEditorProps {
  styleVariables: typeof initialStyleVariables;
  handleStyleChange: (variableName: string, value: string) => void;
}

const StyleVarsEditor: React.FC<StyleVarsEditorProps> = ({ styleVariables, handleStyleChange }) => {
  // Convert pixel values to numbers for sliders
  const getSizeValue = (value: string): number => {
    const numValue = parseInt(value);
    return isNaN(numValue) ? 0 : Math.min(20, Math.max(0, numValue));
  };

  // Handle slider changes
  const handleSliderChange = (variableName: string, value: number[]) => {
    handleStyleChange(variableName, `${value[0]}px`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Style Variables</h2>
      
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            {['primerColorBrand', 'primerColorBackground', 'primerColorLoader', 'primerColorFocus'].map((key) => (
              <div key={key} className="space-y-2 mb-4">
                <Label htmlFor={key} className="text-sm flex justify-between">
                  <span>{jsonToCssVariable[key as keyof typeof jsonToCssVariable]}</span>
                  <input 
                    type="color" 
                    value={styleVariables[key as keyof typeof styleVariables] || '#000000'} 
                    onChange={(e) => handleStyleChange(key, e.target.value)}
                    className="w-8 h-8 p-0 border-0"
                  />
                </Label>
                <Input 
                  id={key}
                  value={styleVariables[key as keyof typeof styleVariables]}
                  onChange={(e) => handleStyleChange(key, e.target.value)}
                  placeholder={`Enter ${key}`}
                />
                <p className="text-xs text-gray-500">{variableDescriptions[key as keyof typeof variableDescriptions]}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="typography">
          <AccordionTrigger>Typography</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mb-4">
              <Label htmlFor="primerTypographyBrand" className="text-sm">
                {jsonToCssVariable.primerTypographyBrand}
              </Label>
              <Select 
                value={styleVariables.primerTypographyBrand} 
                onValueChange={(value) => handleStyleChange('primerTypographyBrand', value)}
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
              <p className="text-xs text-gray-500">{variableDescriptions.primerTypographyBrand}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger>Spacing & Sizing</AccordionTrigger>
          <AccordionContent>
            {['primerRadiusBase', 'primerSpaceBase', 'primerSizeBase', 'primerSpaceSmall'].map((key) => (
              <div key={key} className="space-y-2 mb-4">
                <Label htmlFor={key} className="text-sm">
                  {jsonToCssVariable[key as keyof typeof jsonToCssVariable]}
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
                      onChange={(e) => handleStyleChange(key, e.target.value)}
                      className="text-center p-1 h-8"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">{variableDescriptions[key as keyof typeof variableDescriptions]}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="p-4 bg-gray-50 rounded-md mt-4">
        <h3 className="font-medium mb-2">Preview</h3>
        <div 
          className="p-4 rounded-md border" 
          style={{ 
            backgroundColor: styleVariables.primerColorBackground || 'white',
            fontFamily: styleVariables.primerTypographyBrand,
            borderRadius: styleVariables.primerRadiusBase,
            border: '1px solid #e5e7eb'
          }}
        >
          <div className="mb-4" style={{ color: styleVariables.primerColorBrand }}>
            Sample Text in Brand Color
          </div>
          <button 
            className="px-4 py-2 text-white rounded-md"
            style={{ 
              backgroundColor: styleVariables.primerColorBrand,
              borderRadius: styleVariables.primerRadiusBase
            }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleVarsEditor;
