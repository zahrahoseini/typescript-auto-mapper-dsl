export type MapRule<TSource, TValue> =
  | keyof TSource
  | string
  | ((source: TSource) => TValue)
  | MapperConfig<any, TValue>
  | [MapperConfig<any, any>]
  | { from: string; map: MapperConfig<any, any> };

export type MapperConfig<TSource, TDestination> = {
  [K in keyof TDestination]?: MapRule<TSource, TDestination[K]>;
};

type IsSearchByKeyType = boolean;

// Utility to get nested value by dot-separated path
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

// Recursive search to find a key deeply inside an object graph
function getValueByDeepKey(obj: any, key: string): any {
  const visited = new Set<any>();

  function search(current: any): any {
    if (!current || typeof current !== 'object' || visited.has(current)) return undefined;
    visited.add(current);

    if (key in current) return current[key];

    for (const k in current) {
      const found = search(current[k]);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  return search(obj);
}

// Resolve a value from the source based on a key or path, using search mode
function resolveValue<TSource>(
  source: TSource,
  keyOrPath: string,
  searchByKey: IsSearchByKeyType
): any {
  return searchByKey ? getValueByDeepKey(source, keyOrPath) : getValueByPath(source, keyOrPath);
}

// Handle mapping when the rule is a function
function mapUsingFunction<TSource, TValue>(
  source: TSource,
  fn: (source: TSource) => TValue
): TValue {
  return fn(source);
}

// Handle mapping when the rule is a string or key path
function mapUsingString<TSource>(
  source: TSource,
  rule: string,
  searchByKey: IsSearchByKeyType
): any {
  return resolveValue(source, rule, searchByKey);
}

// Handle mapping when the rule is an array of MapperConfig (for arrays)
function mapUsingArray<TSource>(
  source: TSource,
  key: string,
  rule: [MapperConfig<any, any>],
  searchByKey: IsSearchByKeyType
): any[] {
  const [itemMap] = rule;
  const sourceArray = resolveValue(source, key, searchByKey) || [];
  if (!Array.isArray(sourceArray)) return [];
  return sourceArray.map(item => AutoMapper.mapWith(item, itemMap, searchByKey));
}

// Handle mapping when the rule is an object with `from` and `map` keys (array mapping with different source key)
function mapUsingFromMap<TSource>(
  source: TSource,
  rule: { from: string; map: MapperConfig<any, any> },
  searchByKey: IsSearchByKeyType
): any[] {
  const rawArray = resolveValue(source, rule.from, searchByKey) || [];
  if (!Array.isArray(rawArray)) return [];
  return rawArray.map(item => AutoMapper.mapWith(item, rule.map, searchByKey));
}

// Handle mapping when the rule is a nested MapperConfig object
function mapUsingObject<TSource>(
  source: TSource,
  rule: MapperConfig<TSource, any>,
  searchByKey: IsSearchByKeyType
): any {
  return AutoMapper.mapWith(source, rule, searchByKey);
}

export class AutoMapper {
  static mapWith<TSource, TDestination>(
    source: TSource,
    config: MapperConfig<TSource, TDestination>,
    searchByKey: IsSearchByKeyType = false
  ): TDestination {
    const result = {} as TDestination;

    for (const key in config) {
      const rule = config[key];
      if (!rule) continue;

      if (typeof rule === 'function') {
        const fn = rule as (source: TSource) => any;
        result[key] = mapUsingFunction(source, fn);
      } else if (typeof rule === 'string' || typeof rule === 'symbol') {
        result[key] = mapUsingString(source, rule as string, searchByKey);
      } else if (Array.isArray(rule)) {
        const mapperConfigArray = rule as [MapperConfig<any, any>];
        result[key] = mapUsingArray(source, key, mapperConfigArray, searchByKey) as TDestination[typeof key];
      } else if (typeof rule === 'object') {
        if ('from' in rule && 'map' in rule) {
          result[key] = mapUsingFromMap(source, rule as { from: string; map: MapperConfig<any, any> }, searchByKey) as TDestination[typeof key];
        } else {
          result[key] = mapUsingObject(source, rule as MapperConfig<TSource, any>, searchByKey);
        }
      }
    }

    return result;
  }
}
