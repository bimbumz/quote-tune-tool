import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Users } from 'lucide-react';
import { clientTypes } from '../data/clientTypes';
import { calculatePricing } from '../utils/pricingCalculator';
import { ClientType, CalculationInputs as InputsType, CalculationResults, PricingModel } from '../types/pricing';
import PricingModelEditor from './PricingModelEditor';
import CalculationInputsComponent from './CalculationInputs';
import ResultsDisplay from './ResultsDisplay';

const PricingCalculator = () => {
  const [selectedClientType, setSelectedClientType] = useState<ClientType | null>(null);
  const [customPricingModel, setCustomPricingModel] = useState<PricingModel | null>(null);
  const [inputs, setInputs] = useState<InputsType>({
    monthlyVolume: 1000000,
    transactionCount: 5000,
    averageTransactionValue: 200,
    corridorCount: 1,
    userCount: 1000,
    apiCalls: 10000
  });
  const [results, setResults] = useState<CalculationResults | null>(null);

  useEffect(() => {
    const pricingModel = customPricingModel || selectedClientType?.pricingModel;
    if (pricingModel) {
      const calculatedResults = calculatePricing(pricingModel, inputs);
      setResults(calculatedResults);
    } else {
      setResults(null);
    }
  }, [selectedClientType, customPricingModel, inputs]);

  const handleInputChange = (field: keyof InputsType, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientTypeChange = (clientId: string) => {
    const client = clientTypes.find(ct => ct.id === clientId);
    setSelectedClientType(client || null);
    // Create a copy of the pricing model for editing
    if (client) {
      setCustomPricingModel({ ...client.pricingModel });
    }
  };

  const handlePricingModelChange = (model: PricingModel) => {
    setCustomPricingModel(model);
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Client Type Selection */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Client Type
                </CardTitle>
                <CardDescription>
                  Choose a base client type to start with
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleClientTypeChange}>
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
                      <span className="text-sm font-medium">Category:</span>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">
                        {selectedClientType.category.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Model Editor */}
          <div className="xl:col-span-1">
            <PricingModelEditor
              pricingModel={customPricingModel}
              onModelChange={handlePricingModelChange}
            />
          </div>

          {/* Calculation Inputs */}
          <div className="xl:col-span-1">
            <CalculationInputsComponent
              inputs={inputs}
              onInputChange={handleInputChange}
              pricingModel={customPricingModel}
            />
          </div>

          {/* Results */}
          <div className="xl:col-span-1">
            <ResultsDisplay results={results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;