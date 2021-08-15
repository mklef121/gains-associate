import { ITable } from "jsstore";

export const productTableName= 'products';
export const products: ITable = {
    name: productTableName,
    columns: {
        // Here "Id" is name of column 
        id: { primaryKey: true, autoIncrement: true },
        itemName: { notNull: true, dataType: "string" },
        price: { notNull: true, dataType: "number" },
        quantity: { notNull: true, dataType: "number" }
    }
}