import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";

import LogExerciseForm from "@/components/LogExerciseForm";

export default function NewExercisePage() {
    const onLog = (exercise) => {
        console.log(exercise);
    }

    return (
        <div className={styles.page}>
            <main className={styles.main} style={{ maxWidth: '400px', padding: '12px' }}>
                <LogExerciseForm onLog={onLog}/>
            </main>
        </div>
    );
}