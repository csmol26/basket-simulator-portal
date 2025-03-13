
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StyleVariables, Row, CheckoutConfig } from "./types";
import { predefinedThemes } from "./StyleVarsEditor";
import DevicePreview from "./previews/DevicePreview";
import ThemeSelector from "./theme/ThemeSelector";
import StyleControls from "./theme/StyleControls";
import ThemePreview from "./theme/ThemePreview";

interface ThemeAndPreviewProps {
  rows: Row[];
  cardFormRows: Row[];
  styleVariables: StyleVariables;
  checkoutConfig: CheckoutConfig;
  activeTheme: string;
  onStyleChange: (variableName: string, value: string) => void;
  onChangeTheme: (themeId: string) => void;
}

const ThemeAndPreview: React.FC<ThemeAndPreviewProps> = ({
  rows,
  cardFormRows,
  styleVariables,
  checkoutConfig,
  activeTheme,
  onStyleChange,
  onChangeTheme
}) => {
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side: Checkout Preview */}
      <div>
        <Card>
          <DevicePreview 
            rows={rows}
            cardFormRows={cardFormRows}
            styleVariables={styleVariables}
            checkoutConfig={checkoutConfig}
            devicePreview={devicePreview}
            setDevicePreview={setDevicePreview}
          />
        </Card>
      </div>
      
      {/* Right side: Theme Selector */}
      <div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <h2 className="text-lg font-bold">Theme Customization</h2>
              <p className="text-sm text-gray-500">
                Customize the appearance of your checkout
              </p>
              
              {/* Theme Selector */}
              <ThemeSelector 
                activeTheme={activeTheme} 
                onChangeTheme={onChangeTheme} 
              />
              
              {/* Style Controls */}
              <StyleControls 
                styleVariables={styleVariables} 
                onStyleChange={onStyleChange} 
              />
              
              {/* Theme Preview */}
              <ThemePreview styleVariables={styleVariables} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeAndPreview;
