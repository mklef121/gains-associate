import { IDataProcessResult } from "../core/interfaces-types";


onmessage = async function (_e: MessageEvent<any>) {
    let result: null | IDataProcessResult
    result = getDatabaseData(await getFileStreamAndProcess());

    //@ts-ignore
    postMessage(result);

    //Free up memorry, so gabage collector has less work to do
    result = null

}

export const getDatabaseData = (data: any[]) => {

    /**
     *  Objects and arrays are passed by reference in javascript, this usecase becomes very helpful here
     * Since we are dealing with heavy data, we would not want to copy and recreate objects on the fly
     * so I use these setup objects at the top function.
     */
    let pricingRegionMap: Record<string, boolean> | null = {};
    let instanceTypeMap: Record<string, boolean> | null = {};
    const regionsArray: Record<string, any>[] = [];
    const instanceTypeArray: Record<string, any>[] = [];
    const pricesArray: Record<string, any>[] = [];
    const instanceArray: Record<string, any>[] = [];
    for (let index = 0; index < data.length; index++) {

        pricingRegionAndInstanceType(data[index].pricing, pricingRegionMap,
            instanceTypeMap,
            regionsArray,
            instanceTypeArray,
            pricesArray,
            data[index].pretty_name,
            data[index].instance_type)

        instanceArray.push({
            name: data[index].pretty_name,
            fpga: Number(data[index].FPGA || 0),
            ecu: Number(data[index].ECU || 0),
            gpu: Number(data[index].GPU || 0),
            gpuMemory: Number(data[index].GPU_memory || 0),
            gpuModel: data[index].GPU_model,
            arch: data[index].arch || [],
            availabilityZones: data[index].availability_zones,
            clockSpeedGhz: data[index].clock_speed_ghz,
            computeCapability: data[index].compute_capability,
            ebsAsNvme: data[index].ebs_as_nvme,
            ebsIops: data[index].ebs_iops,
            ebsMaxBandwidth: data[index].ebs_max_bandwidth,
            ebsOptimized: data[index].ebs_optimized,
            ebsThroughput: data[index].ebs_throughput,
            emr: data[index].emr,
            enhancedNetworking: data[index].enhanced_networking,
            family: data[index].family,
            generation: data[index].generation,
            instanceType: data[index].instance_type,
            intelAvx: data[index].intel_avx,
            intelAvx2: data[index].intel_avx2,
            intelAvx512: data[index].intel_avx512,
            intelTurbo: data[index].intel_turbo,
            ipv6Support: data[index].ipv6_support,
            linuxVirtualizationTypes: data[index].linux_virtualization_types,
            memory: data[index].memory,
            networkPerformance: data[index].network_performance,
            physicalProcessor: data[index].physical_processor,
            placementGroupSupport: data[index].placement_group_support,
            prettyName: data[index].pretty_name,
            storage: data[index].storage,
            vCPU: data[index].vCPU,
        })

    }

    //Free up from memory, so gabage collector has less work top do
    pricingRegionMap = null
    instanceTypeMap = null
    return {
        regionsArray,
        instanceTypeArray,
        pricesArray,
        instanceArray,
    }
}

/**
 * 
 * @param {Object} pricing - Pricing details
 * @param {Object} regionMap -  A map tracking which region we have pushed into the array to be created
 * @param {Object} instanceTypeMap - A map tracking which instance type has been marked for creation
 * @param {Array} regionsArray - An array of regions to be created
 * @param {Array} instanceTypeArray - An array of instance types to be created
 */
export const pricingRegionAndInstanceType = (pricing: Record<string, any>,
    regionMap: Record<string, boolean>,
    instanceTypeMap: Record<string, boolean>,
    regionsArray: Record<string, any>[],
    instanceTypeArray: Record<string, any>[],
    pricesArray: Record<string, any>[],
    instanceName: string,
    machineType: string) => {

    //Go through the region data and get pricing details in it
    for (const region in pricing) {
        if (!regionMap[region]) {
            regionsArray.push({ name: region });
            regionMap[region] = true;
        }

        //form data for instance type and pricing
        for (const instanceType in pricing[region]) {
            if (!instanceTypeMap[instanceType]) {
                instanceTypeArray.push({ name: instanceType });
                instanceTypeMap[instanceType] = true;
            }

            pricesArray.push({
                pricingRegionName: region,
                instanceTypeName: instanceType,
                instanceName,
                onDemand: Number(pricing[region][instanceType].ondemand || 0),
                spotMax: Number(pricing[region][instanceType].spot_max || 0),
                spotMin: Number(pricing[region][instanceType].spot_min || 0),
                spot: pricing[region][instanceType].spot || [],
                reserved: pricing[region][instanceType].reserved,
                
                //One instance can have same name but exist in difference types,
                //Instead of having multiple compisite key, I will use this to get the id
                //of the instance when created 
                instanceHash: instanceName+'::'+machineType
            })
        }
    }

}

/**
 * Use streams to make sure file is consumed from network in bits so as to save memory and wait time
 */
export const getFileStreamAndProcess = () => {
    return fetch('/instances.json')
        .then((response) => response.body)
        .then((body) => {
            const reader = body?.getReader()
            return new ReadableStream({
                start(controller) {
                    return pump();
                    function pump(): any {
                        return reader?.read().then(({ done, value }) => {
                            // When no more data needs to be consumed, close the stream
                            if (done) {
                                controller.close();
                                return;
                            }
                            // Enqueue the next data chunk into our target stream
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                }
            })
        })
        .then(stream => new Response(stream))
        .then(response => response.text())
        .then((text): any[] => JSON.parse(text));
}