import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatMoney(pence: number) { return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format((pence || 0) / 100); }
export function formatDate(value: Date | string) { return new Intl.DateTimeFormat("en-GB").format(new Date(value)); }
