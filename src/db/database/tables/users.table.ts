import { DATA_TYPE, ITable } from "jsstore";

export const studentTableName= 'students';
export const students: ITable = {
    name: studentTableName,
    columns: {
        id: {
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        gender: {
            dataType: DATA_TYPE.String,
            default: 'male'
        },
        country: {
            notNull: true,
            dataType: DATA_TYPE.String
        },
        city: {
            dataType: DATA_TYPE.String,
            notNull: true
        }
    }
}