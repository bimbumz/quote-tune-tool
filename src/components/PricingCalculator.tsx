import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import { clientTypes } from '../data/clientTypes';
import { calculatePricing } from '../utils/pricingCalculator';
import { ClientType, CalculationInputs, CalculationResults } from '../types/pricing';

const PricingCalculator = () => {
  const [selectedClientType, setSelectedClientType] = useState<ClientType | null>(null);
  const [inputs, setInputs] = useState<CalculationInputs>({
    monthlyVolume: 1000000,
    transactionCount: 5000,
    averageTransactionValue: 200,
    corridorCount: 1,
    userCount: 1000,
    apiCalls: 10000
  });
  const [results, setResults] = useState<CalculationResults | null>(null);

  useEffect(() => {
    if (selectedClientType) {
      const calculatedResults = calculatePricing(selectedClientType.pricingModel, inputs);
      setResults(calculatedResults);
    }
  }, [selectedClientType, inputs]);

  const handleInputChange = (field: keyof CalculationInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Pricing Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your client type and adjust parameters to calculate pricing and revenue projections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Type Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Client Type
                </CardTitle>
                <CardDescription>
                  Choose the type of client for pricing calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={(value) => {
                  const client = clientTypes.find(ct => ct.id === value);
                  setSelectedClientType(client || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientTypes.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {client.pricingModel.transactionType}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedClientType && (
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Risk Level:</span>
                      <Badge variant={getRiskBadgeVariant(selectedClientType.riskLevel)}>
                        {selectedClientType.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Pricing Model:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedClientType.pricingModel.description}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Notes:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedClientType.pricingModel.notes}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Input Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Parameters
                </CardTitle>
                <CardDescription>
                  Adjust the values to see pricing changes
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
                    onValueChange={(value) => handleInputChange('monthlyVolume', value[0])}
                    max={10000000}
                    min={10000}
                    step={50000}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={inputs.monthlyVolume}
                    onChange={(e) => handleInputChange('monthlyVolume', Number(e.target.value))}
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
                    onValueChange={(value) => handleInputChange('transactionCount', value[0])}
                    max={100000}
                    min={100}
                    step={500}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={inputs.transactionCount}
                    onChange={(e) => handleInputChange('transactionCount', Number(e.target.value))}
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
                    onValueChange={(value) => handleInputChange('averageTransactionValue', value[0])}
                    max={5000}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={inputs.averageTransactionValue}
                    onChange={(e) => handleInputChange('averageTransactionValue', Number(e.target.value))}
                    className="text-sm"
                  />
                </div>

                {/* Conditional Parameters */}
                {selectedClientType?.pricingModel.parameters.corridorFee && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Corridor Count: {inputs.corridorCount}
                    </Label>
                    <Slider
                      value={[inputs.corridorCount || 1]}
                      onValueChange={(value) => handleInputChange('corridorCount', value[0])}
                      max={20}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                {selectedClientType?.category === 'neobank' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      User Count: {formatNumber(inputs.userCount || 1000)}
                    </Label>
                    <Slider
                      value={[inputs.userCount || 1000]}
                      onValueChange={(value) => handleInputChange('userCount', value[0])}
                      max={50000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Results
                </CardTitle>
                <CardDescription>
                  Calculated pricing and revenue breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-4">
                    {/* Main Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(results.monthlyRevenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                      </div>
                      <div className="p-3 bg-accent/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-accent">
                          {formatCurrency(results.perTransactionCost)}
                        </div>
                        <div className="text-sm text-muted-foreground">Per Transaction</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Fee Breakdown</h4>
                      
                      {results.breakdown.fixedFees > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Fixed Fees</span>
                          <span className="font-medium">{formatCurrency(results.breakdown.fixedFees)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.variableFees > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Transaction Fees</span>
                          <span className="font-medium">{formatCurrency(results.breakdown.variableFees)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.volumeFees > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Volume Fees</span>
                          <span className="font-medium">{formatCurrency(results.breakdown.volumeFees)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.additionalFees > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Additional Fees</span>
                          <span className="font-medium">{formatCurrency(results.breakdown.additionalFees)}</span>
                        </div>
                      )}

                      <Separator />
                      
                      <div className="flex justify-between font-medium">
                        <span>Total Revenue</span>
                        <span className="text-primary">{formatCurrency(results.totalFees)}</span>
                      </div>
                    </div>

                    {/* Annual Projection */}
                    <div className="p-3 bg-success/10 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold text-success">
                          {formatCurrency(results.monthlyRevenue * 12)}
                        </div>
                        <div className="text-sm text-muted-foreground">Annual Revenue Projection</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a client type to see pricing calculations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;