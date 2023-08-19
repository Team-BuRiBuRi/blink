export const anyToFloat = (a: any) => {
  const parsedA = parseFloat(a);
  if (isNaN(parsedA)) return -1;
  return parsedA;
};
