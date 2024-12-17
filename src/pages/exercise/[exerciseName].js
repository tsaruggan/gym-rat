import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.css";
import ExerciseHistoryDisplay from "@/components/ExerciseHistoryDisplay";
import ExerciseProgressDisplay from "@/components/ExerciseProgressDisplay";
import LogExerciseForm from '@/components/LogExerciseForm';
import data from '../../../public/exercises.json';
 
export default function ExercisePage() {
    const router = useRouter();
    const { exerciseName } = router.query;
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [loggedSuccessfully, setLoggedSuccessfully] = useState(false);

    useEffect(() => {
        if (exerciseName && data) {
            const filteredExercises = data.filter(exercise => exercise.name == exerciseName);
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
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', padding: '24px', border: 'dashed 2px black' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <LogExerciseForm 
                        initialExerciseName={exerciseName} 
                        hideExerciseName 
                        initialSets={exerciseHistory[0].sets} 
                        onLog={onLog}
                    />
                </div>
            </div>
        );
    }

    const renderLoggedSuccessfullyMessage = () => {
        return (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', padding: '24px', textAlign: 'center', color: 'rgb(32, 178, 170)', backgroundColor: 'rgb(32, 178, 170, 0.1)', border: 'solid 1px rgb(32, 178, 170)'}} >
                <p>Exercise was logged successfully!</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <main className={styles.main} >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h1>{exerciseName}</h1>
                    {/* if exercise history is loaded show exercise form preloaded with last exercise. on submit just display logged message */}
                    {exerciseHistory && exerciseHistory.length > 0 &&
                       (loggedSuccessfully ? renderLoggedSuccessfullyMessage() : renderLogExerciseForm())
                    }
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h2>History</h2>
                    <ExerciseHistoryDisplay history={exerciseHistory}/>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h2>Progress</h2>
                    <ExerciseProgressDisplay history={exerciseHistory}/>
                </div>
            </main>
        </div>
    );
}