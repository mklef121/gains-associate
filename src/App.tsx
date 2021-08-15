// import graph from '../assets/graph.png';
import { useEffect, useState } from 'react';
import { IProcessedData } from './core/interfaces-types';
import { getValidNumber } from './core/utils';
import { useStartDb } from './hooks/store-db.hooks';
import { getAggregateData } from './services/db-data.service';
import { DataChart } from './components/data-chart';
import { Insight } from './components/insight';
import { Spinner } from './components/spinner';

export function App() {
    const {isInitialized} = useStartDb();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [incrementAmount, setIncrementAmount] = useState(50);
    const [upperLimit, setupperLimit] = useState(1000);
    const [chartData, setChartData] =  useState<IProcessedData>({labels:[], dataSet:[], instances:[], regions:[]});
    const filterData = async () => {
        if(isLoading) return;

        setIsLoading(true)
        try {
          let data= await getAggregateData(incrementAmount, upperLimit)
            setChartData(data);
        } catch (error) {
            console.log("an error occured", error);
            
        }
        setIsLoading(false)
    }
    
    //fetch Data and fill chart once DB is initialized
    useEffect(() => {
        if(isInitialized) filterData();
    },[isInitialized])

    return (
        <main className="flex flex-col bg-gray-fade w-full h-screen overflow-y-scroll font-normal p-8"
            style={{ fontFamily: "BRFirma" }}>
           
            
            <section className="flex flex-col bg-white py-6 px-5 shadow" >
                <h4 className="text-lg font-semibold text-center pt-4 w-full">
                    Monthly AWS Instance Spot Price
                </h4>

                <div className="flex justify-between flex-wrap items-center mt-6">
                    <div className="flex items-start flex-wrap w-full md:w-auto">
                        <div className="flex flex-col mr-4">
                            <input className="flex-1 appearance-none border border-gray-200 w-40 py-2 px-4 bg-white text-gray-700 
                                         placeholder-gray-400 shadow-md rounded-md text-base focus:outline-none 
                                         focus:ring-1 focus:ring-yellow-600 focus:border-transparent"
                                value={incrementAmount}
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                    setIncrementAmount(getValidNumber(ev.target.value))
                                }}
                                type="email" placeholder="Increments" />
                            <p className="text-sm font-normal text-gray-500 mt-1.5 ml-1">
                                Increments
                            </p>
                        </div>

                        <div className="flex flex-col mr-4">
                            <input className="flex-1 appearance-none border border-gray-200 w-40 py-2 px-4 bg-white text-gray-700 
                                         placeholder-gray-400 shadow-md rounded-md text-base focus:outline-none 
                                         focus:ring-1 focus:ring-yellow-600 focus:border-transparent"
                                value={upperLimit}
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                    setupperLimit(getValidNumber(ev.target.value))
                                }}
                                type="email" placeholder="Upper Limit" />
                            <p className="text-sm font-normal text-gray-500 mt-1.5 ml-1">
                                Upper Limit
                            </p>
                        </div>
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                           { isInitialized && <button className="px-4 py-2 appearance-none rounded border-0 bg-yellow-500 text-white font-light"
                                onClick={() => filterData()}>
                                Filter
                            </button>
                          }
                        </div>

                    </div>

                    <div className="flex justify-center lg:justify-end items-center  w-full md:w-auto mt-6 lg:-mt-4">
                        <div className="flex items-center mr-4">
                            <p className="p-1.5 bg-purple-500 rounded-full mr-2">
                            </p>
                            <p className="text-xs">
                                {incrementAmount} dollars Increment
                            </p>
                        </div>

                        <div className="flex items-center mr-4">
                            <p className="p-1.5 bg-pink-500 rounded-full mr-2">
                            </p>
                            <p className="text-xs">
                                {upperLimit} dollars Upper Limit
                            </p>
                        </div>

                    </div>
                </div>
                {
                    !isInitialized || isLoading ? 
                    (<div className="w-full flex py-20 justify-center">
                    <Spinner className="text-yellow-300 w-20 h-20"/>
                    </div>) 
                    :  <DataChart data={chartData}/>
                }

            </section>

            <Insight data={chartData}/>

        </main>
    )
}