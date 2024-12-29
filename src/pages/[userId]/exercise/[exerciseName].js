import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.css";
import ExerciseHistoryDisplay from "@/components/ExerciseHistoryDisplay";
import ExerciseProgressDisplay from "@/components/ExerciseProgressDisplay";
import LogExerciseForm from '@/components/LogExerciseForm';
import { fetchExerciseData, logExercise } from "@/utils/firebase";
import AppLayout from "@/components/AppLayout";
import { Skeleton } from "primereact/skeleton";
import Link from "next/link";

export default function ExercisePage() {
    const router = useRouter();
    const { userId, exerciseName } = router.query;
    const [loading, setLoading] = useState(true);
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [loggedSuccessfully, setLoggedSuccessfully] = useState(false);

    useEffect(() => {
        const subscribeToData = async () => {
            // Fetch + subscribe to exercises data
            const unsubscribe = fetchExerciseData(userId, exerciseName, (exercisesData) => {
                const sortedExercises = exercisesData.sort((a, b) => new Date(b.date) - new Date(a.date));
                setExerciseHistory(sortedExercises);
                setLoading(false)
            });
            return () => { unsubscribe() };
        }

        if (userId && exerciseName) {
            subscribeToData();
        }
    }, [userId, exerciseName]);

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

    const renderLoadingSkeleton = () => {
        return (
            <main className={styles.main}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <Skeleton width="300px"  height="32px"></Skeleton>
                    <Skeleton width="100%" height="300px"></Skeleton>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <Skeleton width="200px"  height="24px"></Skeleton>
                    <Skeleton width="100%" height="100px"></Skeleton>
                    <Skeleton width="100%" height="100px"></Skeleton>
                    <Skeleton width="100%" height="100px"></Skeleton>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <Skeleton width="200px"  height="24px"></Skeleton>
                    <Skeleton width="100%" height="200px"></Skeleton>
                    <Skeleton width="100%" height="200px"></Skeleton>
                </div>
            </main>
        );
    }

    const renderAppContent = () => {
        return (
            <main className={styles.main} >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <h1>{exerciseName}</h1>
                    { loggedSuccessfully ? renderLoggedSuccessfullyMessage() : renderLogExerciseForm() }
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
        );
    }

    const renderExerciseNotFound = () => {
        return (
            <main className={styles.main} >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '24px', textAlign: 'center', color: 'rgb(214, 40, 57)', backgroundColor: 'rgb(214, 40, 57, 0.1)', border: 'solid 1px rgb(214, 40, 57)' }} >
                        <p>{`The exercise "${exerciseName}" does not exist.`}</p>
                        <br />
                        <Link className={styles.createNewExerciseLink} href={`/${userId}/exercise`}>Create a new exercise →</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <AppLayout userId={userId}>
            <div className={styles.page}>
                {loading && renderLoadingSkeleton()}
                {!loading && exerciseHistory?.length > 0 && renderAppContent()}
                {!loading && (!exerciseHistory || exerciseHistory.length === 0) && renderExerciseNotFound()}
            </div>
        </AppLayout>
    );
}