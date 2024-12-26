import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LogExerciseForm from "@/components/LogExerciseForm";
import { logExercise } from "@/utils/firebase";

export default function NewExercisePage() {
    const router = useRouter();
    const { userId } = router.query;

    const onLog = async (exercise) => {
        try {
            const exerciseId = await logExercise(userId, exercise);
            router.replace(`/${userId}/exercise/${exercise.name}`);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className={styles.page}>
            <main className={styles.main} style={{ maxWidth: '400px', padding: '12px' }}>
                <LogExerciseForm onLog={onLog} />
            </main>
        </div>
    );
}