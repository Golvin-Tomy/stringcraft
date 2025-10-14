

import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard.jsx";

const product = {
  _id: "1",
  name: "Fender Stratocaster",
  price: 1200,
  images: [{ url: "https://via.placeholder.com/150" }],
  category: "electric",
};

describe("ProductCard Component", () => {
  it("renders product name and price", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(/Fender Stratocaster/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1200/)).toBeInTheDocument();
  });

  it("renders product image", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", product.images[0].url);
  });
});
