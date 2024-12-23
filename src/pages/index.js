import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import data from '../../public/exercises.json';
import ExercisesDisplay from '../components/ExercisesDisplay';
import WorkoutsDisplay from "../components/WorkoutsDisplay";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <Head>
        <title>Gym Rat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.homePageSection}>
            <h2>Exercises</h2>

            <Link href="/exercise" >
              <div className={styles.createNewExercise}>Create & log a new exercise...</div>
            </Link>
            
            <ExercisesDisplay data={data} />
          </div>
          <div className={styles.homePageSection}>
            <h2>Workouts</h2>
            <WorkoutsDisplay data={data} />
          </div>
        </main>
      </div>
    </>
  );
}
