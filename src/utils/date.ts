export const formatNumber = (n: number | string) => {
  const v = n.toString();
  return v[1] ? v : "0" + v;
};
