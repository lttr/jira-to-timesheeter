export function createCache(fetchFunction, ttl) {
  let cache = null;
  let fetchDate = new Date();

  const isCacheExpired = () => fetchDate.getTime() + ttl < new Date().getTime();

  return async () => {
    if (!cache || isCacheExpired()) {
      const data = await fetchFunction();
      cache = data;
      fetchDate = new Date();
      return data;
    } else {
      return cache;
    }
  };
}
