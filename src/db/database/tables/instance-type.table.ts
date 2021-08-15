import { DATA_TYPE, ITable } from "jsstore";

export const instanceTypeTableName = 'instanceType';
export const instanceType: ITable = {
    name: instanceTypeTableName,
    columns: {
        id: { primaryKey: true, autoIncrement: true },
        name: { notNull: true, dataType: DATA_TYPE.String, enableSearch: true, unique: true},
    }
}