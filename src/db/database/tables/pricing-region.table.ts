import { DATA_TYPE, ITable } from "jsstore";

export const pricingRegionTableName = 'pricingRegions';
export const pricingRegion: ITable = {
    name: pricingRegionTableName,
    columns: {
        id: { primaryKey: true, autoIncrement: true },
        name: { notNull: true, dataType: DATA_TYPE.String, enableSearch: true, unique: true}
    }
}