import * as React from 'react';
import { useState, useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import { IJobsListItem } from '../../interfaces/IJobsListItem';
import Jobsitem from '../Jobs/JobItem/JobItem';
import './jobsFilter.scss';
import './reactSelectJobsFilter.scss';

interface IOption {
  value: string;
  label: string;
}

interface IJobsFilterUIProps {
  allJobs: IJobsListItem[];
  filteredJobs: IJobsListItem[];
  onFilter: (filters: { searchText: string; unit: string; manager: string; location: string; jobType: string }) => void;
  onClearFilters: () => void;
  isLoading: boolean;
}

const JobsFilterUI: React.FC<IJobsFilterUIProps> = (props) => {
  const { allJobs, filteredJobs, onFilter, onClearFilters, isLoading } = props;
  
  const [searchText, setSearchText] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<SingleValue<IOption>>(null);
  const [selectedLocation, setSelectedLocation] = useState<SingleValue<IOption>>(null);
  const [selectedJobType, setSelectedJobType] = useState<SingleValue<IOption>>(null);

  // Extract unique units from all jobs
  const unitOptions: IOption[] = useMemo(() => {
    const units = allJobs
      .map(job => job.Unit)
      .filter(unit => unit && typeof unit === 'string') // Filter out null/undefined/non-strings
      .map(unit => unit.trim()) // Trim whitespace
      .filter((unit, index, self) => self.indexOf(unit) === index) // Remove duplicates
      .sort();
    return units.map(unit => ({ value: unit, label: unit }));
  }, [allJobs]);

  // Extract unique locations from all jobs
  const locationOptions: IOption[] = useMemo(() => {
    const locations = allJobs
      .map(job => job.jobLocation)
      .filter(location => location) // Filter out null/undefined
      .map(location => String(location).trim()) // Convert to string and trim
      .filter((location, index, self) => self.indexOf(location) === index) // Remove duplicates
      .sort();
    return locations.map(location => ({ value: location, label: location }));
  }, [allJobs]);

  // Extract unique job types from all jobs
  const jobTypeOptions: IOption[] = useMemo(() => {
    const types = allJobs
      .map(job => job.jobType)
      .filter(type => type) // Filter out null/undefined
      .map(type => String(type).trim()) // Convert to string and trim
      .filter((type, index, self) => self.indexOf(type) === index) // Remove duplicates
      .sort();
    return types.map(type => ({ value: type, label: type }));
  }, [allJobs]);

  // Apply filters
  const applyFilters = () => {
    onFilter({
      searchText,
      unit: selectedUnit?.value || '',
      manager: '',
      location: selectedLocation?.value || '',
      jobType: selectedJobType?.value || '',
    });
  };

  // Handle search text change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    // Apply filter on every keystroke
    onFilter({
      searchText: value,
      unit: selectedUnit?.value || '',
      manager: '',
      location: selectedLocation?.value || '',
      jobType: selectedJobType?.value || '',
    });
  };

  // Handle unit selection
  const handleUnitChange = (option: SingleValue<IOption>) => {
    setSelectedUnit(option);
    onFilter({
      searchText,
      unit: option?.value || '',
      manager: '',
      location: selectedLocation?.value || '',
      jobType: selectedJobType?.value || '',
    });
  };

  // Handle location selection
  const handleLocationChange = (option: SingleValue<IOption>) => {
    setSelectedLocation(option);
    onFilter({
      searchText,
      unit: selectedUnit?.value || '',
      manager: '',
      location: option?.value || '',
      jobType: selectedJobType?.value || '',
    });
  };

  // Handle job type selection
  const handleJobTypeChange = (option: SingleValue<IOption>) => {
    setSelectedJobType(option);
    onFilter({
      searchText,
      unit: selectedUnit?.value || '',
      manager: '',
      location: selectedLocation?.value || '',
      jobType: option?.value || '',
    });
  };

  // Clear all filters
  const handleClear = () => {
    setSearchText('');
    setSelectedUnit(null);
    setSelectedLocation(null);
    setSelectedJobType(null);
    onClearFilters();
  };

  // Check if any filter is active
  const hasActiveFilters = searchText || selectedUnit || selectedLocation || selectedJobType;

  return (
    <>
      <div className='jobs-filter-container'>
        <div className='jobs-filter-header'>
          <h2 className='filter-title'>סינון משרות</h2>
          {hasActiveFilters && (
            <button className='clear-filters-link' onClick={handleClear}>
              נקה סינון
            </button>
          )}
        </div>
        
        <div className='jobs-filter-wrapper'>
          {/* Free text search */}
          <div className='search-input-wrapper'>
            <input
              type='text'
              className='search-input'
              placeholder='חיפוש חופשי'
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>

          {/* Unit dropdown */}
          <div className='filter-dropdown-wrapper'>
            <Select
              value={selectedUnit}
              onChange={handleUnitChange}
              options={unitOptions}
              isClearable
              placeholder='בחר תחום'
              classNamePrefix='react-select-jobs-filter'
              noOptionsMessage={() => 'אין אפשרויות'}
            />
          </div>

          {/* Location dropdown */}
          <div className='filter-dropdown-wrapper'>
            <Select
              value={selectedLocation}
              onChange={handleLocationChange}
              options={locationOptions}
              isClearable
              placeholder='מיקום משרה'
              classNamePrefix='react-select-jobs-filter'
              noOptionsMessage={() => 'אין אפשרויות'}
            />
          </div>

          {/* Job Type dropdown */}
          <div className='filter-dropdown-wrapper'>
            <Select
              value={selectedJobType}
              onChange={handleJobTypeChange}
              options={jobTypeOptions}
              isClearable
              placeholder='סוג משרה'
              classNamePrefix='react-select-jobs-filter'
              noOptionsMessage={() => 'אין אפשרויות'}
            />
          </div>
        </div>

        {/* Show result count when filters are active */}
        {/* {hasActiveFilters && !isLoading && (
          <div className='filter-results-info'>
            {filteredJobs.length} משרות מתאימות לסינון
          </div>
        )} */}
      </div>

      {/* Job list display - outside gray box */}
      <div className='jobs-results' style={{ marginTop: '24px', maxWidth: '1406px', margin: '24px auto 0', padding: '0 10px' }}>
        {isLoading ? (
          <div className='loading-message'>טוען משרות...</div>
        ) : filteredJobs.length === 0 ? (
          <div className='no-results-message'>
            <img src={require('../../assets/icons/searchIcon.svg')} alt="search" className='no-results-icon' />
            {searchText && !selectedUnit && !selectedLocation && !selectedJobType ? (
              <span>לא נמצאו תוצאות לחיפוש שנבחר</span>
            ) : (
              <span>לא נמצאו תוצאות לחיפוש שנבחר, אפשר לנסות בחיפוש החופשי</span>
            )}
          </div>
        ) : (
          <div className='jobs-list'>
            {filteredJobs.map((job, index) => (
              <Jobsitem key={index} {...job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default JobsFilterUI;
