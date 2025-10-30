import { ISPFXContext } from "@pnp/sp";

export interface IJobsFilterProps {
  list: string;
  context: ISPFXContext;
  onFilterChange: (filters: { searchText: string; unit: string; manager: string; location: string; jobType: string }) => void;
}
