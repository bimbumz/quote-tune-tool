import { CalculationInputs, CalculationResults, PricingModel } from '../types/pricing';

export const calculatePricing = (
  pricingModel: PricingModel,
  inputs: CalculationInputs
): CalculationResults => {
  const { 
    monthlyVolume, 
    transactionCount, 
    corridorCount = 1, 
    userCount = 1000,
    apiCalls = 0 
  } = inputs;

  let monthlyRevenue = 0;
  let fixedFees = 0;
  let variableFees = 0;
  let volumeFees = 0;
  let additionalFees = 0;

  const params = pricingModel.parameters;

  // Calculate base fees based on pricing structure
  switch (pricingModel.baseStructure) {
    case 'per_transaction':
      let perTxFee = params.perTransactionFee || 0;
      
      // Apply volume discounts if available
      if (pricingModel.volumeDiscounts) {
        for (const discount of pricingModel.volumeDiscounts) {
          if (transactionCount >= discount.threshold) {
            perTxFee = perTxFee * (1 - discount.discountPercentage / 100);
          }
        }
      }
      
      variableFees = transactionCount * perTxFee;
      break;

    case 'percentage':
      volumeFees = monthlyVolume * (params.percentageFee || 0) / 100;
      break;

    case 'fixed_monthly':
      fixedFees = params.monthlyFee || 0;
      break;

    case 'hybrid':
      // Combination of fixed and variable fees
      if (params.monthlyFee) fixedFees += params.monthlyFee;
      if (params.perTransactionFee) variableFees += transactionCount * params.perTransactionFee;
      if (params.percentageFee) volumeFees += monthlyVolume * params.percentageFee / 100;
      if (params.corridorFee) additionalFees += corridorCount * params.corridorFee;
      if (params.retainerFee) fixedFees += params.retainerFee;
      break;

    case 'tiered':
      // Base transaction fee
      if (params.perTransactionFee) variableFees += transactionCount * params.perTransactionFee;
      
      // Tiered volume fee with progressive rates
      let remainingVolume = monthlyVolume;
      const tier1 = Math.min(remainingVolume, 100000);
      volumeFees += tier1 * (params.percentageFee || 0) / 100;
      
      remainingVolume -= tier1;
      if (remainingVolume > 0) {
        const tier2 = Math.min(remainingVolume, 400000);
        volumeFees += tier2 * ((params.percentageFee || 0) * 0.8) / 100; // 20% discount for tier 2
        
        remainingVolume -= tier2;
        if (remainingVolume > 0) {
          volumeFees += remainingVolume * ((params.percentageFee || 0) * 0.6) / 100; // 40% discount for tier 3
        }
      }
      break;
  }

  // Apply minimum and maximum fee constraints
  let totalVariableAndVolume = variableFees + volumeFees;
  
  if (params.minimumFee && totalVariableAndVolume < params.minimumFee) {
    const adjustment = params.minimumFee - totalVariableAndVolume;
    additionalFees += adjustment;
    totalVariableAndVolume = params.minimumFee;
  }
  
  if (params.maximumFee && totalVariableAndVolume > params.maximumFee) {
    const reduction = totalVariableAndVolume - params.maximumFee;
    variableFees = Math.max(0, variableFees - reduction);
    totalVariableAndVolume = params.maximumFee;
  }

  monthlyRevenue = fixedFees + variableFees + volumeFees + additionalFees;

  const perTransactionCost = transactionCount > 0 ? monthlyRevenue / transactionCount : 0;

  return {
    monthlyRevenue,
    perTransactionCost,
    totalFees: monthlyRevenue,
    breakdown: {
      fixedFees,
      variableFees,
      volumeFees,
      additionalFees
    }
  };
};