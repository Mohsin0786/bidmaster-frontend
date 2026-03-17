'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bidService } from '@/services/bid.service';
import { Bid, PaginatedResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight, Gavel, Calendar, DollarSign, Target, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function MyBidsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('recent'); // recent, price_asc, price_desc

  useEffect(() => {
    fetchBids();
  }, [sortBy]);

  const fetchBids = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming getMyBids fetches all bids for current seller user
      const response = await bidService.getMyBids({ page: 1, limit: 50 });
      let sortedResults = [...response.results];
      
      if (sortBy === 'price_asc') {
        sortedResults.sort((a, b) => a.offeredPrice - b.offeredPrice);
      } else if (sortBy === 'price_desc') {
        sortedResults.sort((a, b) => b.offeredPrice - a.offeredPrice);
      } else {
        // recent (default date desc assuming backend returns it that way, or we enforce here)
        sortedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      setBids(sortedResults);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bids');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Accepted</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Pending</span>;
    }
  };

  if (user && !user.roles.includes('Seller')) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          Only users with the Seller role can view this page.
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all your active and past bids.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center justify-center mb-6">
          {error}
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
          <Target className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Bids Found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You haven't placed any bids yet. Head over to the requirements board to find opportunities.
          </p>
          <Button onClick={() => router.push('/requirements')}>
            Browse Requirements
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bids.map((bid) => {
            const reqId = typeof bid.requirement === 'string' ? bid.requirement : ((bid.requirement as any)?._id || bid.requirement);
            
            return (
              <Card 
                key={bid._id} 
                className="hover:shadow-md transition-shadow cursor-default group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Status Indicator Bar */}
                  <div className={`w-full md:w-2 ${((bid as any).status || 'PENDING') === 'ACCEPTED' ? 'bg-emerald-500' : ((bid as any).status || 'PENDING') === 'REJECTED' ? 'bg-red-500' : 'bg-blue-500'} rounded-t-lg md:rounded-l-lg md:rounded-tr-none`} />
                  
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      
                      {/* Deal Details Column */}
                      <div className="space-y-4 flex-1">
                        <div>
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Bid ID: {bid._id.substring(bid._id.length - 8)}</p>
                          <h3 className="text-xl font-semibold break-words">
                            {bid.notes ? (bid.notes.length > 80 ? bid.notes.substring(0, 80) + '...' : bid.notes) : 'Standard Bid Submitted'}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> Offered
                            </p>
                            <p className="font-semibold text-lg">₹{bid.offeredPrice.toLocaleString()}</p>
                          </div>
                          
                          {bid.deliveryDays && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Delivery
                              </p>
                              <p className="font-semibold">{bid.deliveryDays} Days</p>
                            </div>
                          )}
                          
                          <div className="lg:col-span-2">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                            <div className="flex items-center gap-2">
                              {getStatusBadge((bid as any).status || 'PENDING')}
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(bid.createdAt), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Column */}
                      <div className="flex flex-col justify-between items-start md:items-end md:w-48 gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                        <div className="w-full text-center md:text-right">
                          <p className="text-sm text-muted-foreground mb-2">Requirement Link</p>
                          <Button 
                            variant="secondary" 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => router.push(`/requirements/${reqId}`)}
                          >
                            View Details <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                        
                        {((bid as any).status || 'PENDING') === 'ACCEPTED' && (
                          <div className="flex items-center gap-2 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-5 h-5" /> Awarded
                          </div>
                        )}
                      </div>
                      
                    </div>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
