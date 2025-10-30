# Jobs Filter Implementation Guide

## Overview
I've created a new SPFx web part called **JobsFilter** that adds filtering capabilities to your AllJobs page. This component provides:

✅ **Free text search** - Search across all job fields (Title, Description, Unit, Manager)
✅ **Unit dropdown filter** - Filter jobs by department/unit
✅ **Hiring Manager dropdown filter** - Filter jobs by the hiring manager
✅ **Clear filters button** - Reset all filters with one click
✅ **Live filtering** - Results update as you type/select
✅ **Results count** - Shows how many jobs match the current filters

## Files Created

### Web Part Files
- `src/webparts/jobsFilter/JobsFilterWebPart.manifest.json` - Web part manifest
- `src/webparts/jobsFilter/JobsFilterWebPart.ts` - Web part TypeScript file
- `src/webparts/jobsFilter/components/IJobsFilterProps.ts` - Props interface
- `src/webparts/jobsFilter/components/JobsFilter.tsx` - Main React component
- `src/webparts/jobsFilter/loc/mystrings.d.ts` - Localization types
- `src/webparts/jobsFilter/loc/en-us.js` - English strings

### UI Component Files
- `src/components/JobsFilter/JobsFilterUI.tsx` - Filter UI component
- `src/components/JobsFilter/jobsFilter.scss` - Main styling
- `src/components/JobsFilter/reactSelectJobsFilter.scss` - React-select dropdown styling

### Service Updates
- `src/services/JobsService.ts` - Added `getAllJobs()` method to fetch all jobs without the top(5) limit

## How It Works

1. **Data Loading**: The component fetches ALL active jobs from the SharePoint list using the new `getAllJobs()` method
2. **Filter State**: Maintains filter state for search text, selected unit, and selected manager
3. **Real-time Filtering**: Filters are applied immediately as the user types or selects options
4. **Display**: Shows filtered jobs using the existing `JobItem` component

## How to Deploy

1. **Build the solution**:
   ```powershell
   npm run build
   gulp bundle --ship
   gulp package-solution --ship
   ```

2. **Upload to App Catalog**:
   - Upload the `.sppkg` file from `sharepoint/solution/` to your App Catalog
   - Deploy the solution

3. **Add to AllJobs Page**:
   - Go to your AllJobs SharePoint page
   - Edit the page
   - Add the "פילטר משרות" (Jobs Filter) web part
   - Configure the web part properties:
     - **Jobs List URL**: The relative URL to your jobs list (same as the Jobs web part uses)
   - Save and publish

## Configuration

In the web part property pane, you need to set:
- **List**: The relative path to the Jobs SharePoint list (e.g., `/Lists/Jobs`)

## Styling

The component follows your existing design system:
- Uses the **almoni** font family
- Green color scheme (#004438)
- Rounded corners (40px border-radius)
- Responsive design for mobile devices
- Similar styling to SearchProjects component

## Filter Behavior

- **Free Text Search**: Searches in Title, Description, Unit, and Manager fields
- **Dropdown Filters**: Automatically populated with unique values from the jobs data
- **Combined Filters**: All active filters work together (AND logic)
- **Clear Button**: Only appears when at least one filter is active

## Customization

### To add more filter fields:
1. Update `IJobsListItem` interface if needed
2. Add new dropdown in `JobsFilterUI.tsx`
3. Update filter logic in `JobsFilter.tsx` `handleFilter` function
4. Add styling in `jobsFilter.scss`

### To change filter labels:
Edit the `placeholder` props in `JobsFilterUI.tsx`:
- Line 100: `'חיפוש חופשי'` (Free search)
- Line 113: `'בחירת יחידה'` (Select unit)
- Line 126: `'מנהל גיוס'` (Hiring manager)
- Line 135: `'נקה סינון'` (Clear filters)

## Dependencies

All required dependencies are already in your `package.json`:
- `react-select` (v5.7.4) - For dropdown components
- `@pnp/sp` (v3.16.0) - For SharePoint data access

## Notes

- The component displays jobs in a grid layout using the existing `JobItem` component
- If you want to REPLACE the built-in SharePoint list view, you can hide it and use this component's job list display
- Alternatively, you can modify the component to ONLY show filters and use URL parameters to filter the SharePoint list view below it

## Troubleshooting

If the web part doesn't appear after deployment:
1. Make sure the solution is deployed in the App Catalog
2. Add the app to your site (Site Contents → Add an app)
3. Refresh the page

If jobs don't load:
1. Check the List URL in web part properties
2. Ensure the current user has permissions to read the list
3. Check browser console for errors

## Contact

If you need any modifications or have questions, let me know!
