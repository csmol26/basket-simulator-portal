
import React from 'react';
import { Droppable } from "react-beautiful-dnd";
import { X } from "lucide-react";
import { Row, DragItem } from '../types';
import DraggableComponent from './DraggableComponent';

interface DropRowProps {
  row: Row;
  onRemoveRow: (rowId: string) => void;
  updateComponentConfig: (rowId: string, componentId: string, config: Partial<DragItem['config']>) => void;
  styleVariables: Record<string, string>;
  canRemove: boolean;
}

const DropRow: React.FC<DropRowProps> = ({ 
  row, 
  onRemoveRow, 
  updateComponentConfig, 
  styleVariables,
  canRemove
}) => {
  return (
    <div className="relative border border-dashed border-gray-300 p-3 rounded-md">
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
              <DraggableComponent 
                key={component.id}
                component={component}
                index={index}
                rowId={row.id}
                updateComponentConfig={updateComponentConfig}
                styleVariables={styleVariables}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {canRemove && (
        <button
          onClick={() => onRemoveRow(row.id)}
          className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
          title="Remove row"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default DropRow;
