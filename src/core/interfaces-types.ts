export interface IProcessedData{
    labels: string[];
    dataSet: number[];
    instances: string[];
    regions: string[];
}

export interface IDataProcessResult {
    regionsArray: Record<string, any>[],
    instanceTypeArray: Record<string, any>[],
    pricesArray: Record<string, any>[],
    instanceArray: Record<string, any>[],
}