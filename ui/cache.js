class DataCache {
  constructor(fetchFunction, millisecondsToLive) {
    this.millisecondsToLive = millisecondsToLive;
    this.fetchFunction = fetchFunction;
    this.cache = null;
    this.getData = this.getData.bind(this);
    this.isCacheExpired = this.isCacheExpired.bind(this);
    this.fetchDate = new Date(0);
  }
  isCacheExpired() {
    return (
      this.fetchDate.getTime() + this.millisecondsToLive < new Date().getTime()
    );
  }
  async getData() {
    if (!this.cache || this.isCacheExpired()) {
      console.log("expired - fetching new data");
      const data = await this.fetchFunction();
      this.cache = data;
      this.fetchDate = new Date();
      return data;
    } else {
      console.log("cache hit");
      return this.cache;
    }
  }
}

async function getData() {
  const asyncData = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve("abc"), 100);
    });
  };
  const data = await asyncData();
  console.log("getData called with ", data);
  return {
    foo: data,
  };
}
const cache = new DataCache(getData, 1000);

setTimeout(() => cache.getData(), 500);
setTimeout(() => cache.getData(), 1500);
setTimeout(() => cache.getData(), 2500);
