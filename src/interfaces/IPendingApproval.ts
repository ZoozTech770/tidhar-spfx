import { LinkType } from "./Types";

export interface IPendingApproval {
    Title: string;
    PendingCount:number;
    ExceededCount:number;
    ToAllUrl:LinkType
  }

  export interface IPendingApprovalItem {
    Title: string;
    Sender:string;
    OpenDate:Date;
    Url: string;
    timeLeft:number;
  }
  