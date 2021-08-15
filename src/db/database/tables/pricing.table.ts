import { DATA_TYPE, ITable } from "jsstore";

export const pricingTableName = 'pricings';
export const pricings: ITable = {
    name: pricingTableName,
    columns: {
        id: { primaryKey: true, autoIncrement: true },
        pricingRegionName: { notNull: true, dataType: DATA_TYPE.String, enableSearch: true},
        instanceTypeName: { notNull: true, dataType: DATA_TYPE.String, enableSearch: true},
        instanceId: { notNull: true, dataType: DATA_TYPE.Number, enableSearch: true},
        onDemand: { dataType: DATA_TYPE.Number},
        spotMax: { dataType: DATA_TYPE.Number},
        spotMin: { dataType: DATA_TYPE.Number},
        spot: { dataType: DATA_TYPE.Array, multiEntry: true},
        reserved: { dataType: DATA_TYPE.Object },
    }
}