export interface hourslist{
    userId: number,
    IsAdmin: boolean,
    type: string,
    page: number,
    limit: number,
    orderBy: string,
    orderByDescending: boolean,
    allRecords: boolean,
    message: string
}