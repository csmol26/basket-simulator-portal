
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StyleVariables, Row, CheckoutConfig } from "./types";
import { initialStyleVariables, predefinedThemes } from "./StyleVarsEditor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  // Convert pixel values to numbers for sliders
  const getSizeValue = (value: string): number => {
    const numValue = parseInt(value);
    return isNaN(numValue) ? 0 : Math.min(20, Math.max(0, numValue));
  };

  // Handle slider changes
  const handleSliderChange = (variableName: string, value: number[]) => {
    onStyleChange(variableName, `${value[0]}px`);
  };

  // Generate card form preview
  const renderCardFormPreview = () => {
    if (cardFormRows.length === 0 || cardFormRows.every(row => row.components.length === 0)) {
      return (
        <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-center">
          No card form components added
        </div>
      );
    }

    return (
      <div className="space-y-4" style={{ fontFamily: styleVariables.primerTypographyBrand }}>
        {cardFormRows.map((row, rowIndex) => {
          if (row.components.length === 0) return null;

          if (row.components.length === 1) {
            const component = row.components[0];
            return (
              <div key={`card-row-${rowIndex}`} className="mb-4">
                {component.originalComponent.id === 'card-number' && (
                  <div className="mb-2">
                    <label className="block text-sm mb-1">{component.config?.label || "Card Number"}</label>
                    <div
                      className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                      style={{ borderRadius: styleVariables.primerRadiusBase }}
                    >
                      <span className="text-gray-400">{component.config?.placeholder || "•••• •••• •••• ••••"}</span>
                    </div>
                  </div>
                )}
                
                {component.originalComponent.id === 'card-expiry' && (
                  <div className="mb-2">
                    <label className="block text-sm mb-1">{component.config?.label || "Expiry Date"}</label>
                    <div 
                      className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                      style={{ borderRadius: styleVariables.primerRadiusBase }}
                    >
                      <span className="text-gray-400">{component.config?.placeholder || "MM/YY"}</span>
                    </div>
                  </div>
                )}
                
                {component.originalComponent.id === 'card-cvv' && (
                  <div className="mb-2">
                    <label className="block text-sm mb-1">{component.config?.label || "CVV"}</label>
                    <div 
                      className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                      style={{ borderRadius: styleVariables.primerRadiusBase }}
                    >
                      <span className="text-gray-400">{component.config?.placeholder || "123"}</span>
                    </div>
                  </div>
                )}
                
                {component.originalComponent.id === 'card-holder' && (
                  <div className="mb-2">
                    <label className="block text-sm mb-1">{component.config?.label || "Cardholder Name"}</label>
                    <div 
                      className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                      style={{ borderRadius: styleVariables.primerRadiusBase }}
                    >
                      <span className="text-gray-400">{component.config?.placeholder || "Name on card"}</span>
                    </div>
                  </div>
                )}
                
                {component.originalComponent.id === 'card-submit' && (
                  <button 
                    className="hover:opacity-90 text-white rounded-md p-2 h-10 w-full font-medium transition-colors"
                    style={{ 
                      backgroundColor: styleVariables.primerColorBrand,
                      borderRadius: styleVariables.primerRadiusBase
                    }}
                  >
                    {component.config?.buttonText || "Pay Now"}
                  </button>
                )}
              </div>
            );
          } else {
            // Multiple components in a row - display side by side
            return (
              <div key={`card-row-${rowIndex}`} className="flex gap-4 mb-4">
                {row.components.map((component, compIndex) => (
                  <div key={`card-comp-${compIndex}`} className="flex-1">
                    {component.originalComponent.id === 'card-number' && (
                      <div className="mb-2">
                        <label className="block text-sm mb-1">{component.config?.label || "Card Number"}</label>
                        <div
                          className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                          style={{ borderRadius: styleVariables.primerRadiusBase }}
                        >
                          <span className="text-gray-400">{component.config?.placeholder || "•••• •••• •••• ••••"}</span>
                        </div>
                      </div>
                    )}
                    
                    {component.originalComponent.id === 'card-expiry' && (
                      <div className="mb-2">
                        <label className="block text-sm mb-1">{component.config?.label || "Expiry Date"}</label>
                        <div 
                          className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                          style={{ borderRadius: styleVariables.primerRadiusBase }}
                        >
                          <span className="text-gray-400">{component.config?.placeholder || "MM/YY"}</span>
                        </div>
                      </div>
                    )}
                    
                    {component.originalComponent.id === 'card-cvv' && (
                      <div className="mb-2">
                        <label className="block text-sm mb-1">{component.config?.label || "CVV"}</label>
                        <div 
                          className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                          style={{ borderRadius: styleVariables.primerRadiusBase }}
                        >
                          <span className="text-gray-400">{component.config?.placeholder || "123"}</span>
                        </div>
                      </div>
                    )}
                    
                    {component.originalComponent.id === 'card-holder' && (
                      <div className="mb-2">
                        <label className="block text-sm mb-1">{component.config?.label || "Cardholder Name"}</label>
                        <div 
                          className="bg-white border border-gray-300 p-2 h-10 flex items-center px-3"
                          style={{ borderRadius: styleVariables.primerRadiusBase }}
                        >
                          <span className="text-gray-400">{component.config?.placeholder || "Name on card"}</span>
                        </div>
                      </div>
                    )}
                    
                    {component.originalComponent.id === 'card-submit' && (
                      <button 
                        className="hover:opacity-90 text-white rounded-md p-2 h-10 w-full font-medium transition-colors"
                        style={{ 
                          backgroundColor: styleVariables.primerColorBrand,
                          borderRadius: styleVariables.primerRadiusBase
                        }}
                      >
                        {component.config?.buttonText || "Pay Now"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Helper to check if there's a card payment component in the rows
  const hasCardPaymentInCheckout = () => {
    return rows.some(row => 
      row.components.some(component => 
        component.originalComponent.isCardForm || 
        component.originalComponent.id === 'card-form'
      )
    );
  };

  // Generate APM preview with integrated card form
  const renderCheckoutPreview = () => {
    if (rows.length === 0 || rows.every(row => row.components.length === 0)) {
      return (
        <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-center">
          No payment methods added
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {rows.map((row, rowIndex) => {
          if (row.components.length === 0) return null;

          return (
            <div key={`apm-row-${rowIndex}`} className="mb-4">
              {row.components.map((component, compIndex) => {
                // For APM payment methods
                if (component.originalComponent.isAPM) {
                  return (
                    <div key={`apm-${compIndex}`} className="mb-3">
                      <button
                        className="w-full p-3 border border-gray-300 rounded-md flex items-center justify-center bg-white hover:bg-gray-50"
                        style={{ borderRadius: styleVariables.primerRadiusBase }}
                      >
                        <span>{component.originalComponent.name}</span>
                      </button>
                    </div>
                  );
                }
                
                // For card form, display the card form components
                if (component.originalComponent.isCardForm) {
                  return (
                    <div key={`card-form-${compIndex}`} className="mb-3 p-4 border border-gray-200 rounded-md">
                      <h3 className="text-base font-medium mb-3">Card Payment</h3>
                      {renderCardFormPreview()}
                    </div>
                  );
                }
                
                return null;
              })}
            </div>
          );
        })}

        {/* If no card form is added in checkout but we have card form components, 
            display placeholder message */}
        {!hasCardPaymentInCheckout() && cardFormRows.length > 0 && (
          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 mt-4">
            <p>Note: You've configured a card form but haven't added it to the checkout. 
            Add the Card Payment component in the Checkout Builder tab to see it here.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side: Checkout Preview */}
      <div>
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Checkout Preview</CardTitle>
              <p className="text-sm text-gray-500">
                Preview of your merged checkout configuration
              </p>
            </div>
            <TabsList>
              <TabsTrigger 
                value="desktop" 
                onClick={() => setDevicePreview("desktop")}
                className={devicePreview === "desktop" ? "bg-primary text-primary-foreground" : ""}
              >
                Desktop
              </TabsTrigger>
              <TabsTrigger 
                value="mobile" 
                onClick={() => setDevicePreview("mobile")}
                className={devicePreview === "mobile" ? "bg-primary text-primary-foreground" : ""}
              >
                Mobile
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <div className={devicePreview === "mobile" ? "max-w-[375px] mx-auto" : ""}>
              <div 
                className="border rounded-lg p-6"
                style={{
                  backgroundColor: styleVariables.primerColorBackground || "white",
                  fontFamily: styleVariables.primerTypographyBrand,
                  borderRadius: styleVariables.primerRadiusBase,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
                }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold" style={{ color: styleVariables.primerColorBrand }}>
                    Complete Your Purchase
                  </h2>
                  <p className="text-sm text-gray-500">
                    Secure checkout powered by Primer
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Order Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-md" style={{ borderRadius: styleVariables.primerRadiusBase }}>
                      <div className="flex justify-between mb-2">
                        <span>Product</span>
                        <span>$99.00</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Tax</span>
                        <span>$9.90</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>$108.90</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Payment Method</h3>
                    {renderCheckoutPreview()}
                  </div>
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>Secured by Primer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right side: Theme Selector */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Theme Customization</CardTitle>
            <p className="text-sm text-gray-500">
              Customize the appearance of your checkout
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Theme Selector */}
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
              
              {/* Theme Cards */}
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
              
              {/* Style Variables Accordion */}
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="colors">
                  <AccordionTrigger>Colors</AccordionTrigger>
                  <AccordionContent>
                    {['primerColorBrand', 'primerColorBackground', 'primerColorLoader', 'primerColorFocus'].map((key) => (
                      <div key={key} className="space-y-2 mb-4">
                        <Label htmlFor={key} className="text-sm flex justify-between">
                          <span>{key === 'primerColorBrand' ? 'Brand Color' : 
                                 key === 'primerColorBackground' ? 'Background Color' :
                                 key === 'primerColorLoader' ? 'Loader Color' : 'Focus Color'}</span>
                          <input 
                            type="color" 
                            value={styleVariables[key as keyof typeof styleVariables] || '#000000'} 
                            onChange={(e) => onStyleChange(key, e.target.value)}
                            className="w-8 h-8 p-0 border-0"
                          />
                        </Label>
                        <Input 
                          id={key}
                          value={styleVariables[key as keyof typeof styleVariables]}
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
              
              {/* Theme Preview */}
              <div className="p-4 bg-gray-50 rounded-md mt-4">
                <h3 className="font-medium mb-2">Theme Preview</h3>
                <div 
                  className="p-4 rounded-md border" 
                  style={{ 
                    backgroundColor: styleVariables.primerColorBackground || 'white',
                    fontFamily: styleVariables.primerTypographyBrand,
                    borderRadius: styleVariables.primerRadiusBase,
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
                  <div className="mt-4">
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Sample input field"
                      style={{ borderRadius: styleVariables.primerRadiusBase }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeAndPreview;
