import { connection } from "../db/connection.db";
import { instanceTypeTableName } from "../db/database/tables/instance-type.table";
import { instanceTableName } from "../db/database/tables/instances.table";
import { pricingRegionTableName } from "../db/database/tables/pricing-region.table";
import { pricingTableName } from "../db/database/tables/pricing.table";
import Worker from "worker-loader!../worker/read-file.worker.ts";
import { IDataProcessResult, IProcessedData } from "../core/interfaces-types";


export const populateDatabase = (): Promise<boolean> => {

    return new Promise(async (resolve, reject) => {
        let fileDataWorker: Worker = new Worker();

        fileDataWorker.onmessage = async (ev: MessageEvent<IDataProcessResult>) => {
            try {
                await saveDatabaseData(ev.data);

                resolve(true)
            } catch (error) {
                reject(error)
            }

            fileDataWorker.terminate()
        }

        //The file to be process can be very heavy, so i delegate it to the background let a worker process it 
        //In another thread.
        fileDataWorker.postMessage("");
    })

}


export const saveDatabaseData = async (data: IDataProcessResult) => {
    let instanceIdMap: Record<string, number> | null = {}
    await connection.insert({
        into: pricingRegionTableName,
        values: data.regionsArray,
        skipDataCheck: false,
    });

    await connection.insert({
        into: instanceTypeTableName,
        values: data.instanceTypeArray,
        skipDataCheck: false,
    });

    let instances: Record<string, any>[] | null | number;
    instances = await connection.insert({
        into: instanceTableName,
        values: data.instanceArray,
        return: true,
        skipDataCheck: false,
    });

    (instances as Record<string, any>[]).forEach((instance: Record<string, any>) => {
        (instanceIdMap as Record<string, number>)[instance.name + "::" + instance.instanceType] = instance.id
    })

    await connection.insert({
        into: pricingTableName,
        values: data.pricesArray.map((price) => {
            price.instanceId = instanceIdMap?.[price.instanceHash];
            delete price.instanceHash;
            return price;
        }),
        skipDataCheck: false,
    });

    //free up this object
    instances = null;
}


export const getAggregateData = async (monthlyIncrement: number  = 50, upperBound: number = 1000):Promise<IProcessedData> => {
    if(upperBound < monthlyIncrement) return  {labels:[], dataSet:[], instances:[], regions:[] }
   
    //Instances that have been looped over
    const seenInstances: Record<number, boolean> = {};

    //Regions that have been looped over
    const seenRegions: Record<number, boolean> = {};

    const boundaryName: Record<number, string> = {};
    const minSpotBoundaryData: Record<number, number[]> = {};
    // const maxSpotBoundaryData: Record<number, number[]> = {};

    /**
     * There is approximately 730 hours in a month, So I convert all input into Hours.
     * This is because results in our database are saved in hours
     */
    let incrementInHours = monthlyIncrement/730;
    let upperBoundInHours = upperBound/730;

    let divisions = Math.ceil(upperBoundInHours/incrementInHours);

    let beginAt = 0;
    for (let index = 1; index <= divisions; index++) {
        boundaryName[index] = `${beginAt*monthlyIncrement} to ${index*monthlyIncrement}`;
        minSpotBoundaryData[index] = [];
        beginAt++;
    }

    boundaryName[divisions + 1] = `Above ${divisions * monthlyIncrement}`;
    minSpotBoundaryData[divisions + 1] = [];

     const result: Record<string, any> = await connection.select({
        from: instanceTableName,
        join:{
            with: pricingTableName,
            on: `${instanceTableName}.id = ${pricingTableName}.instanceId`,
            where:{
                instanceTypeName: 'linux'
            },
            as: {
                id: "pricingId"
            } 
        }
    });

    for (let index = 0; index < result.length; index++) {
        let current:  Record<string, any> = result[index];

        if(!seenInstances[current?.id]) seenInstances[current?.id] = true;
        if(!seenRegions[current?.pricingRegionName]) seenRegions[current?.pricingRegionName] = true;
        const minimumSpotPrice =  Math.ceil(current?.spotMin);
        
        if(minimumSpotPrice === 0) minSpotBoundaryData[1].push(minimumSpotPrice);

        if(minimumSpotPrice <= divisions && minimumSpotPrice !== 0) {
            minSpotBoundaryData[minimumSpotPrice].push(current?.spotMin);
        }
        else if(minimumSpotPrice > divisions && minimumSpotPrice !== 0) {
            minSpotBoundaryData[divisions + 1].push(current?.spotMin);
        }
    }

    const labels: string[] = []
    const dataSet: number[] = []

    for (let index = 1; index <= divisions; index++) {
        labels.push(boundaryName[index]);
        dataSet.push(minSpotBoundaryData[index].length)
    }
    return {
        labels,
        dataSet,
        instances: Object.keys(seenInstances),
        regions: Object.keys(seenRegions),
    }
    
    
}