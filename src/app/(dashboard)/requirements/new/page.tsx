'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RequirementForm from '@/components/forms/RequirementForm';
import { requirementService } from '@/services/requirement.service';
import { RequirementFormData } from '@/lib/validations';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateRequirementPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (data: RequirementFormData) => {
    try {
      const newReq = await requirementService.createRequirement(data);
      router.push(`/requirements/${newReq._id}`);
    } catch (error: any) {
      console.error('Failed to create requirement:', error);
      throw error;
    }
  };

  // Restrict to Buyers
  if (user && !user.roles.includes('Buyer')) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          Only users with the Buyer role can create new requirements.
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 relative">
      <Button
        variant="ghost"
        className="mb-6 -ml-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Post a New Requirement</h1>
        <p className="text-muted-foreground mt-2">
          Create a reverse bidding event and invite sellers to get the best competitive offers.
        </p>
      </div>

      <div className="flex justify-center">
        <RequirementForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
