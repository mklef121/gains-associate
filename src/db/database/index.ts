import { IDataBase } from 'jsstore';
import {connection} from '../connection.db'
import { instanceType } from './tables/instance-type.table';
import { instances } from './tables/instances.table';
import { pricingRegion } from './tables/pricing-region.table';
import { pricings } from './tables/pricing.table';

const schoolDataBase: IDataBase = {
    name: "awsPicing",
    version: 1,
    tables: [instanceType, instances, pricingRegion, pricings]
};

//Incase I have multiple databases, this map helps me hold them together
const databases = {
    awsPicing: schoolDataBase
}

export type TAvailableDatabases = keyof (typeof databases)

export const initJsStore = async (database: TAvailableDatabases) => {
    return await connection.initDb(databases[database]);
};