import { render, screen } from "@testing-library/react";
import CartItem from "./CartItem.jsx";

const cartItem = {
  _id: "1",
  product: { name: "Fender Strat", price: 1000 },
  qty: 2,
};

describe("CartItem Component", () => {
  it("renders cart item name and quantity", () => {
    render(<CartItem item={cartItem} />);
    expect(screen.getByText(/Fender Strat/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });
});
