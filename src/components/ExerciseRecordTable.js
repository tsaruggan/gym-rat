import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function ExerciseRecordTable({ exercise }) {
    
    const renderWarmUpFlag = (rowData) => {
        if (rowData.warmUp === true) {
            return <span>❄️</span>;
        } else {
            return <span> </span>
        }
    }

    const renderWeight = (rowData) => {
        return <span>{rowData.weight} lb</span>
    }

    return (
        <DataTable value={exercise.sets} tableStyle={{ width: '168px', overflowX: 'auto' }}> 
            <Column style={{width: '96px'}} body={renderWeight} header="Weight"/>
            <Column style={{width: '72px'}} field="reps" header="Reps"/>
            <Column style={{width: '24px'}} body={renderWarmUpFlag}/>
        </DataTable>
    );
}