import { useEffect, useState } from "react"
import { connection } from "../db/connection.db";
import { instanceTypeTableName } from "../db/database/tables/instance-type.table";
import { instanceTableName } from "../db/database/tables/instances.table";
import { pricingRegionTableName } from "../db/database/tables/pricing-region.table";
import Worker from "worker-loader!../worker/read-file.worker.ts";
import { pricingTableName } from "../db/database/tables/pricing.table";

export interface IDataProcessResult {
    regionsArray: Record<string, any>[],
    instanceTypeArray: Record<string, any>[],
    pricesArray: Record<string, any>[],
    instanceArray: Record<string, any>[],
}

let fileDataWorker: Worker
export const useInstanceData = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fileDataWorker = new Worker();
        fileDataWorker.onmessage = async (ev: MessageEvent<IDataProcessResult>) => {
            console.log("Main Hook Received data from worker", ev.data.instanceArray[0]);
            await saveDatabaseData(ev.data)
            setIsLoading(false)
        }

        return () => {
            // if this current view is taken out of the screen, kill the worker
            fileDataWorker?.terminate()
        }
    }, [])

    const fetchData = () => {
        setIsLoading(true)
        //The file to be process can be very heavy, so i delegate it to the background let a worker process it 
        //In another thread.
        fileDataWorker.postMessage("");
    }

    return { isLoading, fetchData };

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

