import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Paginator } from 'primereact/paginator';
import ExerciseRecordTable from "./ExerciseRecordTable";
import EditExercisePopup from "./EditExercisePopup";
import styles from "@/styles/Home.module.css";

export default function WorkoutsDisplay({ data }) {
    const [workoutData, setWorkoutData] = useState([]);

    useEffect(() => {
        if (data) {
            // arrange workouts by date
            const workouts = new Map();
            for (const exercise of data) {
                const date = new Date(exercise.date).toLocaleDateString('en-US');

                if (workouts.has(date)) {
                    workouts.get(date).push(exercise);
                } else {
                    workouts.set(date, [exercise]);
                }
            }

            // store workouts in ordered array
            const workoutsArray = [];
            workouts.forEach((exercises, date) => {
                exercises.sort((a, b) => a.date.localeCompare(b.date));
                workoutsArray.push({ date, exercises });
            });
            workoutsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            setWorkoutData(workoutsArray);
        }
    }, [data]);
    
    // paginator stuff
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 8;
    const paginatedWorkouts = workoutData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    const paginatorTemplate = {
        layout: 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        CurrentPageReport: (options) => `${options.currentPage} / ${options.totalPages}`,
    };

    // accordion tab header stuff
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    const renderHeader = (workout) => {
        return (
            <div style={{ padding: '12px' }}>
                {formatDate(workout.exercises[0].date)}
            </div>
        );
    }

    const renderExerciseRecord = (exercise, index) => {
        const formatTime = (dateString) => {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(date);
        }

        return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span>
                    <Link href={`${exercise.userId}/exercise/${exercise.name}`} className={styles.exerciseLink}>{exercise.name}</Link>
                    <span> @ {formatTime(exercise.date)}</span>
                    <span style={{ paddingLeft: '12px' }}><EditExercisePopup exercise={exercise}/></span>
                </span>
                <ExerciseRecordTable exercise={exercise} />
            </div>
        );
    }

    return (
        <div>
            {paginatedWorkouts.length === 0 ? (
                <div style={{ textAlign: 'left', padding: '12px', color: 'gray', borderTop: '1px solid #dde1e6', borderBottom: '1px solid #dde1e6'}}>
                    No workouts found.
                </div>
            ) : (
                <Accordion style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {paginatedWorkouts.map((workout, index) => (
                        <AccordionTab key={index} headerTemplate={renderHeader(workout)}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px' }}>
                                {workout.exercises.map((exercise, index) => (
                                    renderExerciseRecord(exercise, index)
                                ))}
                            </div>
                        </AccordionTab>
                    ))}
                </Accordion>
            )}


            <Paginator
                first={currentPage * pageSize}
                rows={pageSize}
                totalRecords={workoutData.length}
                onPageChange={(e) => setCurrentPage(e.page)}
                template={paginatorTemplate}
                style={{ borderRadius: '0' }}
            />
        </div>
    );
}

