import React from "react";
import { Link } from "react-router-dom";

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const handleQtyChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) onUpdateQty(item._id, qty);
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <Link to={`/products/${item._id}`}>
          <img
            src={item.image || "/placeholder.png"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />
        </Link>

        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-gray-500 text-sm">{item.type}</p>
          <p className="text-gray-700 font-bold">₹{item.price}.00</p>
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
