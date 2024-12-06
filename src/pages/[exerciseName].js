import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.css";
 
export default function ExercisePage() {
    const router = useRouter();
    const { exerciseName } = router.query;

    return (
        <div className={styles.page}>
            {/* <main className={styles.main}> */}
                <p>{exerciseName}</p>
            {/* </main> */}
        </div>
    );
}