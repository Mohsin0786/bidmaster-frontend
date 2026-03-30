'use client';

import React from 'react';
import { Requirement, RequirementStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface RequirementCardProps {
  requirement: Requirement;
  viewMode: 'buyer' | 'seller' | 'public';
  onBidClick?: (requirementId: string) => void;
  onEditClick?: (requirementId: string) => void;
  onDeleteClick?: (requirementId: string) => void;
  onViewClick?: (requirementId: string) => void;
  bidCount?: number;
  lowestBid?: number;
}

const RequirementCard: React.FC<RequirementCardProps> = ({
  requirement,
  viewMode,
  onBidClick,
  onEditClick,
  onDeleteClick,
  onViewClick,
  bidCount = 0,
}) => {
  const { user } = useAuth();
  const now = new Date();
  const startTime = requirement.startTime ? new Date(requirement.startTime) : null;
  const endTime = requirement.endTime ? new Date(requirement.endTime) : null;
  const isStartTimePast = startTime ? now >= startTime : true;
  const isEndTimePast = endTime ? now > endTime : false;

  const isLive = requirement.status === 'ACTIVE' && isStartTimePast && !isEndTimePast;
  const isExpired = requirement.status === 'ACTIVE' && isEndTimePast;
  // If not active, or active but start time is in the future, it's upcoming
  const isUpcoming = requirement.status === 'DRAFT' || (requirement.status === 'ACTIVE' && !isStartTimePast);

  // Determine Creator Name
  let creatorName = 'Unknown';
  const reqCreatedBy: any = requirement.createdBy;
  const reqCreator: any = (requirement as any).creator;
  
  if (reqCreatedBy?.firstName || reqCreator?.firstName) {
    creatorName = `${reqCreatedBy?.firstName || reqCreator?.firstName} ${(reqCreatedBy?.lastName || reqCreator?.lastName) || ''}`.trim();
  } else if (typeof reqCreatedBy === 'string' && user && reqCreatedBy === user._id) {
    creatorName = 'You';
  } else if (typeof requirement.createdBy === 'string') {
    creatorName = 'A User';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-100 overflow-hidden relative flex flex-col p-5 w-full transition-all cursor-pointer" onClick={() => onViewClick?.(requirement._id)}>
        {/* Left vertical colored line */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-[6px]",
          isLive ? "bg-blue-600" : isExpired ? "bg-gray-400" : isUpcoming ? "bg-blue-600" : "bg-gray-300"
        )} />

        {/* Header row: Title + Actions/Dots */}
        <div className="flex justify-between items-start ml-2 mb-1">
          <div className="flex-1 pr-4">
            <h3 className="font-extrabold text-slate-900 text-[17px] leading-snug line-clamp-1">
              {requirement.title}
            </h3>
          </div>
          <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full shrink-0 -mt-1 -mr-1" onClick={(e) => { e.stopPropagation(); onEditClick?.(requirement._id); }}>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        {/* Subtitle / Description Row and Badge */}
        <div className="flex justify-between items-center ml-2 mb-4">
          <p className="text-[13px] text-gray-500 font-medium line-clamp-1 m-0 flex-1 pr-2">
            {requirement.description || 'General requirement'}
          </p>
          
          <div className="shrink-0 flex items-center">
            {isLive && (
              <div className="flex items-center gap-1.5 bg-[#00C853] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white mb-[0.5px]" />
                LIVE
              </div>
            )}
            {isExpired && (
              <div className="flex items-center gap-1.5 bg-gray-400 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white mb-[0.5px]" />
                EXPIRED
              </div>
            )}
            {isUpcoming && (
              <div className="flex items-center gap-1.5 bg-[#EF4444] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white mb-[0.5px]" />
                Upcoming
              </div>
            )}
          </div>
        </div>
        
        {/* Details row (Price and Creator Info) */}
        <div className="flex justify-between items-end ml-2 mb-5">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 font-medium tracking-tight mb-0.5">
              Ceiling Price
            </span>
            <span className="text-[22px] font-bold text-[#2563EB] leading-none tracking-tight">
              {requirement.currency === 'INR' ? '₹' : '$'}
              {requirement.ceilingPrice?.toLocaleString() || '0'}
            </span>
          </div>
          
          <div className="flex flex-col text-right text-[11px] text-gray-400 space-y-0.5 mt-2 md:mt-0 font-medium">
            <div>
              Created By : <span className="text-[#2563EB]">
                {creatorName}
              </span>
            </div>
            <div>
              On : {requirement.createdAt ? format(new Date(requirement.createdAt), 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy')}
            </div>
          </div>
        </div>

        {/* Footer row: Bidders + Action Button */}
        <div className="flex justify-between items-center ml-2">
          <div className="flex items-center text-gray-400 font-medium text-[13px] gap-1.5">
            <Users className="h-[15px] w-[15px]" />
            <span>{bidCount} {bidCount === 1 ? 'bidder' : 'bidders'}</span>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              if (isLive && viewMode !== 'buyer') {
                onBidClick?.(requirement._id);
              } else {
                onViewClick?.(requirement._id);
              }
            }}
            className={cn(
              "text-white rounded-[10px] px-8 h-[38px] text-[14px] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm shadow-blue-500/20 active:scale-95",
              "bg-[#2563EB]"
            )}
          >
            {isLive && viewMode !== 'buyer' ? 'Bid' : 'View'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default RequirementCard;