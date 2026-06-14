export const demoClients: Array<{
  id: string;
  businessName: string;
  contactName: string;
  niche: string;
  city: string;
  retainer: number;
  leadTarget: number;
  leadsThisMonth: number;
  invoiceStatus: string;
  status: string;
}> = [];

export const demoProspects: Array<{
  id: string;
  businessName: string;
  contactName: string;
  niche: string;
  city: string;
  stage: string;
  value: number;
  lastContact: string;
}> = [];

export const demoLeads: Array<{
  id: string;
  name: string;
  client: string;
  quality: string;
  source: string;
  status: string;
  phone: string;
  date: string;
}> = [];

export const demoInvoices: Array<{
  id: string;
  client: string;
  amount: number;
  status: string;
  due: string;
}> = [];

export const demoCampaigns: Array<{
  name: string;
  client: string;
  platform: string;
  status: string;
  leads: number;
  openRate: number;
  replyRate: number;
  cpl: number;
}> = [];

export const mrrTrend = [
  { month: "Jan", mrr: 0, leads: 0 },
  { month: "Feb", mrr: 0, leads: 0 },
  { month: "Mar", mrr: 0, leads: 0 },
  { month: "Apr", mrr: 0, leads: 0 },
  { month: "May", mrr: 0, leads: 0 },
  { month: "Jun", mrr: 0, leads: 0 },
];

export const clientLeadChart: Array<{ client: string; delivered: number; target: number }> = [];

export const vaultPolicy = [
  { key: "tax", name: "Tax Reserve", percentage: 30, balance: 0, description: "HMRC/VAT/corporation-tax reserve. Do not withdraw for owner pay." },
  { key: "insurance", name: "Insurance", percentage: 5, balance: 0, description: "Professional indemnity, cyber, public liability and related cover." },
  { key: "ops", name: "Operations", percentage: 20, balance: 0, description: "Software, ads, contractors, tools and fulfilment costs." },
  { key: "growth", name: "Growth", percentage: 10, balance: 0, description: "Cash buffer, reinvestment and slow-month protection." },
  { key: "owner", name: "Owner Pay", percentage: 35, balance: 0, description: "Emdadul's available pay after reserves have been allocated." },
];

export const moneyLedger: Array<{
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
  reference: string;
}> = [];
