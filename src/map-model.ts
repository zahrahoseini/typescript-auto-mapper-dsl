import { AutoMapper, MapperConfig } from "./auto-mapper";

export function mapModel<TSource, TDestination>(
  source: TSource,
  model: MapperConfig<TSource, TDestination>,
  isSearchByKey: boolean = false
): TDestination {
  return AutoMapper.mapWith<TSource, TDestination>(source, model, isSearchByKey);
}