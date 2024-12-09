import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';
import styles from "@/styles/Home.module.css";

function BasicLog({ exerciseLog }) {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    }

    const renderTypeFlag = (rowData) => {
        if (rowData.warmUp === true) {
            return <span>❄️</span>;
        } else {
            return <span> </span>
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span>
                <Link href={`/exercise/${exerciseLog.name}`} className={styles.exerciseLink}>{exerciseLog.name}</Link>
                <span> @ {formatTime(exerciseLog.date)}</span>
            </span>
            
            <DataTable 
                value={exerciseLog.sets}
                tableStyle={{ width: '168px', overflowX: 'auto' }}
            > 
                <Column style={{width: '72px'}} field="weight" header="Weight"/>
                <Column style={{width: '72px'}} field="reps" header="Reps"/>
                <Column style={{width: '24px'}} body={renderTypeFlag}/>
            </DataTable>
        </div>
    );
}

export default BasicLog;