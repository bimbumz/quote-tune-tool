import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, CreditCard } from 'lucide-react';
import { CalculationResults } from '../types/pricing';

interface ResultsDisplayProps {
  results: CalculationResults | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
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
            <p>Configure pricing model to see calculations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;