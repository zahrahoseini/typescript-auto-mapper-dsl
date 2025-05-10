export type MapRule<TSource, TValue> =
  | keyof TSource
  | string
  | ((source: TSource) => TValue)
  | MapperConfig<any, TValue>
  | [MapperConfig<any, any>]
  | {
      from: string;
      map: MapperConfig<any, any>;
    };

export type MapperConfig<TSource, TDestination> = {
  [K in keyof TDestination]?: MapRule<TSource, TDestination[K]>;
};

function getValueByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export class AutoMapper {
  static mapWith<TSource, TDestination>(
    source: TSource,
    config: MapperConfig<TSource, TDestination>
  ): TDestination {
    const result = {} as TDestination;

    for (const key in config) {
      const rule = config[key];

      if (typeof rule === "function") {
        result[key] = (rule as (src: TSource) => any)(source);
      } else if (typeof rule === "string") {
        result[key] = rule.includes(".")
          ? getValueByPath(source, rule)
          : source[rule as keyof TSource];
      } else if (Array.isArray(rule)) {
        const [itemMap] = rule;
        const sourceArray = getValueByPath(source, key) || [];
        result[key] = Array.isArray(sourceArray)
          ? (sourceArray.map((item) => this.mapWith(item, itemMap)) as any)
          : ([] as any);
      } else if (typeof rule === "object" && rule !== null) {
        if ("from" in rule && "map" in rule) {
          const rawArray = getValueByPath(source, rule.from) || [];
          result[key] = Array.isArray(rawArray)
            ? (rawArray.map((item) => this.mapWith(item, rule.map)) as any)
            : ([] as any);
        } else {
          result[key] = this.mapWith(
            source,
            rule as MapperConfig<TSource, any>
          );
        }
      }
    }

    return result;
  }
}
