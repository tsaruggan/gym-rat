import AppLayout from "@/components/AppLayout";
import LogExerciseForm from "@/components/LogExerciseForm";
import { useRouter } from "next/router";
import { logExercise } from "@/utils/firebase";
import { useUser } from "@/components/UserProvider";
import styles from "@/styles/Home.module.css";

export default function NewExercisePage() {
    const router = useRouter();
    const { userId } = router.query;
    const { units } = useUser();

    const onLog = async (exercise) => {
        try {
            await logExercise(userId, exercise);
            router.replace(`/${userId}/exercise/${exercise.name}`);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <AppLayout>
            <div className={styles.page}>
                <main className={styles.main} style={{ maxWidth: '400px', padding: '12px' }}>
                    <LogExerciseForm onLog={onLog} units={units}/>
                </main>
            </div>
        </AppLayout>
    );
}