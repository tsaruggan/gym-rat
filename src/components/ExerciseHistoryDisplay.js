import React, { useState, useEffect } from "react";
import { Paginator } from 'primereact/paginator';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from "@/styles/Home.module.css";

export default function ExerciseHistoryDisplay({ history }) {
    // paginator stuff
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 3;
    const paginatedHistory = history.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    const paginatorTemplate = {
        layout: 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        CurrentPageReport: (options) => `${options.currentPage} / ${options.totalPages}`,
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {paginatedHistory.map((exercise, index) => (
                    <Log exercise={exercise} key={index} />
                ))}
            </div>
            
            <Paginator
                first={currentPage * pageSize}
                rows={pageSize}
                totalRecords={history.length}
                onPageChange={(e) => setCurrentPage(e.page)}
                template={paginatorTemplate}
            />
        </div>
    );
}

// display an exercise log in a table
function Log({ exercise }) {

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        const formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);

        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);

        return `${formattedDate} @ ${formattedTime}`;
    }

    const renderWarmUpFlag = (rowData) => {
        if (rowData.warmUp === true) {
            return <span>❄️</span>;
        } else {
            return <span> </span>
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', border: 'solid 1px #dee2e6', padding: '12px' }}>
            <span>{formatDateTime(exercise.date)}</span>
            <DataTable value={exercise.sets} tableStyle={{ width: '168px', overflowX: 'auto' }}> 
                <Column style={{width: '72px'}} field="weight" header="Weight"/>
                <Column style={{width: '72px'}} field="reps" header="Reps"/>
                <Column style={{width: '24px'}} body={renderWarmUpFlag}/>
            </DataTable>
        </div>
    );
}

