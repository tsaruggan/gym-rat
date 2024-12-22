import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';
import 'chartjs-adapter-date-fns';
import regression from 'regression';

// change default font
import { Chart as ChartJS, Legend } from 'chart.js';
import { GeistMono } from "geist/font/mono";
ChartJS.defaults.font.family = GeistMono.style.fontFamily;

function ExerciseProgressDisplay({ history }) {
    const [data, setData] = useState([]);
    const [volumeLoadChartData, setVolumeLoadChartData] = useState({});
    const [averageWeightChartData, setAverageWeightChartData] = useState({});

    const timeRangeOptions = [
        { label: '2 weeks', value: 14 },
        { label: '1 month', value: 30 },
        { label: '3 months', value: 90 },
        { label: '6 months', value: 180 }
    ];
    const [timeRange, setTimeRange] = useState(timeRangeOptions[0].value);

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.value);
    };

    useEffect(() => {
        if (history && history.length > 0) {
            // preprocess the exercise history to get each log's date, volume load, average weight, and point color
            const data = [];
            for (let i = history.length - 1; i >= 0; i--) {
                const exercise = history[i];
                const date = new Date(exercise.date);
                const workingSets = exercise.sets.filter((set) => !set.warmUp);
                const volumeLoad = workingSets.reduce((acc, set) => acc + set.weight * set.reps, 0);
                // const averageWeight = workingSets.reduce((acc, set) => acc + set.weight, 0) / workingSets.length;
                const totalReps = workingSets.reduce((acc, set) => acc + set.reps, 0);
                const averageWeight = workingSets.reduce((acc, set) => acc + set.weight * set.reps, 0) / totalReps; // weighted average

                // color points based on improvement or decline
                const gray = 'rgb(174, 174, 178)';
                const green = 'rgb(52, 199, 89)';
                const red = 'rgb(255, 59, 48)';
                let volumeLoadColor = gray;
                let averageWeightColor = gray;
                if (i < history.length - 1) {
                    let previousVolumeLoad = data[data.length - 1].volumeLoad;
                    if (volumeLoad > previousVolumeLoad) {
                        volumeLoadColor = green;
                    } else if (volumeLoad < previousVolumeLoad) {
                        volumeLoadColor = red;
                    }

                    let previousAverageWeight = data[data.length - 1].averageWeight;
                    if (averageWeight > previousAverageWeight) {
                        averageWeightColor = green;
                    } else if (averageWeight < previousAverageWeight) {
                        averageWeightColor = red;
                    }
                }
    
                data.push({ 
                    date: date, 
                    volumeLoad: volumeLoad,
                    averageWeight: averageWeight,
                    volumeLoadColor: volumeLoadColor,
                    averageWeightColor: averageWeightColor
                });
            }
            setData(data);
        }
    }, [history]);

    useEffect(() => {
        if (data && data.length > 0 && timeRange) {
            // filter data to include only points within the time range
            const cutoffDate = new Date(data[data.length-1].date);
            cutoffDate.setDate(cutoffDate.getDate() - timeRange);
            const filteredData = data.filter((point) => point.date >= cutoffDate);

            //// aggregate data in correct format for chart.js
            const volumeLoadData = filteredData.map((point) => ({ x: point.date, y: point.volumeLoad }));
            const averageWeightData = filteredData.map((point) => ({ x: point.date, y: point.averageWeight }));

            const volumeLoadBackgroundColor = filteredData.map((point) => point.volumeLoadColor);
            const averageWeightBackgroundColor = filteredData.map((point) => point.averageWeightColor);

            //// use regression.js to generate trendlines
            const minDate = Math.min(...filteredData.map(point => point.date.getTime()));
            const millisPerDay = 1000 * 60 * 60 * 24;
            const normalizeDate = (date) => Math.floor((date.getTime() - minDate) / millisPerDay);
            const normalizeTimeSeries = (timeSeries) => timeSeries.map((point) => [normalizeDate(point.x), point.y]);
            const regressionVolumeLoadData = normalizeTimeSeries(volumeLoadData);
            const regressionAverageWeightData = normalizeTimeSeries(averageWeightData);

            const volumeLoadTrend = regression.polynomial(regressionVolumeLoadData, { order: 1,  precision: 3 });
            const averageWeightTrend = regression.polynomial(regressionAverageWeightData, { order: 1, precision: 3 });

            const restoreDate = (date) => new Date(date * millisPerDay + minDate);
            const restoreTimeSeries = (normalizedTimeSeries) => normalizedTimeSeries.map((point) => ({ x: restoreDate(point[0]), y: point[1] }));
            const volumeLoadTrendlineData = restoreTimeSeries(volumeLoadTrend.points);
            const averageWeightTrendlineData = restoreTimeSeries(averageWeightTrend.points);

            console.log(volumeLoadTrend)

            // const cutoffNormalizedDate = normalizeDate(cutoffDate);
            // const extendTrendlineToCutoff = (trend, trendlineData) => {
            //     const yAtCutoff = trend.predict(cutoffNormalizedDate)[1];
            //     trendlineData.unshift({ x: cutoffDate, y: yAtCutoff });
            // }
            // extendTrendlineToCutoff(volumeLoadTrend ,volumeLoadTrendlineData);
            // extendTrendlineToCutoff(averageWeightTrend, averageWeightTrendlineData);

            const volumeLoadChartData = {
                datasets: [
                    {
                        label: 'Volume Load',
                        data: volumeLoadData,
                        pointBackgroundColor: volumeLoadBackgroundColor,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        type: 'scatter',
                        borderColor: 'transparent',
                    },
                    {
                        data: volumeLoadTrendlineData,
                        borderColor: 'rgb(30, 144, 255)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4,
                        type: 'line',
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        tooltip: {
                            enabled: false
                        }
                    }
                ]
            };

            const averageWeightChartData = {
                datasets: [
                    {
                        label: 'Average Weight',
                        data: averageWeightData,
                        pointBackgroundColor: averageWeightBackgroundColor,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        type: 'scatter',
                        borderColor: 'transparent',
                    },
                    {
                        data: averageWeightTrendlineData,
                        borderColor: 'rgb(249, 200, 96)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4,
                        pointRadius: 0,
                        type: 'line',
                        pointHoverRadius: 0,
                        tooltip: {
                            enabled: false
                        }
                    }
                ]
            };

            setVolumeLoadChartData(volumeLoadChartData);
            setAverageWeightChartData(averageWeightChartData);
        }
    }, [data, timeRange]);
    

    const volumeLoadChartOptions = {
        scales: {
            x: {
                type: 'time',
                time: { unit: 'day', tooltipFormat: 'PPP' },
                title: { display: false, text: 'Date' },
            },
            y: {
                title: { display: false, text: 'Volume Load (lb)' },
                display: true,
                ticks: { display: true },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: { displayColors: false },
            title: { 
                display: true,  
                text: 'Volume Load (lb)', 
                padding: { top: 8, bottom: 8 },
                color: 'rgb(0, 73, 147)',
            },            
        },
        maintainAspectRatio: false
    };

    const averageWeightChartOptions = {
        scales: {
            x: {
                type: 'time',
                time: { unit: 'day', tooltipFormat: 'PPP' },
                title: { display: false, text: 'Date' },
            },
            y: {
                title: { display: false, text: 'Average Weight (lb)' },
                display: true,
                ticks: { display: true },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: { displayColors: false },      
            title: { 
                display: true,  
                text: 'Average Weight (lb)',
                padding: { top: 8, bottom: 8 },
                color: 'rgb(140, 96, 1)',       
            },
            
        },
        maintainAspectRatio: false
    };

    

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ border: 'solid 1px #dee2e6', padding: '12px'}}>
                <Chart 
                    type="scatter" 
                    data={volumeLoadChartData} 
                    options={volumeLoadChartOptions} 
                    style={{ aspectRatio: '1 / 1', width: '100%', height: '100%', maxHeight: '300px' }} 
                />
            </div>
            <div style={{ border: 'solid 1px #dee2e6', padding: '12px'}}>
                <Chart 
                    type="scatter" 
                    data={averageWeightChartData} 
                    options={averageWeightChartOptions} 
                    style={{ aspectRatio: '1 / 1', width: '100%', height: '100%', maxHeight: '300px' }} 
                />
            </div>
            <div>
                <Dropdown 
                    value={timeRange} 
                    options={timeRangeOptions} 
                    onChange={handleTimeRangeChange} 
                    style={{ padding: '12px' }} 
                />
            </div>
            
        </div>
    );
}

export default ExerciseProgressDisplay;
