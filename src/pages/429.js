import styles from "@/styles/Home.module.css";

export default function Custom429Page() {
    return (
        <div className={styles.page}>
            <main className={styles.main} style={{ padding: '24px' }}>
                <h1>429: Too Many Requests</h1>
                <p>Please try again later.</p>
            </main>
        </div>
    );
}