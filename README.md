# typescript-auto-mapper-dsl

## 🔄 AutoMapper in TypeScript (DSL-based)

This repository demonstrates a powerful and extensible way to transform data from Entity to DTO using a custom DSL-based AutoMapper in TypeScript.

> The goal is to have a reusable, clean, and consistent way to map complex nested objects with full type safety.

---

## 📦 Features

* 🔁 Supports object, nested, and array mapping
* 🔒 Fully type-safe (generic types)
* 🧠 DSL-style configuration for readability
* ✅ Ideal for use with Redux Toolkit Query `transformResponse`
* 🧪 Ready for unit testing and reuse across your app

---

## 🚀 Example Use Case

We want to convert a nested `ProductEntity` from backend to a frontend-ready `ProductDTO`.

### 🔹 Input: `ProductEntity`

```ts
const product: ProductEntity = {
  id: 301,
  name: 'Gaming Laptop',
  specs: {
    cpu: 'Intel i7',
    ram: '16GB',
    gpu: 'RTX 3060',
  },
  priceInfo: {
    basePrice: 1500,
    discount: 100,
    finalPrice: 1400,
  },
  tags: ['electronics', 'laptop', 'gaming'],
};
```

### 🔹 Target: `ProductDTO`

```ts
interface ProductDTO {
  productId: number;
  title: string;
  finalPrice: number;
  specsSummary: string;
  categories: string[];
}
```

### 🔹 Mapping Config

```ts
const productToDTOModel: MapperConfig<ProductEntity, ProductDTO> = {
  productId: 'id',
  title: 'name',
  finalPrice: 'priceInfo.finalPrice',
  specsSummary: (src) => `${src.specs.cpu} / ${src.specs.ram} / ${src.specs.gpu}`,
  categories: 'tags',
};
```

### 🔹 Usage

```ts
const productDTO = mapModel(product, productToDTOModel);

console.log(productDTO);
/*
{
  productId: 301,
  title: 'Gaming Laptop',
  finalPrice: 1400,
  specsSummary: 'Intel i7 / 16GB / RTX 3060',
  categories: ['electronics', 'laptop', 'gaming']
}
*/
```

---

## 🛠 Step-by-Step Usage

### Step 1: Define the Mapping Model

```ts
const model: MapperConfig<SourceType, DestinationType> = {
  ... // DSL rules
};
```

### Step 2: Call `mapModel`

```ts
const dto = mapModel(sourceObject, model);
```

### Step 3: Use it Anywhere

* Inside RTK Query `transformResponse`
* In adapters and services
* In your frontend forms

---

## ✅ Why We Use This Pattern

🔹 **Maintainable**: DSL mapping is defined separately and easily updated
🔹 **Reusable**: Shared across API, RTK, forms, etc.
🔹 **Clean**: Eliminates boilerplate mapping logic
🔹 **Composable**: Easy to extend for nested objects and arrays
🔹 **Safe**: Keeps typings strict and clear

---

## ✅ Recommendation

> Define mappings once, and use `mapModel()` throughout the app.
> It simplifies transformations and ensures consistency across layers.

---

## 📁 Coming Soon

* [ ] Tests
* [ ] CLI for generating model configs
* [ ] Reverse mapping (DTO → Entity)
* [ ] Type-safe validation

---

## 👏 Credits

Inspired by AutoMapper in .NET but designed for modern TypeScript apps.
