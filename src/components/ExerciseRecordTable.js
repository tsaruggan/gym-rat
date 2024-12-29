import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeIcons } from 'primereact/api';

export default function ExerciseRecordTable({ exercise }) {
    
    const renderWarmUpFlag = (rowData) => {
        if (rowData.warmUp === true) {
            return <span style={{ color: "rgba(0, 200, 255, 1)"}}>✱</span>;
            // return <i className={PrimeIcons.ASTERISK} style={{ color: "rgba(0, 200, 255, 1)"}}></i>;
        } else {
            return <span> </span>
        }
    }

    const renderWeight = (rowData) => {
        return <span>{rowData.weight} lb</span>
    }

    return (
        <DataTable value={exercise.sets} tableStyle={{ width: 'auto', overflowX: 'auto', tableLayout: 'auto' }}> 
            <Column style={{minWidth: '96px'}} body={renderWeight} header="Weight"/>
            <Column style={{minWidth: '72px'}} field="reps" header="Reps"/>
            <Column style={{minWidth: '24px'}} body={renderWarmUpFlag}/>
        </DataTable>
    );
}