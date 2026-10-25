export interface ICAccountMaster {
    id: number;
    userId: number;
    bank: string;
    acType: string;
    acNo: string;
    acName: string;
    depositAmt: number;
    roi: number;
    finalAmt: number;
    startDate: Date;
    endDate: Date;
    createdDate: Date;
    isCompleted: boolean;
}
