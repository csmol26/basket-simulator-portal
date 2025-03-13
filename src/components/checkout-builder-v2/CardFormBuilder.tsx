
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { jsonToCssVariable } from "./StyleVarsEditor";
import { Row, DragItem, CardFormLayout } from "./types";

interface CardFormBuilderProps {
  rows: Row[];
  onRemoveRow: (rowId: string) => void;
  updateComponentConfig: (rowId: string, componentId: string, config: Partial<DragItem['config']>) => void;
  styleVariables: Record<string, string>;
  cardFormLayout: CardFormLayout;
}

const CardFormBuilder: React.FC<CardFormBuilderProps> = ({ 
  rows, 
  onRemoveRow, 
  updateComponentConfig,
  styleVariables,
  cardFormLayout
}) => {
  // Convert pixel values to numbers for sliders
  const getSpaceValue = (value: string): number => {
    const numValue = parseInt(value);
    return isNaN(numValue) ? 0 : Math.min(20, Math.max(0, numValue));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Card Form Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="relative border border-dashed border-gray-300 p-3 rounded-md">
              <Droppable droppableId={row.id} direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[60px] flex gap-2 ${row.components.length > 0 ? '' : 'justify-center items-center'}`}
                  >
                    {row.components.length === 0 && (
                      <span className="text-gray-400 text-sm">Drag components here</span>
                    )}
                    
                    {row.components.map((component, index) => (
                      <Draggable
                        key={component.id}
                        draggableId={component.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 bg-white border border-gray-200 rounded-md shadow-sm flex-1 cursor-move hover:border-accent relative group"
                          >
                            <div className="text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap">
                              {component.originalComponent?.name || "Component"}
                            </div>

                            {/* Settings popover */}
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
                                  
                                  {component.originalComponent?.defaultLabel && (
                                    <div className="space-y-2">
                                      <Label htmlFor={`${component.id}-label`} className="text-xs">
                                        Label
                                      </Label>
                                      <Input
                                        id={`${component.id}-label`}
                                        placeholder={component.originalComponent.defaultLabel}
                                        value={component.config?.label || ''}
                                        onChange={(e) => 
                                          updateComponentConfig(row.id, component.id, { label: e.target.value })
                                        }
                                        className="h-8 text-xs"
                                      />
                                      <p className="text-[10px] text-gray-500">
                                        Default: {component.originalComponent.defaultLabel}
                                      </p>
                                    </div>
                                  )}

                                  {component.originalComponent?.defaultPlaceholder && (
                                    <div className="space-y-2">
                                      <Label htmlFor={`${component.id}-placeholder`} className="text-xs">
                                        Placeholder
                                      </Label>
                                      <Input
                                        id={`${component.id}-placeholder`}
                                        placeholder={component.originalComponent.defaultPlaceholder}
                                        value={component.config?.placeholder || ''}
                                        onChange={(e) => 
                                          updateComponentConfig(row.id, component.id, { placeholder: e.target.value })
                                        }
                                        className="h-8 text-xs"
                                      />
                                      <p className="text-[10px] text-gray-500">
                                        Default: {component.originalComponent.defaultPlaceholder}
                                      </p>
                                    </div>
                                  )}

                                  {component.originalComponent?.defaultAriaLabel && (
                                    <div className="space-y-2">
                                      <Label htmlFor={`${component.id}-ariaLabel`} className="text-xs">
                                        Aria Label
                                      </Label>
                                      <Input
                                        id={`${component.id}-ariaLabel`}
                                        placeholder={component.originalComponent.defaultAriaLabel}
                                        value={component.config?.ariaLabel || ''}
                                        onChange={(e) => 
                                          updateComponentConfig(row.id, component.id, { ariaLabel: e.target.value })
                                        }
                                        className="h-8 text-xs"
                                      />
                                      <p className="text-[10px] text-gray-500">
                                        Default: {component.originalComponent.defaultAriaLabel}
                                      </p>
                                    </div>
                                  )}

                                  {/* Spacing configuration */}
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
                                            updateComponentConfig(row.id, component.id, { spaceSmall: `${value[0]}px` })
                                          }
                                        />
                                      </div>
                                      <div className="w-12 text-center">
                                        <Input
                                          value={component.config?.spaceSmall || styleVariables.primerSpaceSmall}
                                          onChange={(e) => 
                                            updateComponentConfig(row.id, component.id, { spaceSmall: e.target.value })
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
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              
              {rows.length > 1 && (
                <button
                  onClick={() => onRemoveRow(row.id)}
                  className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  title="Remove row"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardFormBuilder;
