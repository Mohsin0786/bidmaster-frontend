'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { userRegistrationSchema, type UserRegistrationData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, redirectTo }) => {
  const router = useRouter();
  const { register, firebaseUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const form = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      pincode: '',
      gstNo: '',
      designation: '',
      industry: '',
      dob: '',
    },
  });

  useEffect(() => {
    if (firebaseUser) {
      if (firebaseUser.displayName) {
        const names = firebaseUser.displayName.split(' ');
        form.setValue('firstName', names[0] || '', { shouldValidate: true });
        if (names.length > 1) {
          form.setValue('lastName', names.slice(1).join(' '), { shouldValidate: true });
        }
      }
    }
  }, [firebaseUser, form]);

  const onSubmit = async (data: UserRegistrationData) => {
    setError(null);
    setLoading(true);

    try {
      await register(data);
      
      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    // Validate only Step 1 fields before allowing moving to Step 2
    const fieldsToValidate: (keyof UserRegistrationData)[] = ['firstName', 'lastName', 'phone', 'dob'];
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    })
  };

  const direction = currentStep === 1 ? -1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-neutral-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-primary/60"
            initial={{ width: '50%' }}
            animate={{ width: currentStep === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <CardHeader className="space-y-3 pb-6 pt-8 text-center relative">
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
            Complete Registration
          </CardTitle>
          <CardDescription className="text-base">
            Step {currentStep} of {totalSteps}: {currentStep === 1 ? 'Personal Details' : 'Business & Contact'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 overflow-hidden relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full relative">
              <AnimatePresence custom={direction} mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute w-full space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-neutral-700">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" className="h-12 bg-neutral-50/50" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-neutral-700">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" className="h-12 bg-neutral-50/50" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-neutral-700">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="9876543210" className="h-12 bg-neutral-50/50" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-neutral-700">Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" className="h-12 bg-neutral-50/50 cursor-text" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        onClick={nextStep} 
                        className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute w-full space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-neutral-700">Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, State" className="h-12 bg-neutral-50/50" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-neutral-700">Pincode</FormLabel>
                            <FormControl>
                              <Input placeholder="123456" className="h-12 bg-neutral-50/50" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gstNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-neutral-700">GST Number</FormLabel>
                            <FormControl>
                              <Input placeholder="22AAAAA0000A1Z5" className="h-12 bg-neutral-50/50 uppercase" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-neutral-700">Designation</FormLabel>
                            <FormControl>
                              <Input placeholder="Manager" className="h-12 bg-neutral-50/50" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-neutral-700">Industry</FormLabel>
                            <FormControl>
                              <Input placeholder="Technology" className="h-12 bg-neutral-50/50" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="button" 
                        onClick={prevStep} 
                        variant="outline" 
                        className="flex-[0.4] h-12 text-base font-semibold group"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="flex-[0.6] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center">
                          {loading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Completing...</>
                          ) : 'Complete Registration'}
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8 border-t border-neutral-100 pt-6 mt-8">
          <p className="text-sm text-neutral-500">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Sign in
            </a>
          </p>
          
          <button 
            type="button"
            onClick={async () => {
              const { auth } = await import('@/lib/firebase');
              await auth.signOut();
              localStorage.removeItem('accessToken');
              window.location.href = '/login';
            }}
            className="text-xs text-red-500/80 hover:text-red-500 hover:underline transition-colors"
          >
            Not you? Sign out and use a different account
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;