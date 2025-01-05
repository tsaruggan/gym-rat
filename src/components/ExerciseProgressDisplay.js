import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';
import 'chartjs-adapter-date-fns';
import regression from 'regression';
import { lbToKg } from "@/utils/conversions";

// change default font
import { Chart as ChartJS, Legend } from 'chart.js';
import { GeistMono } from "geist/font/mono";
ChartJS.defaults.font.family = GeistMono.style.fontFamily;

const timeRangeOptions = [
    { label: '2 weeks', value: 14 },
    { label: '1 month', value: 30 },
    { label: '3 months', value: 90 },
    { label: '6 months', value: 180 }
];

export default function ExerciseProgressDisplay({ history, units='lb' }) {
    const [data, setData] = useState([]);
    const [volumeLoadChartData, setVolumeLoadChartData] = useState({});
    const [averageWeightChartData, setAverageWeightChartData] = useState({});
    const [timeRange, setTimeRange] = useState(timeRangeOptions[0].value);

    // colors
    const getColor = (colorVar) => {
        return getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
    };
    const color1 = getColor('--graph-color1');
    const color2 = getColor('--graph-color2');
    const gridColor = getColor('--grid-color');
    const red = getColor('--red');
    const green = getColor('--green');
    const gray = getColor('--gray');

    useEffect(() => {
        if (history && history.length > 0) {
            // preprocess the exercise history to get each log's date, volume load, average weight, and point color
            const data = [];
            for (let i = history.length - 1; i >= 0; i--) {
                const exercise = history[i];
                const date = new Date(exercise.date);
                
                const workingSetsLb = exercise.sets.filter((set) => !set.warmUp);
                const workingSets = workingSetsLb.map((set) => {
                    if (units === "kg") {
                        return { ...set, weight: lbToKg(set.weight) };
                    }
                    return set;
                });

                let volumeLoad = workingSets.reduce((acc, set) => acc + set.weight * set.reps, 0);
                volumeLoad = Math.round(volumeLoad);
                // const averageWeight = workingSets.reduce((acc, set) => acc + set.weight, 0) / workingSets.length;
                const totalReps = workingSets.reduce((acc, set) => acc + set.reps, 0);
                let averageWeight = workingSets.reduce((acc, set) => acc + set.weight * set.reps, 0) / totalReps; // weighted average
                // averageWeight = Math.round(averageWeight * 2) / 2; // Round to nearest 0.5
                averageWeight = Math.round(averageWeight * 10) / 10;

                // color points based on improvement or decline
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
                    averageWeightColor: averageWeightColor,
                    exercise: exercise
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
            const volumeLoadData = filteredData.map((point) => ({ x: point.date, y: point.volumeLoad, exercise: point.exercise }));
            const averageWeightData = filteredData.map((point) => ({ x: point.date, y: point.averageWeight, exercise: point.exercise }));

            const volumeLoadBackgroundColor = filteredData.map((point) => point.volumeLoadColor);
            const averageWeightBackgroundColor = filteredData.map((point) => point.averageWeightColor);

            //// use regression.js to generate trendlines
            const minDate = Math.min(...filteredData.map(point => point.date.getTime()));
            const millisPerDay = 1000 * 60 * 60 * 24;
            const normalizeDate = (date) => (date.getTime() - minDate) / millisPerDay;
            const normalizeTimeSeries = (timeSeries) => timeSeries.map((point) => [normalizeDate(point.x), point.y]);
            const regressionVolumeLoadData = normalizeTimeSeries(volumeLoadData);
            const regressionAverageWeightData = normalizeTimeSeries(averageWeightData);

            const volumeLoadTrend = regression.polynomial(regressionVolumeLoadData, { order: 1,  precision: 3 });
            const averageWeightTrend = regression.polynomial(regressionAverageWeightData, { order: 1, precision: 3 });

            const restoreDate = (date) => new Date(date * millisPerDay + minDate);
            const restoreTimeSeries = (normalizedTimeSeries) => normalizedTimeSeries.map((point) => ({ x: restoreDate(point[0]), y: point[1] }));
            const volumeLoadTrendlineData = restoreTimeSeries(volumeLoadTrend.points);
            const averageWeightTrendlineData = restoreTimeSeries(averageWeightTrend.points);

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
                        borderColor: color1,
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4,
                        type: 'line',
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        tooltip: { enabled: false }
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
                        borderColor: color2,
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4,
                        pointRadius: 0,
                        type: 'line',
                        pointHoverRadius: 0,
                        tooltip: { enabled: false }
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
                grid: { color: gridColor },
            },
            y: {
                title: { display: false, text: `Volume Load (${units})` },
                grid: { color: gridColor },
                display: true,
                ticks: { 
                    display: true,
                    callback: (value) => value.toLocaleString('en-US', { useGrouping: false }),
                },
                afterFit: (axis) => axis.width = 50
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                displayColors: false,
                mode: "nearest",
                intersect: true,
                filter: (tooltipItem) => tooltipItem.dataset.type !== "line",
                callbacks: {
                    title: (tooltipItem) => renderToolTipTitle(tooltipItem),
                    label: (tooltipItem) => renderTooltipLabel(tooltipItem),
                    footer: (tooltipItem) => renderToolTipFooter(tooltipItem, "Volume Load")
                },
            },
            title: { 
                display: true,  
                text: `Volume Load (${units})`, 
                padding: { top: 8, bottom: 8 },
                color: color1,
                font: { size: '14px' }       
            },
        },
        maintainAspectRatio: false,
    };    

    const averageWeightChartOptions = {
        scales: {
            x: {
                type: 'time',
                time: { unit: 'day', tooltipFormat: 'PPP' },
                title: { display: false, text: 'Date' },
                grid: { color: gridColor },
            },
            y: {
                title: { display: false, text: `Average Weight (${units})` },
                grid: { color: gridColor },
                display: true,
                ticks: { 
                    display: true,
                    callback: (value) => value.toLocaleString('en-US', { useGrouping: false }),
                },
                afterFit: (axis) => axis.width = 50
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                displayColors: false,
                mode: "nearest",
                intersect: true,
                filter: (tooltipItem) => tooltipItem.dataset.type !== "line",
                callbacks: {
                    title: (tooltipItem) => renderToolTipTitle(tooltipItem),
                    label: (tooltipItem) => renderTooltipLabel(tooltipItem),
                    footer: (tooltipItem) => renderToolTipFooter(tooltipItem, "Average Weight")
                },
            },
            title: { 
                display: true,  
                text: `Average Weight (${units})`,
                padding: { top: 8, bottom: 8 },
                color: color2,
                font: { size: '14px' }       
            },
            
        },
        maintainAspectRatio: false
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
    
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(date);
    
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    
        return `${formattedDate} @ ${formattedTime}`;
    }
    
    const renderToolTipTitle = (tooltipItem) => {
        if (tooltipItem && tooltipItem[0] && tooltipItem[0].raw && tooltipItem[0].raw.exercise) {
            return `${formatDateTime(tooltipItem[0].raw.exercise.date)}`;
        }
    }

    const renderTooltipLabel = (tooltipItem) => {
        if (tooltipItem && tooltipItem.raw && tooltipItem.raw.exercise) {
            const sets = tooltipItem.raw.exercise.sets;
            const formattedSets = sets.map((set) => {
                let weight = set.weight;
                if (units == "kg") {
                    weight = lbToKg(weight);
                }
                let str = `${set.reps} × ${weight} ${units}`;
                if (set.warmUp) {
                    return str + ' ✱';
                }
                return str;
            });
            return formattedSets;
        }
    }

    const renderToolTipFooter = (tooltipItem, label) => {
        if (tooltipItem && tooltipItem[0] && tooltipItem[0].raw && tooltipItem[0].raw.y) {
            return `${label}: ${tooltipItem[0].raw.y} ${units}`;
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ border: 'solid 1px #dee2e6', padding: '4px'}}>
                <Chart 
                    type="scatter" 
                    data={volumeLoadChartData} 
                    options={volumeLoadChartOptions} 
                    style={{ aspectRatio: '1 / 1', width: '100%', height: '100%', maxHeight: '300px' }} 
                />
            </div>
            <div style={{ border: 'solid 1px #dee2e6', padding: '4px'}}>
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
                    onChange={(e) => setTimeRange(e.value)} 
                    style={{ padding: '4px', width: 'auto', borderRadius: '0' }} 
                />
            </div>
            
        </div>
    );
}