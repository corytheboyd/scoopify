export const useHashParameters = () => {
  const searchParams = new URLSearchParams();
  const fullHash = window.location.hash;
  fullHash
    .substring(1)
    .split("&")
    .map((e) => e.split("="))
    .forEach(([key, value]) => searchParams.set(key, value));
  return searchParams;
};
