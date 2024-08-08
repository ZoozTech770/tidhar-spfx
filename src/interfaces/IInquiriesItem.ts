import { LinkType } from "./Types";


export interface IInquiriesItem {
    title: string,
    date: Date,
    lastModified: Date,
    status: "בטיפול" | "טיוטה" | "אושרה" | "בוטלה" | "נדחתה",
    link: LinkType,
    formHandlingPeriod: number
}

export interface IArchiveInquiriesItem extends IInquiriesItem {
    createrOrApprover: string,
    createdByMe:boolean;
}
