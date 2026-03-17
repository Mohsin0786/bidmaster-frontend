'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bidSchema, type BidFormData } from '@/lib/validations';
import { bidService } from '@/services/bid.service';
import { Bid, Requirement } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, Info } from 'lucide-react';

interface BidFormProps {
  requirement: Requirement;
  currentBestBid?: Bid;
  onSubmit: (data: BidFormData) => Promise<void>;
  onCancel?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ 
  requirement, 
  currentBestBid, 
  onSubmit,
  onCancel 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  // Calculate suggested price (current best bid - minimum decrement)
  useEffect(() => {
    if (currentBestBid && requirement.minDecrement) {
      const suggested = currentBestBid.offeredPrice - requirement.minDecrement;
      setSuggestedPrice(suggested > 0 ? suggested : currentBestBid.offeredPrice);
    } else if (requirement.ceilingPrice) {
      // If no bids yet, suggest starting at ceiling price
      setSuggestedPrice(requirement.ceilingPrice);
    }
  }, [currentBestBid, requirement.ceilingPrice, requirement.minDecrement]);

  const form = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      offeredPrice: suggestedPrice || 0,
      deliveryDays: undefined,
      notes: '',
    },
  });

  const { watch, setValue } = form;
  const watchedPrice = watch('offeredPrice');

  // Validate price against requirements
  useEffect(() => {
    if (watchedPrice > 0) {
      // Check if price is below ceiling
      if (watchedPrice > requirement.ceilingPrice) {
        setError(`Price cannot exceed the ceiling price of ₹${requirement.ceilingPrice.toLocaleString()}`);
      } 
      // Check if price is above current best bid (if exists)
      else if (currentBestBid && watchedPrice >= currentBestBid.offeredPrice) {
        setError(`Your bid must be lower than the current best bid of ₹${currentBestBid.offeredPrice.toLocaleString()}`);
      }
      // Check minimum decrement
      else if (currentBestBid && requirement.minDecrement && watchedPrice < (currentBestBid.offeredPrice - requirement.minDecrement)) {
        setError(`Your bid must be at least ₹${requirement.minDecrement} lower than the current best bid`);
      } else {
        setError(null);
      }
    }
  }, [watchedPrice, requirement.ceilingPrice, currentBestBid, requirement.minDecrement]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments([...attachments, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: BidFormData) => {
    setError(null);
    setLoading(true);

    try {
      const bidData: BidFormData = {
        ...data,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      await onSubmit(bidData);
    } catch (err: any) {
      setError(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Place Your Bid</CardTitle>
        <CardDescription>
          Submit your best offer for this requirement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Current Best Bid Info */}
            {currentBestBid && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-medium">Current Best Bid</span>
                </div>
                <p className="text-2xl font-bold text-blue-800 mt-1">
                  ₹{currentBestBid.offeredPrice.toLocaleString()}
                </p>
                {currentBestBid.deliveryDays && (
                  <p className="text-sm text-blue-600">
                    Delivery: {currentBestBid.deliveryDays} days
                  </p>
                )}
              </div>
            )}
            
            {/* Price Input */}
            <FormField
              control={form.control}
              name="offeredPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Bid Price (INR)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter your bid amount"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Suggested Price */}
            {suggestedPrice && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setValue('offeredPrice', suggestedPrice)}
              >
                Suggest: ₹{suggestedPrice.toLocaleString()}
              </Button>
            )}
            
            {/* Delivery Days */}
            <FormField
              control={form.control}
              name="deliveryDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Days (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Estimated delivery time"
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes or comments about your bid"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* File Upload */}
            <div>
              <FormLabel>Attachments (Optional)</FormLabel>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload files
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm"
                    >
                      <span className="truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !!error}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Bid...
                </>
              ) : (
                'Place Bid'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {onCancel && (
        <CardFooter className="justify-center">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BidForm;