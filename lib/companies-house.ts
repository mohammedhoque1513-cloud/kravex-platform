import { requiresConfigured } from "@/lib/production";

export async function verifyUkCompany(query: string) {
  if (!requiresConfigured("COMPANIES_HOUSE_API_KEY", process.env.COMPANIES_HOUSE_API_KEY)) {
    return { configured: false, matched: false, company: null as null | { name: string; number?: string; status?: string } };
  }
  const response = await fetch(`https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(query)}&items_per_page=1`, {
    headers: {
      authorization: `Basic ${Buffer.from(`${process.env.COMPANIES_HOUSE_API_KEY}:`).toString("base64")}`,
    },
  });
  if (!response.ok) return { configured: true, matched: false, company: null };
  const body = await response.json();
  const item = body.items?.[0];
  if (!item) return { configured: true, matched: false, company: null };
  return {
    configured: true,
    matched: true,
    company: {
      name: item.title,
      number: item.company_number,
      status: item.company_status,
    },
  };
}
