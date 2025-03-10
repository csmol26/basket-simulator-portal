
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define available checkout components
export const availableComponents = [
  { id: "card-number", name: "Card Number", element: "<primer-input-card-number placeholder=\"4444 3333 2222 1111\"></primer-input-card-number>" },
  { id: "card-expiry", name: "Card Expiry", element: "<primer-input-card-expiry placeholder=\"12/30\"></primer-input-card-expiry>" },
  { id: "card-cvv", name: "Card CVV", element: "<primer-input-cvv placeholder=\"123\"></primer-input-cvv>" },
  { id: "card-holder", name: "Card Holder Name", element: "<primer-input-card-holder-name placeholder=\"Cardholder Name\"></primer-input-card-holder-name>" },
  { id: "card-submit", name: "Submit Button", element: "<primer-card-form-submit style=\"height: 40px; width: 100%; font-weight: 500;\"></primer-card-form-submit>" },
];

interface ComponentListProps {
  onCardPositionToggle: () => void;
  cardFirst: boolean;
  onAddRow: () => void;
}

const ComponentList: React.FC<ComponentListProps> = ({ 
  onCardPositionToggle, 
  cardFirst,
  onAddRow 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Available Components</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="components">
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
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 bg-white rounded-md border border-gray-200 shadow-sm cursor-move hover:border-accent hover:shadow-md transition-all"
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
          <p className="text-sm font-medium text-gray-700 mb-4">Payment Method Order</p>
          <Button 
            onClick={onCardPositionToggle} 
            variant="outline" 
            className="w-full justify-between"
          >
            {cardFirst ? "Card → APM" : "APM → Card"}
            <span className="text-xs text-gray-500">Click to toggle</span>
          </Button>
        </div>
        
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

export default ComponentList;
