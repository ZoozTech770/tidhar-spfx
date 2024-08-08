export interface IInquiry {
    date: Date,
    formHandlingPeriod: number,
    lastModified: Date,
    link: any,
    modifiedBy: string,
    status: InquiryStatusEnum,
    title: string
}

export enum InquiryStatusEnum {
    "טיוטה",
    "בטיפול",
    "אושרה",
    "נדחתה",
    "בוטלה"
}