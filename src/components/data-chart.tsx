import { Chart, ChartOptions, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';
import { IProcessedData } from '../core/interfaces-types';


enum chartType {
    LINE = 'line'
}
export function DataChart(props:{data:IProcessedData}) {
    const chartEl = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        Chart.register(...registerables);
        const data = {
            labels: props.data.labels,
            datasets: [{
                label: 'Instance Spot Groups',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: props.data.dataSet,
            }]
        };

        const config = {
            type: chartType.LINE,
            data,
            options: {
                // maintainAspectRatio: false
                aspectRatio: 3,
            } as ChartOptions
        };

        let myCharts = new Chart(
            chartEl.current as HTMLCanvasElement,
            config
        );

        return () => {
            myCharts.destroy()
        }
    }, [props.data.dataSet, props.data.labels])

    return (<div className="relative w-full h-1/2" >
        <canvas id="chart" ref={chartEl}></canvas>

    </div>)
}