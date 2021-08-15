import { IDataBase } from 'jsstore';
import {connection} from '../connection.db'
import { instanceType } from './tables/instance-type.table';
import { instances } from './tables/instances.table';
import { pricingRegion } from './tables/pricing-region.table';
import { pricings } from './tables/pricing.table';
import { products } from './tables/products.table';
import { students } from './tables/users.table';

export type TAvailableDatabases = "school";
const schoolDataBase: IDataBase = {
    name: "school",
    version: 1,
    tables: [students, products, instanceType, instances, pricingRegion, pricings]
};

// {[key in TAvailableDatabases]: IDataBase}

const databases = {
    school: schoolDataBase
}

export const initJsStore = async (database: TAvailableDatabases) => {
    return await connection.initDb(databases[database]);
};