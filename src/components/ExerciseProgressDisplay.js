import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import 'chartjs-adapter-date-fns';

// change default font
import { Chart as ChartJS } from 'chart.js';
import { GeistMono } from "geist/font/mono";
ChartJS.defaults.font.family = GeistMono.style.fontFamily;

function ExerciseProgressDisplay({ history }) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (history) {
            const volumeLoadData = history.map((exercise) => {
                const volumeLoad = exercise.sets
                    .filter((set) => !set.warmUp)
                    .reduce((acc, set) => acc + set.weight * set.reps, 0);
                const date = new Date(exercise.date);
                return { x: date, y: volumeLoad };
            });
    
            const data = {
                datasets: [
                    {
                        label: 'Volume Load',
                        data: volumeLoadData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                    },
                ],
            };
            setChartData(data);
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
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Volume Load',
                },
            },
        },
        plugins: {
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
