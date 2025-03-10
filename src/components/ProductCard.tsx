
import React from "react";
import { Button } from "@/components/ui/button";
import { useBasket, Product } from "@/context/BasketContext";
import { PlusCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useBasket();
  
  const handleAddToBasket = () => {
    addItem(product);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-subtle hover-lift animate-fade-in">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className="p-5">
        <div className="mb-2">
          <span className="inline-block text-xs font-medium text-accent/80 mb-1">Premium</span>
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full hover:bg-accent hover:text-white border-gray-200 transition-all duration-300"
            onClick={handleAddToBasket}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
