import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { DynamicProperty } from '@microsoft/sp-component-base';

import JobsFilter from "./components/JobsFilter";
import { IJobsFilterProps } from "./components/IJobsFilterProps";

export interface IJobsFilterWebPartProps {
  list: string;
  jobPage: string;
}

export default class JobsFilterWebPart extends BaseClientSideWebPart<IJobsFilterWebPartProps> {
  private _filterValues: { searchText: string; unit: string; manager: string; location: string; jobType: string } = {
    searchText: '',
    unit: '',
    manager: '',
    location: '',
    jobType: ''
  };

  public render(): void {
    const element: React.ReactElement<IJobsFilterProps> = React.createElement(
      JobsFilter,
      {
        list: this.properties.list,
        jobPage: this.properties.jobPage,
        context: this.context,
        onFilterChange: this._handleFilterChange.bind(this),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _handleFilterChange(filters: { searchText: string; unit: string; manager: string; location: string; jobType: string }): void {
    this._filterValues = filters;
    
    // Update URL with query parameters
    const url = new URL(window.location.href);
    
    if (filters.searchText) {
      url.searchParams.set('search', filters.searchText);
    } else {
      url.searchParams.delete('search');
    }
    
    if (filters.unit) {
      url.searchParams.set('unit', filters.unit);
    } else {
      url.searchParams.delete('unit');
    }
    
    if (filters.manager) {
      url.searchParams.set('manager', filters.manager);
    } else {
      url.searchParams.delete('manager');
    }
    
    if (filters.location) {
      url.searchParams.set('location', filters.location);
    } else {
      url.searchParams.delete('location');
    }
    
    if (filters.jobType) {
      url.searchParams.set('jobType', filters.jobType);
    } else {
      url.searchParams.delete('jobType');
    }
    
    // Update browser URL without reload
    window.history.replaceState({}, '', url.toString());
    
    // Notify dynamic data consumers (only in production, not workbench)
    try {
      if (this.context.dynamicDataSourceManager) {
        this.context.dynamicDataSourceManager.notifyPropertyChanged('filters');
      }
    } catch (e) {
      // Ignore error in workbench
      console.log('Dynamic Data not available (workbench mode)');
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /**
   * Make this web part a dynamic data source
   */
  protected get propertiesMetadata(): any {
    return {
      'filters': {
        title: 'Job Filters',
        description: 'Current filter values for jobs'
      }
    };
  }

  public getPropertyValue(propertyId: string): any {
    if (propertyId === 'filters') {
      return this._filterValues;
    }
    return undefined;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "הגדרות פילטר משרות",
          },
          groups: [
            {
              groupName: "הגדרות",
              groupFields: [
                PropertyPaneTextField("list", {
                  label: "קישור לרשימת משרות",
                  description: "קישור יחסי לרשימה",
                }),
                PropertyPaneTextField("jobPage", {
                  label: "דף פרטי משרה",
                  description: "כתובת העמוד להצגת פרטי משרה",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
