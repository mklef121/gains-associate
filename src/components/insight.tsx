import { IProcessedData } from "../core/interfaces-types";

export function Insight(props:{data:IProcessedData}){
    return (
        <section className="flex items-center justify-around bg-white rounded-md shadow-sm px-4 py-3 text-base font-medium text-gray-600 mt-5">
                <p className="">
                    Insight Data
                </p>

                <div className="flex flex-col space-y-2 items-center">
                    <p>
                        {props.data.instances.length}
                    </p>
                    <p className="text-xs font-thin text-gray-400">
                        Instances
                    </p>
                </div>

                <div className="flex flex-col space-y-2 items-center">
                    <p>
                        {props.data.regions.length}
                    </p>
                    <p className="text-xs font-thin text-gray-400">
                        Regions
                    </p>
                </div>

                <div className="flex flex-col space-y-2 items-center">
                    <p>
                        {props.data.labels.length}
                    </p>
                    <p className="text-xs font-thin text-gray-400">
                        Increment gaps
                    </p>
                </div>
            </section>
    )
}