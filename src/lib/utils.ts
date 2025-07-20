import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ones = [
  "", "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
  "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty",
  "Sixty", "Seventy", "Eighty", "Ninety"
];

const scale = [
  "", "Thousand", "Million", "Billion"
];

function convertHundred(n: number): string {
  let result = "";

  if (n >= 100) {
    result += ones[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }

  if (n >= 20) {
    result += tens[Math.floor(n / 10)] + " ";
    n %= 10;
  }

  if (n > 0) {
    result += ones[n] + " ";
  }

  return result.trim();
}

export function numberToWords(num: number): string {
  if (num === 0) return "Zero";

  let result = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkInWords = convertHundred(chunk);
      result = `${chunkInWords} ${scale[scaleIndex]} ${result}`.trim();
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim();
}