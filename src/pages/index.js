import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

import data from '../../public/exercises.json';

import ExercisesDisplay from '../components/ExercisesDisplay';
import WorkoutsDisplay from "../components/WorkoutsDisplay";

export default function Home() {

  return (
    <>
      <Head>
        <title>Lift Monkey</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2>Exercises</h2>
            <div id="dashed" className={styles.createNewExercise}>Create & log a new exercise...</div>
            <ExercisesDisplay data={data} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2>Workouts</h2>
            <WorkoutsDisplay data={data} />
          </div>
        </main>
      </div>
    </>
  );
}
