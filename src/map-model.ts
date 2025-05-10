import { AutoMapper, MapperConfig } from "./auto-mapper";

export function mapModel<TSource, TDestination>(
  source: TSource,
  model: MapperConfig<TSource, TDestination>
): TDestination {
  return AutoMapper.mapWith<TSource, TDestination>(source, model);
}
