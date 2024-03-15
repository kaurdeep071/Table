export interface JobListData {
    jobId: number,
    Stage: string,
    Action: string,
    DateTime: Date,
    ActionBy: string,
    HoursSpent: number,
    orderBy: string,
    orderByDescending: boolean,
    allRecords: boolean,
    page: number,
    limit: number
}

export interface questionData {
    jobId: number,
    templateId: number,
    questionId: number,
    parentId: number,
    parentType: String,
    parentDetailId: number,
    isDraft: boolean,
    userName: String,
    rootQuestionId: number,
    selectedStageId: number
}

export interface saveData {
    jobId?: number,
    questionId?: number,
    rootQuestionId?: number,
    templateId?: number,
    questionDetailId?: number,
    linkWithId?: number,
    linkInventory?: boolean,
    options?: [],
    files?: [],
}

// export interface answerOption {
//     optionId: number,
//     optionText: String,
//     questionDetailId : number
// }