import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.css";
import ExerciseHistoryDisplay from "@/components/ExerciseHistoryDisplay";
import ExerciseProgressDisplay from "@/components/ExerciseProgressDisplay";
import LogExerciseForm from '@/components/LogExerciseForm';
import { fetchData, checkExerciseExists, logExercise } from "@/utils/firebase";

export default function ExercisePage() {
    const router = useRouter();
    const { userId, exerciseName } = router.query;
    const [exerciseExists, setExerciseExists] = useState(null);
    const [data, setData] = useState([]);
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [loggedSuccessfully, setLoggedSuccessfully] = useState(false);

    // Check if the exercise exists 
    useEffect(() => {
        const validateQueryParams = async () => {
            const exists = await checkExerciseExists(userId, exerciseName);
        
            // Redirect if user doesn't exist
            if (exists === false) {
                router.push('/404');
            }
            setExerciseExists(exists);
        };

        if (userId && exerciseName) {
            validateQueryParams();
        }
    }, [userId, exerciseName]);

    // Fetch exercises data if the user exists
    useEffect(() => {
        // Exit early if user existence is unknown or false
        if (exerciseExists === null || exerciseExists === false) {
            return () => {};
        }

        // Fetch + subscribe to exercises data
        const unsubscribe = fetchData(userId, (exercisesData) => {
            setData(exercisesData);
        });

        // Clean up listener on component unmount
        return () => {
            unsubscribe(); 
        };
    }, [exerciseExists]);

    useEffect(() => {
        if (exerciseName && data) {
            const filteredExercises = data.filter(exercise => exercise.name == exerciseName);
            const sortedExercises = filteredExercises.sort((a, b) => new Date(b.date) - new Date(a.date));
            setExerciseHistory(sortedExercises);
        }
    }, [exerciseName, data]);

    const onLog = async (exercise) => {
        try {
            const exerciseId = await logExercise(userId, exercise);
            setLoggedSuccessfully(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error.message);
        }
    };

    const renderLogExerciseForm = () => {
        return (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', padding: '24px', border: 'dashed 1px black' }}>
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
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', padding: '24px', textAlign: 'center', color: 'rgb(32, 178, 170)', backgroundColor: 'rgb(32, 178, 170, 0.1)', border: 'solid 1px rgb(32, 178, 170)' }} >
                <p>Exercise was logged successfully!</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {userId && exerciseName && exerciseExists && (
                <main className={styles.main} >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <h1>{exerciseName}</h1>
                        {exerciseHistory && exerciseHistory.length > 0 &&
                            (loggedSuccessfully ? renderLoggedSuccessfullyMessage() : renderLogExerciseForm())
                        }
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <h2>History</h2>
                        <ExerciseHistoryDisplay history={exerciseHistory} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <h2>Progress</h2>
                        <ExerciseProgressDisplay history={exerciseHistory} />
                    </div>
                </main>
            )}
        </div>
    );
}