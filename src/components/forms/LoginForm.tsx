'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectTo }) => {
  const router = useRouter();
  const { login, signupWithEmail, loginWithGoogle, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(isSignUp ? signupSchema : loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (signupWithEmail) {
          await signupWithEmail(data.email, data.password);
        } else {
          throw new Error('Sign up function is not available.');
        }
      } else {
        await login(data.email, data.password);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'login'}. Please check your credentials.`);
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google. Please try again.');
      setGoogleLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router, onSuccess, redirectTo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <motion.div
            key={isSignUp ? 'signup-title' : 'login-title'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isSignUp 
                ? 'Join our modern reverse bidding platform' 
                : 'Enter your credentials to access your account'}
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-neutral-700">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        className="h-12 bg-neutral-50/50 border-neutral-200 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="font-semibold text-neutral-700">Password</FormLabel>
                      {!isSignUp && (
                        <a href="#" className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors">
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={isSignUp ? "Must be at least 6 characters" : "••••••••"} 
                        className="h-12 bg-neutral-50/50 border-neutral-200 focus-visible:ring-primary transition-all duration-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                disabled={loading || googleLoading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {isSignUp ? 'Creating module...' : 'Authenticating...'}</>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </span>
              </Button>
            </form>
          </Form>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="flex-shrink-0 mx-4 text-sm text-neutral-400 font-medium">
              or continue with
            </span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 font-medium transition-all duration-300 hover:shadow-md"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 h-5 w-5" />
            )}
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 border-t border-neutral-100 pt-6">
          <p className="text-neutral-500">
            {isSignUp ? 'Already a member?' : "New to BiddingMaster?"}{' '}
            <button 
              type="button"
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                form.reset();
              }}
            >
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginForm;