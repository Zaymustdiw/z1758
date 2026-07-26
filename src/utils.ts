export type Currency = 'BDT' | 'USD';

export const formatPrice = (priceInUSD: number, currency: Currency): string => {
  if (currency === 'BDT') {
    return `৳${Math.round(priceInUSD * 110).toLocaleString('en-IN')}`;
  }
  return `$${priceInUSD.toFixed(2)}`;
};

export const getShippingFee = (zone: 'inside' | 'outside', currency: Currency): number => {
  const feeInBDT = zone === 'inside' ? 70 : 130;
  if (currency === 'BDT') return feeInBDT;
  return feeInBDT / 110;
};
