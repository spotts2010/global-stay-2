// src/lib/currency.ts

// Placeholder for currency conversion rates relative to USD.
// In a real application, this would be fetched from a currency conversion API.
const conversionRates = {
  USD: 1,
  AUD: 1.5,
  EUR: 0.85,
  GBP: 0.74,
};

type Currency = keyof typeof conversionRates;

/**
 * Converts a price from one currency to another using a fixed rate table.
 * This is a placeholder and should be replaced with a real-time API.
 * @param amount The amount to convert.
 * @param fromCurrency The currency to convert from.
 * @param toCurrency The currency to convert to.
 * @returns The converted amount.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInUsd = amount / conversionRates[fromCurrency];
  const convertedAmount = amountInUsd * conversionRates[toCurrency];

  return convertedAmount;
}

/**
 * Formats a number as a currency string.
 * @param amount The numeric amount.
 * @param currency The currency code (e.g., 'USD', 'EUR').
 * @returns A formatted currency string (e.g., '$1,234.56').
 */
export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
