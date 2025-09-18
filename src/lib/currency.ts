// src/lib/currency.ts
import type { Currency } from './data';

// Placeholder for currency conversion rates relative to USD.
// In a real application, this would be fetched from a currency conversion API.
const conversionRates: Record<Currency, number> = {
  USD: 1,
  AUD: 1.5,
  EUR: 0.92,
  GBP: 0.79,
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  AUD: '$',
  EUR: '€',
  GBP: '£',
};

/**
 * Gets the currency symbol for a given currency code.
 * @param currency The currency code.
 * @returns The currency symbol.
 */
export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency] || '$';
}

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

  const fromRate = conversionRates[fromCurrency] || 1;
  const toRate = conversionRates[toCurrency] || 1;

  const amountInUsd = amount / fromRate;
  const convertedAmount = amountInUsd * toRate;

  return convertedAmount;
}

/**
 * Formats a number as a currency string.
 * @param amount The numeric amount.
 * @param currency The currency code (e.g., 'USD', 'EUR').
 * @returns A formatted currency string (e.g., '$1,234.56').
 */
export function formatCurrency(amount: number | string, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberAmount);

  return `${symbol}${formattedAmount}`;
}
