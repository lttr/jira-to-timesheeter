export type Cache<T> = {
  getData: () => Promise<T | null>;
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
        let data = null;
        try {
          data = await fetchFunction();
          cache = data;
          fetchDate = new Date();
        } catch (e) {
          console.warn(e);
        }
        return data;
      } else {
        console.debug("Cache hit");
        return cache;
      }
    },
  };
}
