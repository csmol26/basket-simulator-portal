
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ComponentConfig {
  id: string;
  name: string;
  element: string;
  defaultLabel?: string;
  defaultPlaceholder?: string;
  defaultAriaLabel?: string;
  isAPM?: boolean;
  isCardForm?: boolean;
  apmType?: string;
}

// Définition des composants disponibles avec leurs configurations par défaut
export const availableComponents: ComponentConfig[] = [
  { 
    id: "card-number", 
    name: "Card Number", 
    element: "<primer-input-card-number></primer-input-card-number>",
    defaultLabel: "Card Number",
    defaultPlaceholder: "4444 3333 2222 1111",
    defaultAriaLabel: "Card Number"
  },
  { 
    id: "card-expiry", 
    name: "Card Expiry", 
    element: "<primer-input-card-expiry></primer-input-card-expiry>",
    defaultLabel: "Expiry Date",
    defaultPlaceholder: "MM/YY",
    defaultAriaLabel: "Card Expiry Date"
  },
  { 
    id: "card-cvv", 
    name: "Card CVV", 
    element: "<primer-input-cvv></primer-input-cvv>",
    defaultLabel: "CVV",
    defaultPlaceholder: "123",
    defaultAriaLabel: "Card Security Code"
  },
  { 
    id: "card-holder", 
    name: "Card Holder Name", 
    element: "<primer-input-card-holder-name></primer-input-card-holder-name>",
    defaultLabel: "Cardholder Name",
    defaultPlaceholder: "John Smith",
    defaultAriaLabel: "Cardholder Name"
  },
  { 
    id: "card-submit", 
    name: "Submit Button", 
    element: "<primer-card-form-submit></primer-card-form-submit>" 
  }
];

interface ComponentPaletteProps {
  onAddRow: () => void;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddRow }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Available Components</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="components" isDropDisabled={true}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {availableComponents.map((component, index) => (
                <Draggable
                  key={component.id}
                  draggableId={component.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-3 bg-white rounded-md border border-gray-200 shadow-sm cursor-move transition-all duration-200
                        ${snapshot.isDragging ? 'scale-105 shadow-lg border-primary' : 'hover:border-accent hover:shadow-md'}`}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.9 : 1,
                        transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0, 0)'
                      }}
                    >
                      {component.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-4">Row Management</p>
          <div className="flex gap-2">
            <Button onClick={onAddRow} variant="outline" className="flex-1">
              Add Row
            </Button>
            <Droppable droppableId="trash">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-2 bg-red-50 border border-red-200 rounded-md text-center flex-1 flex items-center justify-center"
                >
                  <span className="text-red-500 text-sm">Drop here to remove</span>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentPalette;
