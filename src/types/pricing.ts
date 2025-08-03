export interface PricingModel {
  id: string;
  name: string;
  transactionType: string;
  description: string;
  baseStructure: 'per_transaction' | 'percentage' | 'fixed_monthly' | 'hybrid' | 'tiered';
  parameters: {
    fixedFee?: number;
    percentageFee?: number;
    minimumFee?: number;
    maximumFee?: number;
    monthlyFee?: number;
    perTransactionFee?: number;
    setupFee?: number;
    retainerFee?: number;
    corridorFee?: number;
  };
  volumeDiscounts?: {
    threshold: number;
    discountPercentage: number;
  }[];
  notes: string;
}

export interface ClientType {
  id: string;
  name: string;
  category: 'financial_institution' | 'crypto' | 'b2b_payments' | 'payroll' | 'corporate' | 'saas' | 'real_estate' | 'neobank' | 'remittance' | 'other';
  pricingModel: PricingModel;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CalculationInputs {
  monthlyVolume: number;
  transactionCount: number;
  averageTransactionValue: number;
  corridorCount?: number;
  userCount?: number;
  apiCalls?: number;
}

export interface CalculationResults {
  monthlyRevenue: number;
  perTransactionCost: number;
  totalFees: number;
  breakdown: {
    fixedFees: number;
    variableFees: number;
    volumeFees: number;
    additionalFees: number;
  };
}