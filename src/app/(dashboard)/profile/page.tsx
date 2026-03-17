'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Briefcase, Building2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Not Authenticated</h2>
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-background border-b" />
            <CardContent className="pt-0 relative">
              <div className="flex justify-center -mt-12 mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                  <AvatarImage src={user.profilePic?.url || ''} alt={user.firstName} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user.designation || 'Member'}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                {user.roles.map(role => (
                  <Badge key={role} variant="secondary" className="px-3">
                    {role}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Status</span>
                {user.isEmailVerified ? (
                  <div className="flex items-center text-emerald-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Verified
                  </div>
                ) : (
                  <div className="text-amber-600 text-sm font-medium">Unverified</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">{format(new Date(user.createdAt), 'MMM yyyy')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Information */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-0.5">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-0.5">Phone Number</p>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-0.5">Address</p>
                  <p className="font-medium">{user.address || 'Not provided'}</p>
                  {user.pincode && <p className="text-xs text-muted-foreground mt-0.5">PIN: {user.pincode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Industry</p>
                  <p className="font-medium">{user.industry || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Designation</p>
                  <p className="font-medium">{user.designation || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">GST Number</p>
                  <p className="font-mono text-sm mt-0.5">{user.gstNo || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="font-medium">
                    {user.dob ? format(new Date(user.dob), 'MMMM d, yyyy') : 'Not provided'}
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
