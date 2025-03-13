
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragItem } from '../types';
import { jsonToCssVariable } from "../StyleVarsEditor";

interface ComponentConfigPopoverProps {
  component: DragItem;
  styleVariables: Record<string, string>;
  updateComponentConfig: (rowId: string, componentId: string, config: Partial<DragItem['config']>) => void;
  rowId: string;
}

const ComponentConfigPopover: React.FC<ComponentConfigPopoverProps> = ({ 
  component, 
  styleVariables, 
  updateComponentConfig,
  rowId 
}) => {
  // Convert pixel values to numbers for sliders
  const getSpaceValue = (value: string): number => {
    const numValue = parseInt(value);
    return isNaN(numValue) ? 0 : Math.min(20, Math.max(0, numValue));
  };

  // Component-specific field configurations
  const renderComponentSpecificFields = () => {
    switch (component.originalComponent?.id) {
      case 'card-number':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-label`} className="text-xs">
                Label
              </Label>
              <Input
                id={`${component.id}-label`}
                placeholder="Card Number"
                value={component.config?.label || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { label: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: Card Number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-placeholder`} className="text-xs">
                Placeholder
              </Label>
              <Input
                id={`${component.id}-placeholder`}
                placeholder="4111 1111 1111 1111"
                value={component.config?.placeholder || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { placeholder: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: 4111 1111 1111 1111
              </p>
            </div>
          </>
        );
      case 'card-cvv':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-label`} className="text-xs">
                Label
              </Label>
              <Input
                id={`${component.id}-label`}
                placeholder="CVV"
                value={component.config?.label || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { label: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: CVV
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-placeholder`} className="text-xs">
                Placeholder
              </Label>
              <Input
                id={`${component.id}-placeholder`}
                placeholder="123"
                value={component.config?.placeholder || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { placeholder: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: 123
              </p>
            </div>
          </>
        );
      case 'card-expiry':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-label`} className="text-xs">
                Label
              </Label>
              <Input
                id={`${component.id}-label`}
                placeholder="Expiry Date"
                value={component.config?.label || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { label: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: Expiry Date
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-placeholder`} className="text-xs">
                Placeholder
              </Label>
              <Input
                id={`${component.id}-placeholder`}
                placeholder="MM/YY"
                value={component.config?.placeholder || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { placeholder: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: MM/YY
              </p>
            </div>
          </>
        );
      case 'card-holder':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-label`} className="text-xs">
                Label
              </Label>
              <Input
                id={`${component.id}-label`}
                placeholder="Cardholder Name"
                value={component.config?.label || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { label: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: Cardholder Name
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-placeholder`} className="text-xs">
                Placeholder
              </Label>
              <Input
                id={`${component.id}-placeholder`}
                placeholder="Name on card"
                value={component.config?.placeholder || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { placeholder: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: Name on card
              </p>
            </div>
          </>
        );
      case 'card-submit':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-buttonText`} className="text-xs">
                Button Text
              </Label>
              <Input
                id={`${component.id}-buttonText`}
                placeholder="Pay"
                value={component.config?.buttonText || ''}
                onChange={(e) => 
                  updateComponentConfig(rowId, component.id, { buttonText: e.target.value })
                }
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-gray-500">
                Default: Pay
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${component.id}-variant`} className="text-xs">
                Button Variant
              </Label>
              <Select 
                value={component.config?.variant || 'primary'}
                onValueChange={(value) => 
                  updateComponentConfig(rowId, component.id, { variant: value })
                }
              >
                <SelectTrigger id={`${component.id}-variant`} className="h-8 text-xs">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-gray-500">
                Default: primary
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 shadow-sm flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Settings className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Configure {component.originalComponent?.name}</h4>
          
          {/* Component-specific configuration fields */}
          {renderComponentSpecificFields()}

          {/* Common spacing configuration */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <Label htmlFor={`${component.id}-space-small`} className="text-xs">
              {jsonToCssVariable.primerSpaceSmall} (Field Spacing)
            </Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Slider
                  id={`${component.id}-space-small`}
                  min={0}
                  max={20}
                  step={1}
                  value={[getSpaceValue(component.config?.spaceSmall || styleVariables.primerSpaceSmall)]}
                  onValueChange={(value) => 
                    updateComponentConfig(rowId, component.id, { spaceSmall: `${value[0]}px` })
                  }
                />
              </div>
              <div className="w-12 text-center">
                <Input
                  value={component.config?.spaceSmall || styleVariables.primerSpaceSmall}
                  onChange={(e) => 
                    updateComponentConfig(rowId, component.id, { spaceSmall: e.target.value })
                  }
                  className="text-center p-1 h-8 text-xs"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-500">
              Controls spacing for this field specifically
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ComponentConfigPopover;
