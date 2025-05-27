
import { mapModel } from '../map-model';
import { AutoMapper, MapperConfig } from '../auto-mapper';
import { ProductEntity } from './product.entity';
import { ProductDTO } from './product.dto';

export const productToDTOModel: MapperConfig<ProductEntity, ProductDTO> = {
  productId: 'id',
  title: 'name',
  finalPrice: 'priceInfo.finalPrice', //it can be only 'finalPrice' if mapModel(product, productToDTOModel, true);
  specsSummary: (src) => `${src.specs.cpu} / ${src.specs.ram} / ${src.specs.gpu}`,
  categories: 'tags',
};

export const mapProductToDTO = (product: ProductEntity): ProductDTO =>
  mapModel(product, productToDTOModel);