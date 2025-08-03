import { ClientType } from '../types/pricing';

export const clientTypes: ClientType[] = [
  {
    id: 'psp_merchants',
    name: 'Financial Institution (PSP with Merchants)',
    category: 'financial_institution',
    riskLevel: 'medium',
    pricingModel: {
      id: 'psp_per_tx',
      name: 'Per Transaction Pricing',
      transactionType: 'C2B/B2C Pay-ins and Payouts',
      description: 'High-frequency transactions with merchant settlement models',
      baseStructure: 'per_transaction',
      parameters: {
        perTransactionFee: 0.25,
        minimumFee: 0.20,
        maximumFee: 0.30
      },
      volumeDiscounts: [
        { threshold: 10000, discountPercentage: 5 },
        { threshold: 50000, discountPercentage: 10 },
        { threshold: 100000, discountPercentage: 15 }
      ],
      notes: 'High-frequency tx; supports merchant settlement models'
    }
  },
  {
    id: 'b2b_no_minimum',
    name: 'Financial Institution (B2B Only)',
    category: 'financial_institution',
    riskLevel: 'low',
    pricingModel: {
      id: 'b2b_volume',
      name: 'Volume-Based Fee',
      transactionType: 'B2B Payments (Pooled Accounts, Acquiring Settlements)',
      description: 'Great for infrequent volume clients with scalable structure',
      baseStructure: 'percentage',
      parameters: {
        percentageFee: 0.15,
        minimumFee: 0
      },
      notes: 'Great for infrequent volume clients; scalable structure'
    }
  },
  {
    id: 'b2b_low_mid_risk',
    name: 'B2B Payments Client (Low-Mid Risk)',
    category: 'b2b_payments',
    riskLevel: 'low',
    pricingModel: {
      id: 'b2b_fixed',
      name: 'Fixed Monthly Fee',
      transactionType: 'B2B Payments Only',
      description: 'Predictable billing for stable volume companies',
      baseStructure: 'fixed_monthly',
      parameters: {
        monthlyFee: 3500,
        minimumFee: 2000,
        maximumFee: 5000
      },
      notes: 'Predictable billing; ideal for stable volume companies'
    }
  },
  {
    id: 'crypto_platform',
    name: 'Crypto Platform (CEX, OTC, Custody)',
    category: 'crypto',
    riskLevel: 'high',
    pricingModel: {
      id: 'crypto_risk_premium',
      name: 'Base + Risk Premium',
      transactionType: 'High-Volume Crypto Transactions',
      description: 'Volatile volume with high compliance costs',
      baseStructure: 'hybrid',
      parameters: {
        percentageFee: 0.25,
        retainerFee: 3000,
        minimumFee: 1000,
        maximumFee: 5000
      },
      notes: 'Volatile volume; compliance costs high; use base + % fee'
    }
  },
  {
    id: 'gambling_affiliate',
    name: 'Affiliate/Gambling/Forex Network',
    category: 'other',
    riskLevel: 'high',
    pricingModel: {
      id: 'affiliate_payouts',
      name: 'Per Payout + Minimum',
      transactionType: 'Small Payouts to Affiliates/Users',
      description: 'AML/KYC overhead with higher per-transaction pricing',
      baseStructure: 'hybrid',
      parameters: {
        perTransactionFee: 0.425,
        minimumFee: 0.35,
        maximumFee: 0.50,
        monthlyFee: 1000
      },
      notes: 'AML/KYC overhead; price higher per tx, with base floor'
    }
  },
  {
    id: 'payroll_provider',
    name: 'Payroll Provider / Gig Economy Platform',
    category: 'payroll',
    riskLevel: 'low',
    pricingModel: {
      id: 'payroll_bulk',
      name: 'Base + Per Transaction',
      transactionType: 'High-Frequency Payroll Payouts',
      description: 'End-of-cycle bulk transactions with optional SLA premiums',
      baseStructure: 'hybrid',
      parameters: {
        monthlyFee: 500,
        perTransactionFee: 0.25
      },
      notes: 'End-of-cycle bulk tx; SLA pricing for urgent disbursements'
    }
  },
  {
    id: 'corporate_intl',
    name: 'Corporate Client with Intl Supply Chain',
    category: 'corporate',
    riskLevel: 'low',
    pricingModel: {
      id: 'corridor_volume',
      name: 'Corridor + Volume Fee',
      transactionType: 'Large-Value Cross-Border B2B',
      description: 'Multi-currency corridors with optional FX margin',
      baseStructure: 'hybrid',
      parameters: {
        corridorFee: 250,
        percentageFee: 0.1
      },
      notes: 'Multi-currency corridors; optional FX margin play'
    }
  },
  {
    id: 'saas_embedded',
    name: 'SaaS Platform with Embedded Payments',
    category: 'saas',
    riskLevel: 'low',
    pricingModel: {
      id: 'revenue_share',
      name: 'Revenue Share + API Tier',
      transactionType: 'Embedded Payments (API-based)',
      description: 'SaaS monetizing payments with revenue share model',
      baseStructure: 'hybrid',
      parameters: {
        percentageFee: 0.15,
        monthlyFee: 1250,
        minimumFee: 500,
        maximumFee: 2000
      },
      notes: 'SaaS monetizing payments; revenue share and user KYB fees'
    }
  },
  {
    id: 'real_estate',
    name: 'Real Estate or Investment Fund Manager',
    category: 'real_estate',
    riskLevel: 'low',
    pricingModel: {
      id: 'large_transfer',
      name: 'Per Transfer + Tiered Volume',
      transactionType: 'Infrequent Large B2B Transfers',
      description: 'Suitable for capital calls and investor redemptions',
      baseStructure: 'tiered',
      parameters: {
        perTransactionFee: 30,
        minimumFee: 10,
        maximumFee: 50,
        percentageFee: 0.15
      },
      notes: 'Suitable for capital calls, investor redemptions'
    }
  },
  {
    id: 'neobank_emi',
    name: 'Neobank or E-money Licensee',
    category: 'neobank',
    riskLevel: 'medium',
    pricingModel: {
      id: 'account_tx_model',
      name: 'Per Account + Per Transaction',
      transactionType: 'Mixed B2B/B2C Transactions',
      description: 'White-label setup with base fees plus per user/transaction',
      baseStructure: 'hybrid',
      parameters: {
        monthlyFee: 5000,
        perTransactionFee: 0.20
      },
      notes: 'White-label style setup; base fees + per user or tx'
    }
  }
];