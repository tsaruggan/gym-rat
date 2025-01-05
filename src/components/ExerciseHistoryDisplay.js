import React, { useState, useEffect } from "react";
import { Paginator } from 'primereact/paginator';
import ExerciseRecordTable from "./ExerciseRecordTable";
import EditExercisePopup from "./EditExercisePopup";
import styles from "@/styles/Home.module.css";

export default function ExerciseHistoryDisplay({ history, units="lb" }) {
    // paginator stuff
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 3;
    const paginatedHistory = history.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    const paginatorTemplate = {
        layout: 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        CurrentPageReport: (options) => `${options.currentPage} / ${options.totalPages}`,
    };

    const renderExerciseRecord = (exercise, index) => {
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

        return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', border: 'solid 1px #dee2e6', padding: '12px' }}>
                <span>
                    {formatDateTime(exercise.date)} 
                    <span style={{ paddingLeft: '12px' }}><EditExercisePopup exercise={exercise} units={units}/></span> 
                </span>
                <ExerciseRecordTable exercise={exercise} units={units}/>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {paginatedHistory.map((exercise, index) => (
                    renderExerciseRecord(exercise, index)
                ))}
            </div>
            
            <Paginator
                first={currentPage * pageSize}
                rows={pageSize}
                totalRecords={history.length}
                onPageChange={(e) => setCurrentPage(e.page)}
                template={paginatorTemplate}
                className={styles.paginator}
            />
        </div>
    );
}
