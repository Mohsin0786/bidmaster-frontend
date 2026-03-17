'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Bell, Home, Newspaper, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { requirementService } from '@/services/requirement.service';
import { Requirement } from '@/types';
import RequirementCard from '@/components/common/RequirementCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [liveRequirements, setLiveRequirements] = useState<Requirement[]>([]);
  const [upcomingRequirements, setUpcomingRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const activeRes = await requirementService.getRequirements({ page: 1, limit: 10, status: 'ACTIVE' });
      const draftRes = await requirementService.getRequirements({ page: 1, limit: 10, status: 'DRAFT' });
      
      const now = new Date();
      
      // Filter active into truly LIVE vs UPCOMING based on startTime
      const live = activeRes.results.filter(req => !req.startTime || new Date(req.startTime) <= now);
      const upcomingActives = activeRes.results.filter(req => req.startTime && new Date(req.startTime) > now);

      setLiveRequirements(live);
      // Merge upcoming actives with drafts
      setUpcomingRequirements([...upcomingActives, ...draftRes.results]);

    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pt-2 pb-32">
      {/* Search Header for Mobile/Dashboard */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 outline-none focus-within:ring-2 ring-blue-500/20 transition-all">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input 
            type="text" 
            placeholder="Search...." 
            className="border-none bg-transparent shadow-none p-0 h-auto focus-visible:ring-0 text-base"
          />
        </div>
        <button className="h-10 w-10 flex items-center justify-center shrink-0">
          <Bell className="h-6 w-6 text-gray-800" />
        </button>
      </div>

      {/* Live Bid Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Live Bid</h2>
          <button onClick={() => router.push('/requirements')} className="text-sm font-bold text-blue-600 hover:text-blue-700">
            See All
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {liveRequirements.length > 0 ? (
            liveRequirements.map((req) => (
              <RequirementCard 
                key={req._id} 
                requirement={req} 
                viewMode={user?.roles.includes('Buyer') ? 'buyer' : 'seller'}
                onBidClick={() => router.push(`/requirements/${req._id}`)}
                onViewClick={() => router.push(`/requirements/${req._id}`)}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500 font-medium">No live bids at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Bid Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Upcoming Bid</h2>
          <button onClick={() => router.push('/requirements')} className="text-sm font-bold text-blue-600 hover:text-blue-700">
            See All
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {upcomingRequirements.length > 0 ? (
            upcomingRequirements.map((req) => (
              <RequirementCard 
                key={req._id} 
                requirement={req} 
                viewMode={user?.roles.includes('Buyer') ? 'buyer' : 'seller'}
                onBidClick={() => router.push(`/requirements/${req._id}`)}
                onViewClick={() => router.push(`/requirements/${req._id}`)}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500 font-medium">No upcoming bids scheduled.</p>
            </div>
          )}
        </div>
      </section>

      {/* Floating Bottom Navigation (Mimicking Mobile App) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none md:hidden">
        <div className="max-w-md mx-auto relative pointer-events-auto">
          {/* Create Button (Center floating) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <button 
              onClick={() => router.push('/requirements/new')}
              className="bg-white border text-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/20 z-20 transition-transform active:scale-95"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
          
          {/* Bottom Nav Bar */}
          <div className="bg-blue-600 rounded-2xl h-16 flex items-center justify-between px-8 shadow-lg">
            <button className="flex flex-col items-center justify-center gap-1 text-white opacity-100 w-16" onClick={() => router.push('/dashboard')}>
              <Home className="w-6 h-6 fill-white" />
              <span className="text-xs font-bold">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-blue-200 hover:text-white transition-colors w-16" onClick={() => router.push('/news')}>
              <Newspaper className="w-6 h-6" />
              <span className="text-xs font-medium">News</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
