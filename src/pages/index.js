import React, { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { createUser } from "@/utils/firebase";
import { Button } from "primereact/button";
import BlockLoader from "@/components/BlockLoader";
import Link from "next/link";

export default function Home() {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleGetStarted = async () => {
        setLoading(true);
        const id = await createUser();
        setUserId(id);
        setLoading(false);
    };

    const renderGetStarted = () => {
        return (
            <div className={styles.getStartedContainer}>
                <p>
                    <b>Gym Rat</b> is the no-frills weightlifting app for logging exercises and tracking <a className={styles.poLink} href="https://youtu.be/k0J8URJfUTg?si=CizbI75PyUbOs4BJ" target="_blank">progressive overload</a>. Visualize your performance trends and easily recall your workout history to focus on better results.
                </p>

                <ul style={{ paddingLeft: '24px' }} >
                    <li style={{ marginTop: '12px' }}>No accounts! Access your tracker with your unique public link</li>
                    <li style={{ marginTop: '12px' }}>Customization</li>
                    <li style={{ marginTop: '12px' }}>Export your data</li>
                    <li style={{ marginTop: '12px' }}>Free & open-source</li>
                </ul>

                {!userId &&
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '24px' }}>
                        <Button
                            onClick={handleGetStarted}
                            className={styles.getStartedButton}
                            disabled={loading}
                        >
                            Get started
                        </Button>
                        {loading && <BlockLoader />}
                    </div>
                }
            </div>
        );
    }

    const renderOnboarding = () => {
        return (
            <div className={styles.onboardingContainer}>
                <p>Your link is ready to go!</p>
                <ul style={{ paddingLeft: '12px' }}>
                    <li style={{ listStyleType: 'none' }}>
                        📎 <b>Bookmark your link</b> or save it to your notes so you don't lose it.
                    </li>
                    <li style={{ listStyleType: 'none', marginTop: '12px' }}>
                        🪤 <b>Do not share your link</b>; anyone can see and manipulate your data.
                    </li>
                    <li style={{ listStyleType: 'none', marginTop: '12px' }}>
                        📲 <b>Add to your home screen</b> or dock for easy access.
                    </li>
                </ul>
                {renderAppLink()}
            </div>
        );
    }

    const renderAppLink = () => {
        const domain = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';
        const protocol = 'https://';
    
        const url = `${protocol}${domain}${port}/${userId}`;
        const text = `${domain}${port}/${userId}`;

        return (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center'}}>
                <Link href={url} className={styles.appLink}>{text}</Link>

                <Button 
                    className={styles.copyAppLinkButton} 
                    style={{ marginLeft: '12px' }}
                    onClick={() => navigator.clipboard.writeText(url)}
                >
                    <i className="pi pi-copy"></i>
                </Button>
            </div>
        )

    }
    

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div style={{ margin: '24px', display: "flex", flexDirection: "column", gap: '12px' }}>
                    {renderGetStarted()}
                    {userId && renderOnboarding()}
                </div>
            </main>
        </div>
    );
}