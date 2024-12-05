import React from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function BasicLogCard({ exerciseLog }) {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    }

    const renderWarmUpFlag = (rowData) => {
        if (rowData.warmUp === true) {
            return <span>☃️</span>;
        } else {
            return <span></span>
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p>{exerciseLog.name} @ {formatTime(exerciseLog.date)}</p>
            <DataTable 
                value={exerciseLog.sets}
                tableStyle={{ width: '144px', overflowX: 'auto' }}
            > 
                <Column field="weight" header="Weight"/>
                <Column field="reps" header="Reps"/>
                <Column body={renderWarmUpFlag}/>
            </DataTable>
        </div>
    );
}

export default BasicLogCard;