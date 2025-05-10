export interface ProductEntity {
  id: number;
  name: string;
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
  };
  priceInfo: {
    basePrice: number;
    discount: number;
    finalPrice: number;
  };
  tags: string[];
}
