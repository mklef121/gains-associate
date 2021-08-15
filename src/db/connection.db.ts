import { Connection } from "jsstore";

export const getWorkerPath = () => {
    // return dev build when env is development
    if (process.env.NODE_ENV === 'development') {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");
    }
    else { // return prod build when env is production
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
    }
};

export const connection = new Connection(new Worker(getWorkerPath().default));

if(process.env.NODE_ENV === 'development')connection.logStatus = true 
else connection.logStatus = false 