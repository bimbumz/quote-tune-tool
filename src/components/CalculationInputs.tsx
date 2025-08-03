import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';
import { CalculationInputs as InputsType, PricingModel } from '../types/pricing';

interface CalculationInputsProps {
  inputs: InputsType;
  onInputChange: (field: keyof InputsType, value: number) => void;
  pricingModel: PricingModel | null;
}

const CalculationInputs: React.FC<CalculationInputsProps> = ({
  inputs,
  onInputChange,
  pricingModel
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Calculation Parameters
        </CardTitle>
        <CardDescription>
          Adjust transaction volume and frequency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Volume */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Monthly Volume: {formatCurrency(inputs.monthlyVolume)}
          </Label>
          <Slider
            value={[inputs.monthlyVolume]}
            onValueChange={(value) => onInputChange('monthlyVolume', value[0])}
            max={10000000}
            min={10000}
            step={50000}
            className="w-full"
          />
          <Input
            type="number"
            value={inputs.monthlyVolume}
            onChange={(e) => onInputChange('monthlyVolume', Number(e.target.value))}
            className="text-sm"
          />
        </div>

        {/* Transaction Count */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Monthly Transactions: {formatNumber(inputs.transactionCount)}
          </Label>
          <Slider
            value={[inputs.transactionCount]}
            onValueChange={(value) => onInputChange('transactionCount', value[0])}
            max={100000}
            min={100}
            step={500}
            className="w-full"
          />
          <Input
            type="number"
            value={inputs.transactionCount}
            onChange={(e) => onInputChange('transactionCount', Number(e.target.value))}
            className="text-sm"
          />
        </div>

        {/* Average Transaction Value */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Avg Transaction: {formatCurrency(inputs.averageTransactionValue)}
          </Label>
          <Slider
            value={[inputs.averageTransactionValue]}
            onValueChange={(value) => onInputChange('averageTransactionValue', value[0])}
            max={5000}
            min={10}
            step={10}
            className="w-full"
          />
          <Input
            type="number"
            value={inputs.averageTransactionValue}
            onChange={(e) => onInputChange('averageTransactionValue', Number(e.target.value))}
            className="text-sm"
          />
        </div>

        {/* Conditional Parameters */}
        {pricingModel?.parameters.corridorFee && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Corridor Count: {inputs.corridorCount}
            </Label>
            <Slider
              value={[inputs.corridorCount || 1]}
              onValueChange={(value) => onInputChange('corridorCount', value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            User Count: {formatNumber(inputs.userCount || 1000)}
          </Label>
          <Slider
            value={[inputs.userCount || 1000]}
            onValueChange={(value) => onInputChange('userCount', value[0])}
            max={50000}
            min={100}
            step={100}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationInputs;