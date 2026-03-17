'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { requirementService } from '@/services/requirement.service';
import { Requirement, RequirementStatus, PaginatedResponse } from '@/types';
import RequirementCard from '@/components/common/RequirementCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Search, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks';

const RequirementsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchRequirements();
  }, [debouncedSearch, statusFilter, page]);

  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        limit: 10,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      // If user is a seller, show all active requirements
      if (user?.roles.includes('Seller') && !user?.roles.includes('Buyer')) {
        params.status = 'ACTIVE';
      }

      const response = await requirementService.getRequirements(params);
      setRequirements(response.results);
      setTotalPages(response.totalPages);
      setTotalResults(response.totalResults);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requirements');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCreateRequirement = () => {
    router.push('/requirements/new');
  };

  const handleViewRequirement = (requirementId: string) => {
    router.push(`/requirements/${requirementId}`);
  };

  const handleBidClick = (requirementId: string) => {
    router.push(`/requirements/${requirementId}#bid`);
  };

  const getViewMode = (): 'buyer' | 'seller' | 'public' => {
    if (!user) return 'public';
    if (user.roles.includes('Buyer')) return 'buyer';
    return 'seller';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Requirements</h1>
          <p className="text-muted-foreground mt-1">
            {totalResults} requirement{totalResults !== 1 ? 's' : ''} found
          </p>
        </div>
        {user?.roles.includes('Buyer') && (
          <Button onClick={handleCreateRequirement}>
            <Plus className="mr-2 h-4 w-4" />
            Create Requirement
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requirements..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="AWARDED">Awarded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!loading && requirements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No requirements found</p>
          {user?.roles.includes('Buyer') && (
            <Button onClick={handleCreateRequirement}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Requirement
            </Button>
          )}
        </div>
      )}

      {/* Requirements Grid */}
      {!loading && requirements.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((requirement) => (
              <RequirementCard
                key={requirement._id}
                requirement={requirement}
                viewMode={getViewMode()}
                onViewClick={handleViewRequirement}
                onBidClick={handleBidClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequirementsPage;