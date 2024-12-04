import React, { useState, useEffect } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

function ExercisesTable({ data }) {
    const [exerciseData, setExerciseData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (data) {
            // store unique exercises in hashmap (only latest item)
            const exercises = new Map();
            const freq = new Map();
            for (const exercise of data) {
                const name = exercise.name;

                if (exercises.has(name)) {
                    const date = new Date(exercise.date);
                    const existingDate = new Date(exercises.get(name).date);

                    if (date > existingDate) {
                        exercises.set(name, exercise);
                        freq.set(name, freq.get(name) + 1);
                    }
                } else {
                    exercises.set(name, exercise);
                    freq.set(name, 1);
                }
            }

            // process exercise entries for table display
            const exercisesArray = [];
            exercises.forEach((item, _) => {
                const workingSets = item.sets.filter(set => set.warmUp === false);

                const exercise = {};
                exercise.name = item.name;
                exercise.weight = calculateAverageWorkingWeight(workingSets);
                exercise.workingSets = workingSets.length;
                exercise.warmUpSets = item.sets.length - workingSets.length;
                exercise.reps = calculateAverageWorkingReps(workingSets);
                exercise.date = formatDate(item.date);
                exercise.entries = freq.get(item.name);
                exercise.weightRange = formatWeightRange(workingSets);
                exercise.repRange = formatRepRange(workingSets);
                exercisesArray.push(exercise);
            });
            setExerciseData(exercisesArray);
        }
    }, [data]);

    const formatWeightRange = (workingSets) => {
        let minWeight = Infinity;
        let maxWeight = -Infinity;
        for (const set of workingSets) {
            minWeight = Math.min(minWeight, set.weight);
            maxWeight = Math.max(maxWeight, set.weight);
        }

        if (minWeight == maxWeight) {
            return `${minWeight}`;
        }
        return `${minWeight}-${maxWeight}`;
    }

    const formatRepRange = (workingSets) => {
        let minReps = Infinity;
        let maxReps = -Infinity;
        for (const set of workingSets) {
            minReps = Math.min(minReps, set.reps);
            maxReps = Math.max(maxReps, set.reps);
        }

        if (minReps == maxReps) {
            return `${minReps}`;
        }
        return `${minReps}-${maxReps}`;
    }

    const calculateAverageWorkingWeight = (workingSets) => {
        const totalWeight = workingSets.reduce((acc, set) => acc + set.weight, 0);
        const average = totalWeight / workingSets.length;
        const roundedAverage = Math.round(average * 2) / 2; // Round to nearest 0.5
        return roundedAverage.toFixed(1);
    };

    const calculateAverageWorkingReps = (workingSets) => {
        const totalReps = workingSets.reduce((acc, set) => acc + set.reps, 0);
        return Math.ceil(totalReps / workingSets.length);
    };
    
    const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    }

    const renderSets = (rowData) => {
        if (rowData.warmUpSets > 0) {
            return <span>{rowData.workingSets}<sup>+{rowData.warmUpSets}</sup></span>;
        } else {
            return <span>{rowData.workingSets}</span>
        }
    }

    const renderHeader = () => {
        return (
            <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                style={{ width: '162px', margin: '12px', padding: '4px' }}
            />
        );
    };
    const header = renderHeader();

    const renderEmptyMessage = () => {
        return (
            <div style={{ textAlign: 'left', padding: '12px', color: 'gray' }}>No exercises found.</div>
        );
    }
    const emptyMessage = renderEmptyMessage();

    return (
        <div>
            <DataTable
                value={exerciseData}
                stripedRows
                scrollable
                scrollHeight="400px"
                tableStyle={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                sortField="date"
                sortOrder={-1}
                paginator
                rows={8}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{currentPage} / {totalPages}"
                globalFilter={searchQuery}
                header={header}
                emptyMessage={emptyMessage}
            >
                <Column
                    field="name"
                    header="Exercise"
                    sortable
                    frozen
                    alignFrozen="left"
                    style={{ minWidth: '216px', padding: '12px' }}
                />
                <Column
                    header="Weight"
                    field="weightRange"
                    headerStyle={{ textAlign: 'center' }}
                    style={{ minWidth: '72px', textAlign: 'left' }}
                />
                <Column
                    header="Sets"
                    body={renderSets}
                    style={{ minWidth: '48px', textAlign: 'left' }}
                />
                <Column
                    header="Reps"
                    field="repRange"
                    headerStyle={{ textAlign: 'left' }}
                    style={{ minWidth: '48px', textAlign: 'left' }}
                />
                <Column
                    field="date"
                    header="Last Date"
                    sortable
                    style={{ minWidth: '120px' }}
                />
                <Column
                    field="entries"
                    header="Entries"
                    sortable
                    style={{ minWidth: '60px' }}
                />
            </DataTable>
        </div>
    );
}

export default ExercisesTable;