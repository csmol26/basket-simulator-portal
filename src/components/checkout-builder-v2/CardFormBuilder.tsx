
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Row, DragItem, CardFormLayout, StyleVariables } from "./types";
import DropRow from "./card-form/DropRow";
import { Button } from "@/components/ui/button";

interface CardFormBuilderProps {
  rows: Row[];
  styleVariables: StyleVariables;
  cardFormLayout: CardFormLayout;
  onRemoveRow: (rowId: string) => void;
  updateComponentConfig: (rowId: string, componentId: string, config: Partial<DragItem['config']>) => void;
  onChangeLayout: (layout: CardFormLayout) => void;
  addRow: () => void;
}

const CardFormBuilder: React.FC<CardFormBuilderProps> = ({ 
  rows, 
  styleVariables,
  cardFormLayout,
  onRemoveRow, 
  updateComponentConfig,
  onChangeLayout,
  addRow
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
          
          <Button 
            onClick={addRow} 
            variant="outline" 
            className="w-full mt-4"
          >
            Add Row
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardFormBuilder;
