export type Cache<T> = {
  getData: (key: string) => Promise<T | null>;
};

export function createCache<T>(
  fetchFunction: () => Promise<T>,
  ttl: number,
): Cache<T> {
  const cache: Record<string, { date: Date; value: T | null }> = {};
  const isCacheExpired = (date: Date) =>
    date.getTime() + ttl < new Date().getTime();

  return {
    async getData(key: string) {
      if (!cache[key] || isCacheExpired(cache[key].date)) {
        let data = null;
        try {
          data = await fetchFunction();
          cache[key] = {
            value: data,
            date: new Date(),
          };
        } catch (e) {
          throw e;
        }
        return data;
      } else {
        console.debug("Cache hit for key: ", key);
        return cache[key].value;
      }
    },
  };
}
