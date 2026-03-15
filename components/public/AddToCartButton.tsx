"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface AddToCartButtonProps {
  productName: string;
  tallas: string[];
}

export default function AddToCartButton({
  productName,
  tallas,
}: AddToCartButtonProps) {
  const [selectedTalla, setSelectedTalla] = useState<string>("");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedTalla) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de tallas */}
      {tallas.length > 0 && (
        <div>
          <p className="text-sm font-medium text-neutral-900 mb-2">
            Talla:{" "}
            {selectedTalla && (
              <span className="font-bold">{selectedTalla}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {tallas.map((talla) => (
              <button
                key={talla}
                onClick={() => setSelectedTalla(talla)}
                className={`min-w-[44px] h-10 px-3 text-sm border transition-colors ${
                  selectedTalla === talla
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-900 border-neutral-300 hover:border-black"
                }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botón agregar */}
      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={!selectedTalla && tallas.length > 0}
        className="w-full"
      >
        {added ? `✓ ${productName} agregado` : "Agregar al carrito"}
      </Button>

      {!selectedTalla && tallas.length > 0 && (
        <p className="text-xs text-neutral-500">
          Seleccioná una talla para continuar
        </p>
      )}
    </div>
  );
}
