import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.css";
import ExerciseHistoryDisplay from "@/components/ExerciseHistoryDisplay";
import LogExerciseForm from '@/components/LogExerciseForm';
import data from '../../../public/exercises.json';
 
export default function ExercisePage() {
    const router = useRouter();
    const { exerciseName } = router.query;
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [loggedSuccessfully, setLoggedSuccessfully] = useState(false);

    useEffect(() => {
        if (exerciseName && data) {
            // filter exercises
            const filteredExercises = data.filter(exercise => exercise.name == exerciseName);

            // sort exercises by date
            const sortedExercises = filteredExercises.sort((a, b) => new Date(b.date) - new Date(a.date));

            setExerciseHistory(sortedExercises);
        }
    }, [exerciseName, data]);

    const onLog = (exercise) => {
        console.log(exercise);
        setLoggedSuccessfully(true);
    }

    const renderLogExerciseForm = () => {
        return (
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <LogExerciseForm 
                    initialExerciseName={exerciseName} 
                    hideExerciseName 
                    initialSets={exerciseHistory[0].sets} 
                    onLog={onLog}
                />
            </div>
        );
    }

    const renderLoggedSuccessfullyMessage = () => {
        return (
            <div style={{ textAlign: 'center', color: 'rgb(32, 178, 170)'}} >
                <p>Exercise was logged successfully!</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <main className={styles.main} >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h1>{exerciseName}</h1>
                    {exerciseHistory && exerciseHistory.length > 0 && (
                        <div 
                            style={{ 
                                width: '100%',  
                                display: 'flex', 
                                justifyContent: 'space-around', 
                                padding: '24px',
                                border: loggedSuccessfully ? 'solid 2px rgb(32, 178, 170)' : 'dashed 2px black',
                                backgroundColor: loggedSuccessfully ? 'rgba(32, 178, 170, 0.1)' : 'transparent'
                            }}
                        >
                            {loggedSuccessfully ? renderLoggedSuccessfullyMessage() : renderLogExerciseForm()}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h2>History</h2>
                    <ExerciseHistoryDisplay history={exerciseHistory}/>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h2>Progress</h2>
                    <p>Data visualization of progress (progessive overload) here...</p>
                </div>
            </main>
        </div>
    );
}