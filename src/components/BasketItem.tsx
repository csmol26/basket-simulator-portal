
import React from "react";
import { Button } from "@/components/ui/button";
import { BasketItem as BasketItemType, useBasket } from "@/context/BasketContext";
import { Trash2, Plus, Minus } from "lucide-react";

interface BasketItemProps {
  item: BasketItemType;
}

const BasketItem: React.FC<BasketItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useBasket();
  const { product, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-100 animate-slide-up">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between">
            <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
            <p className="ml-4 text-base font-medium text-gray-900">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{product.description}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between mt-2">
          <div className="flex items-center space-x-1">
            <Button 
              size="icon"
              variant="ghost" 
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={handleDecrement}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="text-gray-700 px-2 min-w-[24px] text-center">
              {quantity}
            </span>
            
            <Button 
              size="icon"
              variant="ghost" 
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasketItem;
