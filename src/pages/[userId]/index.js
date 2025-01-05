import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Skeleton } from 'primereact/skeleton';
import AppLayout from "@/components/AppLayout";
import ExercisesDisplay from '../../components/ExercisesDisplay';
import WorkoutsDisplay from "../../components/WorkoutsDisplay";
import { useRouter } from 'next/router';
import { fetchAllData } from "@/utils/firebase";
import { useUser } from "@/components/UserProvider";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const { userId } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { units } = useUser();

  useEffect(() => {
    const subscribeToData = async () => {
      // Fetch + subscribe to exercises data
      const unsubscribe = fetchAllData(userId, (exercisesData) => {
        setData(exercisesData);
        setLoading(false);
      });
      return () => { unsubscribe() };
    }

    if (userId) {
      subscribeToData();
    }
  }, [userId]);

  const renderLoadingSkeleton = () => {
    return (
      <main className={styles.main}>
        <div className={styles.homePageSection}>
          <Skeleton width="200px" height="24px"></Skeleton>
          <Skeleton width="100%" height="200px"></Skeleton>
        </div>
        <div className={styles.homePageSection}>
          <Skeleton width="200px" height="24px"></Skeleton>
          <Skeleton width="100%" height="200px"></Skeleton>
        </div>
      </main>
    );
  }

  const renderAppContent = () => {
    return (
      <main className={styles.main}>
        <div className={styles.homePageSection}>
          <h2>Exercises</h2>
          <Link href={`/${userId}/exercise`} >
            <div className={styles.createNewExercise}>Create & log a new exercise...</div>
          </Link>
          <ExercisesDisplay data={data} units={units}/>
        </div>
        <div className={styles.homePageSection}>
          <h2>Workouts</h2>
          <WorkoutsDisplay data={data} units={units}/>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Gym Rat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppLayout>
        <div className={styles.page}>
          {loading ? renderLoadingSkeleton() : renderAppContent()}
        </div>
      </AppLayout>
    </>
  );
}
