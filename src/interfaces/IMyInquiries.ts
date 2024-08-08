import { IFormItem } from "./IformItem";
import { IInquiriesItem } from "./IInquiriesItem";
import { LinkType } from "./Types";

export interface IMyInquiries {
    title: string;
    inquiries:IInquiriesItem[];
    newForm?:LinkType;
    allInquiries?:LinkType;
    showPendingApproval:boolean;
    allFormList?:IFormItem[];
  }
