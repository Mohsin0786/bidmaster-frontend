'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requirementSchema, type RequirementFormData } from '@/lib/validations';
import { requirementService } from '@/services/requirement.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, Plus } from 'lucide-react';

interface RequirementFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<RequirementFormData>;
  onSubmit: (data: RequirementFormData) => Promise<void>;
  onCancel?: () => void;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ 
  mode, 
  initialData, 
  onSubmit,
  onCancel 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');

  const form = useForm<RequirementFormData>({
    resolver: zodResolver(requirementSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      currency: initialData?.currency || 'INR',
      ceilingPrice: initialData?.ceilingPrice || 0,
      minDecrement: initialData?.minDecrement || 1,
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || '',
      status: initialData?.status || 'DRAFT',
      ...initialData,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments([...attachments, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const addParticipant = () => {
    if (newParticipant && newParticipant.includes('@')) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter(p => p !== email));
  };

  const handleSubmit = async (data: RequirementFormData) => {
    setError(null);
    setLoading(true);

    try {
      // Clean up draft data so backend Joi validation doesn't fail on empty/default values
      if (data.status === 'DRAFT') {
        if (!data.ceilingPrice || data.ceilingPrice <= 0) delete data.ceilingPrice;
        if (!data.minDecrement || data.minDecrement <= 0) delete data.minDecrement;
        if (!data.startTime) delete data.startTime;
        if (!data.endTime) delete data.endTime;
      }

      const formData: RequirementFormData = {
        ...data,
        attachments: attachments.length > 0 ? attachments : undefined,
        participants: participants.length > 0 ? participants : undefined,
      };

      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to save requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create New Requirement' : 'Edit Requirement'}
        </CardTitle>
        <CardDescription>
          Fill in the details for your {mode === 'create' ? 'new' : ''} requirement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter requirement title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your requirement in detail" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development, Design" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ceilingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ceiling Price (INR)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="100000" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minDecrement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Decrement (INR)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="100" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="button" onClick={nextStep} className="w-full">
                  Next
                </Button>
              </div>
            )}
            
            {/* Step 2: Timeline */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date & Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1">
                    Next
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Attachments & Participants */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <FormLabel>Attachments (Optional)</FormLabel>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-500">
                          Click to upload files
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
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-gray-100 rounded"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Participants */}
                <div>
                  <FormLabel>Invite Participants (Optional)</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Enter email address"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                    />
                    <Button type="button" onClick={addParticipant}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {participants.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {participants.map((email, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-gray-100 rounded"
                        >
                          <span className="text-sm">{email}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParticipant(email)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    disabled={loading} 
                    variant="secondary"
                    className="flex-[1.5] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    onClick={() => {
                      form.setValue('status', 'DRAFT');
                      form.handleSubmit(handleSubmit as any)();
                    }}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save as Draft
                  </Button>
                  <Button 
                    type="button" 
                    disabled={loading} 
                    className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    onClick={() => {
                      form.setValue('status', 'ACTIVE');
                      form.handleSubmit(handleSubmit as any)();
                    }}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Bid Event
                  </Button>
                </div>
              </div>
            )}
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

export default RequirementForm;