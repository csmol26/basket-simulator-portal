
import React from 'react';
import { Draggable } from "react-beautiful-dnd";
import { DragItem } from '../types';
import ComponentConfigPopover from './ComponentConfigPopover';

interface DraggableComponentProps {
  component: DragItem;
  index: number;
  rowId: string;
  updateComponentConfig: (rowId: string, componentId: string, config: Partial<DragItem['config']>) => void;
  styleVariables: Record<string, string>;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ 
  component, 
  index, 
  rowId,
  updateComponentConfig,
  styleVariables
}) => {
  return (
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

          <ComponentConfigPopover 
            component={component}
            styleVariables={styleVariables}
            updateComponentConfig={updateComponentConfig}
            rowId={rowId}
          />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableComponent;
