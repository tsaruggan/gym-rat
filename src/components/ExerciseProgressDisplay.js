import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import 'chartjs-adapter-date-fns';
import regression from 'regression';

// change default font
import { Chart as ChartJS, Legend } from 'chart.js';
import { GeistMono } from "geist/font/mono";
ChartJS.defaults.font.family = GeistMono.style.fontFamily;

function ExerciseProgressDisplay({ history }) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (history && history.length > 0) {
            const data = [];
            let previousVolumeLoad = null;
    
            for (let i = history.length - 1; i >= 0; i--) {
                const exercise = history[i];
                const date = new Date(exercise.date);
                const workingSets = exercise.sets.filter((set) => !set.warmUp);

                const volumeLoad = workingSets.reduce((acc, set) => acc + set.weight * set.reps, 0);
                const averageWeight = workingSets.reduce((acc, set) => acc + set.weight, 0) / workingSets.length;
                
                let backgroundColor = 'rgb(174, 174, 178)';
                if (previousVolumeLoad !== null) {
                    if (volumeLoad > previousVolumeLoad) {
                        backgroundColor = 'rgb(52, 199, 89)';
                    } else if (volumeLoad < previousVolumeLoad) {
                        backgroundColor = 'rgb(255, 59, 48)';
                    }
                }
    
                data.push({ 
                    date: date, 
                    volumeLoad: volumeLoad,
                    averageWeight: averageWeight,
                    backgroundColor: backgroundColor
                });

                previousVolumeLoad = volumeLoad;
            }

            const volumeLoadData = data.map((point) => ({ x: point.date, y: point.volumeLoad }));
            const pointBackgroundColorData = data.map((point) => point.backgroundColor);

            const minDate = Math.min(...data.map(point => point.date.getTime()));
            const regressionData = data.map((point) => [
                Math.floor((point.date.getTime() - minDate) / (1000 * 60 * 60 * 24)), // number of days since the first date
                point.averageWeight
            ]);
            console.log(regressionData);

            const averageWeightData = regression.polynomial(regressionData, { order: 2 });
            console.log(averageWeightData);
            
            const averageWeightTrendlineData = averageWeightData.points.map((point) => {
                const dateInMillis = minDate + point[0] * 1000 * 60 * 60 * 24;  // Add back the days in milliseconds
                return { x: new Date(dateInMillis), y: point[1] };
            });


            const chartData = {
                datasets: [
                    {
                        label: 'Volume Load',
                        data: volumeLoadData,
                        pointBackgroundColor: pointBackgroundColorData,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        type: 'scatter',
                        borderColor: 'transparent',
                    },
                    {
                        label: 'Average Weight',
                        data: averageWeightTrendlineData,
                        borderColor: 'rgb(30, 144, 255)',
                        borderWidth: 1,
                        tension: 0.4,
                        fill: false,
                        type: 'line',
                        pointRadius: 0,
                        yAxisID: 'averageWeightAxis',
                        tooltip: {
                            enabled: false
                        }
                    }
                ],
            };
            console.log(chartData);
            setChartData(chartData);
        }
    }, [history]);
    

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'PPP'
                },
                title: {
                    display: false,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: false,
                    text: 'Volume Load',
                },
                display: false,
                ticks: {
                    display: false,
                },
            },
            averageWeightAxis: {
                position: 'right', 
                title: {
                    display: false,
                    text: 'Average Weight',
                },
                grid: {
                    drawOnChartArea: false,
                },
                display: false,
                ticks: {
                    display: false,
                }
            },
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Volume: ${context.raw.y}`,
                },
            },
        },
    };

    return (
        <div style={{ border: 'solid 1px #dee2e6', padding: '12px' }}>
            <Chart type="scatter" data={chartData} options={chartOptions} />
        </div>
    );
}

export default ExerciseProgressDisplay;
