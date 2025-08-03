import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { PricingModel } from '../types/pricing';

interface PricingModelEditorProps {
  pricingModel: PricingModel | null;
  onModelChange: (model: PricingModel) => void;
}

const PricingModelEditor: React.FC<PricingModelEditorProps> = ({
  pricingModel,
  onModelChange
}) => {
  if (!pricingModel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Pricing Model
          </CardTitle>
          <CardDescription>
            Select a client type to edit pricing parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No pricing model selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const updateParameter = (key: string, value: number | undefined) => {
    const updatedModel = {
      ...pricingModel,
      parameters: {
        ...pricingModel.parameters,
        [key]: value || undefined
      }
    };
    onModelChange(updatedModel);
  };

  const updateBaseStructure = (baseStructure: PricingModel['baseStructure']) => {
    const updatedModel = {
      ...pricingModel,
      baseStructure
    };
    onModelChange(updatedModel);
  };

  const toggleParameter = (key: string, enabled: boolean, defaultValue: number = 0) => {
    if (enabled) {
      updateParameter(key, defaultValue);
    } else {
      updateParameter(key, undefined);
    }
  };

  const formatParameterName = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .replace('Fee', ' Fee');
  };

  const getParameterSuffix = (key: string) => {
    if (key.includes('percentage') || key.includes('Percentage')) return '%';
    if (key.includes('fee') || key.includes('Fee')) return '€';
    return '';
  };

  const parameterKeys = [
    'fixedFee',
    'percentageFee', 
    'minimumFee',
    'maximumFee',
    'monthlyFee',
    'perTransactionFee',
    'setupFee',
    'retainerFee',
    'corridorFee'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Pricing Model Editor
        </CardTitle>
        <CardDescription>
          Customize pricing structure and parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Structure Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Base Pricing Structure</Label>
          <Select 
            value={pricingModel.baseStructure} 
            onValueChange={updateBaseStructure}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per_transaction">Per Transaction</SelectItem>
              <SelectItem value="percentage">Percentage Based</SelectItem>
              <SelectItem value="fixed_monthly">Fixed Monthly</SelectItem>
              <SelectItem value="hybrid">Hybrid (Multiple Fees)</SelectItem>
              <SelectItem value="tiered">Tiered Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Fee Parameters */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Fee Parameters</Label>
          
          {parameterKeys.map(key => {
            const isEnabled = pricingModel.parameters[key as keyof typeof pricingModel.parameters] !== undefined;
            const value = pricingModel.parameters[key as keyof typeof pricingModel.parameters] || 0;
            
            return (
              <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => toggleParameter(key, checked, key === 'percentageFee' ? 0.1 : 100)}
                />
                <div className="flex-1">
                  <Label className="text-sm">{formatParameterName(key)}</Label>
                </div>
                {isEnabled && (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => updateParameter(key, Number(e.target.value))}
                      className="w-24 text-sm"
                      step={key === 'percentageFee' ? '0.01' : '1'}
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground w-4">
                      {getParameterSuffix(key)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Model Details */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Model Information</Label>
          <div className="space-y-2">
            <Input
              placeholder="Pricing model name"
              value={pricingModel.name}
              onChange={(e) => onModelChange({
                ...pricingModel,
                name: e.target.value
              })}
            />
            <Input
              placeholder="Transaction type"
              value={pricingModel.transactionType}
              onChange={(e) => onModelChange({
                ...pricingModel,
                transactionType: e.target.value
              })}
            />
            <textarea
              className="w-full p-2 border rounded-md text-sm resize-none"
              rows={2}
              placeholder="Description"
              value={pricingModel.description}
              onChange={(e) => onModelChange({
                ...pricingModel,
                description: e.target.value
              })}
            />
            <textarea
              className="w-full p-2 border rounded-md text-sm resize-none"
              rows={2}
              placeholder="Notes"
              value={pricingModel.notes}
              onChange={(e) => onModelChange({
                ...pricingModel,
                notes: e.target.value
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingModelEditor;