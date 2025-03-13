
import { useState } from "react";
import { DragItem, Row } from "@/components/checkout-builder-v2/types";

export const useCardFormBuilder = () => {
  const [rows, setRows] = useState<Row[]>([
    { id: "row-1", components: [] }
  ]);

  const addRow = () => {
    setRows([...rows, { id: `row-${rows.length + 1}`, components: [] }]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId));
    }
  };

  const updateComponentConfig = (rowId: string, componentId: string, config: Partial<DragItem['config']>) => {
    const newRows = rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          components: row.components.map(comp => {
            if (comp.id === componentId) {
              return {
                ...comp,
                config: { ...comp.config, ...config }
              };
            }
            return comp;
          })
        };
      }
      return row;
    });
    setRows(newRows);
  };

  return {
    rows,
    setRows,
    addRow,
    removeRow,
    updateComponentConfig
  };
};
