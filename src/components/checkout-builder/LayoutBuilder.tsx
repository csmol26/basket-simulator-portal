
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { availableComponents } from "./ComponentList";

interface DragItem {
  id: string;
  content: string;
}

interface Row {
  id: string;
  components: DragItem[];
}

interface LayoutBuilderProps {
  rows: Row[];
  onRemoveRow: (rowId: string) => void;
}

const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ rows, onRemoveRow }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Layout Builder</CardTitle>
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
                            className="p-2 bg-white border border-gray-200 rounded-md shadow-sm flex-1 cursor-move hover:border-accent"
                          >
                            <div className="text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap">
                              {availableComponents.find(c => component.content.includes(c.element))?.name || "Component"}
                            </div>
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
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutBuilder;
