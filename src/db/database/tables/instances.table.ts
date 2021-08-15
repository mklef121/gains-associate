import { DATA_TYPE, ITable } from "jsstore";

export const instanceTableName = 'instances';
export const instances: ITable = {
    name: instanceTableName,
    columns: {
        id: { primaryKey: true, autoIncrement: true },
        name: { notNull: true, dataType: DATA_TYPE.String, enableSearch: true},
        ecu:  { notNull: true, dataType: DATA_TYPE.Number, default: 0  },
        fpga: { notNull: true, dataType: DATA_TYPE.Number, default: 0 },
        gpu: { notNull: true, dataType: DATA_TYPE.Number, default: 0 },
        gpuMemory: { notNull: true, dataType: DATA_TYPE.Number, default: 0 },
        gpuModel: { dataType: DATA_TYPE.String },
        arch: { dataType: DATA_TYPE.Array, multiEntry: true },
        availabilityZones: { dataType: DATA_TYPE.Object, notNull: false },
        clockSpeedGhz: { dataType: DATA_TYPE.String },
        computeCapability: { dataType: DATA_TYPE.Number },
        ebsAsNvme: { dataType: DATA_TYPE.Boolean },
        ebsIops: { dataType: DATA_TYPE.Number },
        ebsMaxBandwidth: { dataType: DATA_TYPE.Number },
        ebsOptimized: { dataType: DATA_TYPE.Boolean },
        ebsThroughput: { dataType: DATA_TYPE.Number },
        emr: { dataType: DATA_TYPE.Boolean },
        enhancedNetworking: { dataType: DATA_TYPE.Boolean },
        family: { dataType: DATA_TYPE.String },
        generation: { dataType: DATA_TYPE.String },
        instanceType: { dataType: DATA_TYPE.String },
        intelAvx: { dataType: DATA_TYPE.Boolean },
        intelAvx2: { dataType: DATA_TYPE.Boolean },
        intelAvx512: { dataType: DATA_TYPE.Boolean },
        intelTurbo: { dataType: DATA_TYPE.Boolean },
        ipv6Support: { dataType: DATA_TYPE.Boolean },
        linuxVirtualizationTypes: { dataType: DATA_TYPE.Array },
        memory: { dataType: DATA_TYPE.Number },
        networkPerformance: { dataType: DATA_TYPE.String },
        physicalProcessor: { dataType: DATA_TYPE.String },
        placementGroupSupport: { dataType: DATA_TYPE.Boolean },
        prettyName: { dataType: DATA_TYPE.String },
        storage: { dataType: DATA_TYPE.Object },
        vCPU: { dataType: DATA_TYPE.Number },

    }
}
