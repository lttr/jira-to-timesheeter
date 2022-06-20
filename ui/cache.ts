export type Cache<T> = {
  getData: (key: string) => Promise<T | null>;
};

export function createCache<T>(
  fetchFunction: () => Promise<T>,
  ttl: number
): Cache<T> {
  const cache: Record<string, T | null> = {};
  let fetchDate = new Date();

  const isCacheExpired = () => fetchDate.getTime() + ttl < new Date().getTime();

  return {
    async getData(key: string) {
      if (!cache[key] || isCacheExpired()) {
        let data = null;
        try {
          data = await fetchFunction();
          cache[key] = data;
          fetchDate = new Date();
        } catch (e) {
          console.warn(e);
        }
        return data;
      } else {
        console.debug("Cache hit");
        return cache[key];
      }
    },
  };
}
