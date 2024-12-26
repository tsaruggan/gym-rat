import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import ExercisesDisplay from '../../components/ExercisesDisplay';
import WorkoutsDisplay from "../../components/WorkoutsDisplay";
import Link from "next/link";
import { useRouter } from 'next/router';
import { fetchData, checkUserExists } from "@/utils/firebase";

export default function Home() {
  const router = useRouter();
  const { userId } = router.query;
  const [userExists, setUserExists] = useState(null);
  const [data, setData] = useState([]);
  
  // Check if the user exists
  useEffect(() => {
    const validateQueryParams = async () => {
      const exists = await checkUserExists(userId);
  
      // Redirect if user doesn't exist
      if (exists === false) {
        router.push('/404');
      }
      setUserExists(exists);
    };

    if (userId) {
      validateQueryParams();
    }
  }, [userId]);

  // Fetch exercises data if the user exists
  useEffect(() => {
    // Exit early if user existence is unknown or false
    if (userExists === null || userExists === false) {
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
  }, [userExists]);

  return (
    <>
      <Head>
        <title>Gym Rat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.page}>
        {userId && userExists && (
          <main className={styles.main}>
            <div className={styles.homePageSection}>
              <h2>Exercises</h2>

              <Link href={`${userId}/exercise`} >
                <div className={styles.createNewExercise}>Create & log a new exercise...</div>
              </Link>
              
              <ExercisesDisplay data={data} />
            </div>
            <div className={styles.homePageSection}>
              <h2>Workouts</h2>
              <WorkoutsDisplay data={data} />
            </div>
          </main>
        )}
      </div>
    </>
  );
}
