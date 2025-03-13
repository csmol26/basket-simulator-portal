
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Row, DragItem, CardFormLayout, StyleVariables } from "./types";
import DropRow from "./card-form/DropRow";

interface CardFormBuilderProps {
  rows: Row[];
  onRemoveRow: (rowId: string) => void;
  updateComponentConfig: (rowId: string, componentId: string, config: Partial<DragItem['config']>) => void;
  styleVariables: StyleVariables;
  cardFormLayout: CardFormLayout;
}

const CardFormBuilder: React.FC<CardFormBuilderProps> = ({ 
  rows, 
  onRemoveRow, 
  updateComponentConfig,
  styleVariables,
  cardFormLayout
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Card Form Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <DropRow 
              key={row.id}
              row={row}
              onRemoveRow={onRemoveRow}
              updateComponentConfig={updateComponentConfig}
              styleVariables={styleVariables}
              canRemove={rows.length > 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardFormBuilder;
