
import { availableComponents } from "@/components/checkout-builder-v2/ComponentPalette";
import { availableAPMs } from "@/components/checkout-builder-v2/constants/checkoutBuilderConstants";
import { DragItem } from "@/components/checkout-builder-v2/types";

export const useDragAndDrop = (
  setRows: React.Dispatch<React.SetStateAction<any[]>>,
  rows: any[],
  setCheckoutRows: React.Dispatch<React.SetStateAction<any[]>>,
  checkoutRows: any[],
  styleVariables: any
) => {
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Handle card form components drop
    if (source.droppableId === "components") {
      const componentId = result.draggableId;
      const component = availableComponents.find(c => c.id === componentId);
      
      if (component && destination.droppableId.startsWith("row-")) {
        const newItem: DragItem = {
          id: `${component.id}-${Date.now()}`,
          content: component.element,
          originalComponent: component,
          config: {
            label: component.defaultLabel,
            placeholder: component.defaultPlaceholder,
            ariaLabel: component.defaultAriaLabel,
            spaceSmall: styleVariables.primerSpaceSmall,
            displayMode: "default",
            validation: {
              required: true,
              customErrorMessage: ""
            }
          }
        };
        
        const newRows = [...rows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        
        if (rowIndex !== -1) {
          newRows[rowIndex].components.splice(destination.index, 0, newItem);
          setRows(newRows);
        }
      }
    } 
    // Handle items drag within card form rows
    else if (source.droppableId.startsWith("row-")) {
      const sourceRowIndex = rows.findIndex(row => row.id === source.droppableId);
      
      if (sourceRowIndex !== -1) {
        const newRows = [...rows];
        const [movedItem] = newRows[sourceRowIndex].components.splice(source.index, 1);
        
        if (destination.droppableId.startsWith("row-")) {
          const destRowIndex = newRows.findIndex(row => row.id === destination.droppableId);
          
          if (destRowIndex !== -1) {
            newRows[destRowIndex].components.splice(destination.index, 0, movedItem);
          }
        } else if (destination.droppableId === "trash") {
          // Item dropped in trash, already removed from source
        }
        
        setRows(newRows);
      }
    } 
    // Handle APMs drag from palette to checkout
    else if (source.droppableId === "apm-palette") {
      // First, find the original APM data
      const apmId = result.draggableId.replace('palette-', '');
      const apm = availableAPMs.find(a => a.id === apmId);
      
      if (apm && destination.droppableId.startsWith('checkout-row-')) {
        const newItem: DragItem = {
          id: `apm-${apm.id}-${Date.now()}`,
          content: `<primer-payment-method type="${apm.type}"></primer-payment-method>`,
          originalComponent: {
            id: apm.id,
            name: apm.name,
            element: `<primer-payment-method type="${apm.type}"></primer-payment-method>`,
            isAPM: true,
            apmType: apm.type
          },
          config: {
            displayMode: "default",
          }
        };
        
        const newRows = [...checkoutRows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        
        if (rowIndex !== -1) {
          newRows[rowIndex].components.splice(destination.index, 0, newItem);
          setCheckoutRows(newRows);
        }
      }
    }
    // Handle card form drop to checkout builder
    else if (source.droppableId === "card-form-component") {
      if (destination.droppableId.startsWith('checkout-row-')) {
        const newItem: DragItem = {
          id: `card-form-${Date.now()}`,
          content: `<primer-payment-method type="PAYMENT_CARD"></primer-payment-method>`,
          originalComponent: {
            id: 'card-form',
            name: 'Card Form',
            element: `<primer-payment-method type="PAYMENT_CARD"></primer-payment-method>`,
            isCardForm: true
          },
          config: {
            displayMode: "default",
          }
        };
        
        const newRows = [...checkoutRows];
        const rowIndex = newRows.findIndex(row => row.id === destination.droppableId);
        
        if (rowIndex !== -1) {
          newRows[rowIndex].components.splice(destination.index, 0, newItem);
          setCheckoutRows(newRows);
        }
      }
    }
    // Handle reordering components within checkout rows
    else if (source.droppableId.startsWith("checkout-row-")) {
      const sourceRowIndex = checkoutRows.findIndex(row => row.id === source.droppableId);
      
      if (sourceRowIndex !== -1) {
        const newRows = [...checkoutRows];
        const [movedItem] = newRows[sourceRowIndex].components.splice(source.index, 1);
        
        if (destination.droppableId.startsWith("checkout-row-")) {
          const destRowIndex = newRows.findIndex(row => row.id === destination.droppableId);
          
          if (destRowIndex !== -1) {
            newRows[destRowIndex].components.splice(destination.index, 0, movedItem);
          }
        } else if (destination.droppableId === "checkout-trash") {
          // Item dropped in trash, already removed from source
        }
        
        setCheckoutRows(newRows);
      }
    }
  };

  return { onDragEnd };
};
