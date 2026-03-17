'use client';

import React, { Suspense } from 'react';
import RegisterForm from '@/components/forms/RegisterForm';
import { useSearchParams } from 'next/navigation';

const RegisterContent: React.FC = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract decorative elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">BiddingMaster</h1>
          <p className="mt-2 text-sm text-neutral-500 font-medium tracking-wide">JOIN THE PREMIER BIDDING NETWORK</p>
        </div>
        <RegisterForm redirectTo={redirect || '/dashboard'} />
      </div>
    </div>
  );
};

const RegisterPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
};

export default RegisterPage;