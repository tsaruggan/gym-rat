import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { lbToKg } from '@/utils/conversions';

export default function ExerciseRecordTable({ exercise, units='lb' }) {
    const renderIgnoreFlag = (rowData) => {
        if (rowData.ignore === true) {
            return <span style={{ color: "rgba(0, 200, 255, 1)"}}>✱</span>;
        } else {
            return <span> </span>
        }
    }

    const renderWeight = (rowData) => {
        let weight = rowData.weight;
        if (units == "kg") {
            weight = lbToKg(weight);
        }
        return <span>{weight} {units}</span>
    }

    return (
        <DataTable value={exercise.sets} tableStyle={{ width: 'auto', overflowX: 'auto', tableLayout: 'auto' }}> 
            <Column style={{minWidth: '96px'}} body={renderWeight} header="Weight"/>
            <Column style={{minWidth: '72px'}} field="reps" header="Reps"/>
            <Column style={{minWidth: '24px'}} body={renderIgnoreFlag}/>
        </DataTable>
    );
}