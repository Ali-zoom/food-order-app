// Dollar format
// export const formatCurrency = (number: number) => {
//   const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
//     currency: "USD",
//     style: "currency",
//   });
//   return CURRENCY_FORMATTER.format(number);
// };

// Dinar format
export const formatCurrency = (number: number) => {
  const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IQD",
  });

  return CURRENCY_FORMATTER.format(number);
};
