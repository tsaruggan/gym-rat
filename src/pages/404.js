import styles from "@/styles/Home.module.css";

export default function Custom404Page() {
    return (
        <div className={styles.page}>
            <main className={styles.main} style={{ padding: '24px' }}>
                <h1>404: Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </main>
        </div>
    );
}