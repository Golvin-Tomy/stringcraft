

import React from "react";

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const handleQtyChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) onUpdateQty(item._id, qty);
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-gray-500 text-sm">{item.type}</p>
          <p className="text-gray-700 font-bold">${item.price}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="number"
          min="1"
          value={item.qty}
          onChange={handleQtyChange}
          className="w-16 border rounded px-2 py-1 text-center"
        />
        <button
          onClick={() => onRemove(item._id)}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
