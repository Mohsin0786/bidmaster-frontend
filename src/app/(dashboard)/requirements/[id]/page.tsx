'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { requirementService } from '@/services/requirement.service';
import { bidService } from '@/services/bid.service';
import { Requirement, Bid, BidStatistics } from '@/types';
import RequirementCard from '@/components/common/RequirementCard';
import BidForm from '@/components/forms/BidForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Calendar, Clock, DollarSign, Users, FileText, Check, X, Award } from 'lucide-react';
import { format } from 'date-fns';
import { use } from 'react';

const RequirementDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidStats, setBidStats] = useState<BidStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  const requirementId = params.id as string;

  useEffect(() => {
    if (requirementId) {
      fetchRequirementDetails();
    }
  }, [requirementId]);

  const fetchRequirementDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const [req, bidsData] = await Promise.all([
        requirementService.getRequirement(requirementId),
        bidService.getBids({ requirementId }),
      ]);

      setRequirement(req);
      setBids(bidsData.results);

      // Calculate bid statistics
      if (bidsData.results.length > 0) {
        const prices = bidsData.results.map(b => b.offeredPrice);
        const lowest = Math.min(...prices);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        
        setBidStats({
          totalBids: bidsData.results.length,
          lowestBid: lowest,
          averageBid: avg,
          timeRemaining: req.status === 'ACTIVE' 
            ? new Date(req.endTime).getTime() - Date.now() 
            : undefined,
        });
      } else {
        setBidStats({
          totalBids: 0,
          timeRemaining: req.status === 'ACTIVE' 
            ? new Date(req.endTime).getTime() - Date.now() 
            : undefined,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requirement details');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (bidData: any) => {
    try {
      await bidService.createBid(requirementId, bidData);
      // Refresh bids
      const bidsData = await bidService.getBids({ requirementId });
      setBids(bidsData.results);
      setActiveTab('bids');
    } catch (err: any) {
      throw err;
    }
  };

  const handleActivate = async () => {
    try {
      const updated = await requirementService.activateRequirement(requirementId);
      setRequirement(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to activate requirement');
    }
  };

  const handleClose = async () => {
    try {
      const updated = await requirementService.closeRequirement(requirementId);
      setRequirement(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to close requirement');
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await bidService.acceptBid(bidId);
      // Refresh requirement and bids
      await fetchRequirementDetails();
    } catch (err: any) {
      setError(err.message || 'Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      await bidService.rejectBid(bidId);
      // Refresh bids
      const bidsData = await bidService.getBids({ requirementId });
      setBids(bidsData.results);
    } catch (err: any) {
      setError(err.message || 'Failed to reject bid');
    }
  };

  const isBuyer = user?.roles.includes('Buyer') && requirement?.createdBy === user._id;
  const isSeller = user?.roles.includes('Seller');
  const canBid = isSeller && requirement?.status === 'ACTIVE';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error && !requirement) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Requirement Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requirement you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push('/requirements')}>
            Back to Requirements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{requirement.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge>{requirement.status}</Badge>
            {requirement.category && <Badge variant="outline">{requirement.category}</Badge>}
            <span className="text-muted-foreground">
              Created {format(new Date(requirement.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        {isBuyer && requirement.status === 'DRAFT' && (
          <Button onClick={handleActivate}>
            Activate Requirement
          </Button>
        )}
        {isBuyer && requirement.status === 'ACTIVE' && (
          <Button variant="outline" onClick={handleClose}>
            Close Requirement
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="bids">Bids ({bids.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{requirement.description}</p>
                </CardContent>
              </Card>

              {requirement.attachments && requirement.attachments.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {requirement.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Attachment {index + 1}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bids" className="mt-6">
              {bids.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No bids yet</p>
                    {canBid && (
                      <Button onClick={() => setActiveTab('place-bid')} className="mt-4">
                        Be the First to Bid
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bids
                    .sort((a, b) => a.offeredPrice - b.offeredPrice) // Sort by price (lowest first)
                    .map((bid, index) => (
                      <Card key={bid._id} className={index === 0 ? 'border-green-500 border-2' : ''}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {index === 0 && (
                                <Award className="h-6 w-6 text-green-500" />
                              )}
                              <div>
                                <p className="font-semibold text-lg">
                                  ₹{bid.offeredPrice.toLocaleString()}
                                </p>
                                {bid.deliveryDays && (
                                  <p className="text-sm text-muted-foreground">
                                    Delivery: {bid.deliveryDays} days
                                  </p>
                                )}
                                {bid.notes && (
                                  <p className="text-sm mt-1">{bid.notes}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(bid.createdAt), 'MMM d, yyyy h:mm a')}
                                </p>
                              </div>
                            </div>
                            {isBuyer && requirement.status === 'ACTIVE' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectBid(bid._id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptBid(bid._id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            {canBid && (
              <TabsContent value="place-bid" className="mt-6">
                <BidForm
                  requirement={requirement}
                  currentBestBid={bids[0]}
                  onSubmit={handleBidSubmit}
                  onCancel={() => setActiveTab('bids')}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Ceiling Price</span>
                </div>
                <span className="font-semibold">₹{requirement.ceilingPrice.toLocaleString()}</span>
              </div>
              
              {bidStats && bidStats.lowestBid && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>Lowest Bid</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    ₹{bidStats.lowestBid.toLocaleString()}
                  </span>
                </div>
              )}
              
              {bidStats && bidStats.averageBid && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Average Bid</span>
                  </div>
                  <span className="font-semibold">
                    ₹{bidStats.averageBid.toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Total Bids</span>
                </div>
                <span className="font-semibold">{bidStats?.totalBids || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Participants</span>
                </div>
                <span className="font-semibold">{requirement.participants?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold">
                    {format(new Date(requirement.startTime), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-semibold">
                    {format(new Date(requirement.endTime), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Decrement Card */}
          <Card>
            <CardHeader>
              <CardTitle>Bidding Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Minimum Decrement
              </p>
              <p className="text-2xl font-bold">
                ₹{requirement.minDecrement.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Each bid must be at least this amount lower than the current best bid.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequirementDetailPage;