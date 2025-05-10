import { ProductEntity } from "./models/product.entity";
import { mapProductToDTO } from "./models/product.mapper";

const product: ProductEntity = {
  id: 301,
  name: "Gaming Laptop",
  specs: {
    cpu: "Intel i7",
    ram: "16GB",
    gpu: "RTX 3060",
  },
  priceInfo: {
    basePrice: 1500,
    discount: 100,
    finalPrice: 1400,
  },
  tags: ["electronics", "laptop", "gaming"],
};

console.log(mapProductToDTO(product));
