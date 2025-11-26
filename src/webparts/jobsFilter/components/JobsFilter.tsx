import * as React from 'react';
import { useState, useEffect } from 'react';
import { IJobsFilterProps } from './IJobsFilterProps';
import JobsFilterUI from '../../../components/JobsFilter/JobsFilterUI';
import { IJobsListItem } from '../../../interfaces/IJobsListItem';
import { JobsService } from '../../../services/JobsService';

const JobsFilter: React.FC<IJobsFilterProps> = (props) => {
  const { list, jobPage, context, onFilterChange } = props;
  const [allJobs, setAllJobs] = useState<IJobsListItem[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJobsListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        // Get all jobs without the top(5) limit
        const jobs = await JobsService.getAllJobs(context, list, jobPage);
        setAllJobs(jobs);
        setFilteredJobs(jobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [list, context]);

  const handleFilter = (filters: { searchText: string; unit: string; manager: string; location: string; jobType: string }) => {
    let filtered = [...allJobs];

    // Free text search across all fields
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(job =>
        job.Title?.toLowerCase().includes(searchLower) ||
        job.jobDescription?.toLowerCase().includes(searchLower) ||
        job.HiringManager?.toLowerCase().includes(searchLower) ||
        job.Unit?.toLowerCase().includes(searchLower) ||
        (job.jobLocation && String(job.jobLocation).toLowerCase().includes(searchLower)) ||
        (job.jobType && String(job.jobType).toLowerCase().includes(searchLower))
      );
    }

    // Unit/Division filter
    if (filters.unit) {
      filtered = filtered.filter(job => job.Unit === filters.unit);
    }

    // Manager filter
    if (filters.manager) {
      filtered = filtered.filter(job => job.HiringManager === filters.manager);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job => job.jobLocation && String(job.jobLocation) === filters.location);
    }

    // Job Type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType && String(job.jobType) === filters.jobType);
    }

    setFilteredJobs(filtered);
    
    // Notify parent web part about filter changes
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleClearFilters = () => {
    setFilteredJobs(allJobs);
    
    // Notify parent that filters are cleared
    if (onFilterChange) {
      onFilterChange({ searchText: '', unit: '', manager: '', location: '', jobType: '' });
    }
  };

  return (
    <JobsFilterUI
      allJobs={allJobs}
      filteredJobs={filteredJobs}
      onFilter={handleFilter}
      onClearFilters={handleClearFilters}
      isLoading={isLoading}
    />
  );
};

export default JobsFilter;
