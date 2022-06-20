export type Cache<T> = {
  getData: () => Promise<T>;
};

export function createCache<T>(
  fetchFunction: () => Promise<T>,
  ttl: number
): Cache<T> {
  let cache: T | null = null;
  let fetchDate = new Date();

  const isCacheExpired = () => fetchDate.getTime() + ttl < new Date().getTime();

  return {
    async getData() {
      if (!cache || isCacheExpired()) {
        const data = await fetchFunction();
        cache = data;
        fetchDate = new Date();
        return data;
      } else {
        console.debug("Cache hit");
        return cache;
      }
    },
  };
}
