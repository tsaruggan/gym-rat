import Head from "next/head";
import styles from "@/styles/Home.module.css";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import data from '../../exercises.json';

export default function Home() {
  const exercises = data;

  const calculateAverageWeight = (sets) => {
    const totalWeight = sets.reduce((acc, set) => acc + set.weight, 0);
    const average = totalWeight / sets.length;
    return average.toFixed(1);
  };
  
  const calculateAverageReps = (sets) => {
    const totalReps = sets.reduce((acc, set) => acc + set.reps, 0);
    return Math.ceil(totalReps / sets.length);
  };

  return (
    <>
      <Head>
        <title>Lift Monkey</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${styles.page}`}>
        <main className={styles.main}>
          <div>
            <DataTable 
              value={exercises} 
              stripedRows 
              scrollable 
              scrollHeight="400px" 
              tableStyle={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }} 
              sortField="date"
              sortOrder={-1}
            >
              <Column 
                field="name" 
                header="Exercise" 
                sortable
                style={{ minWidth: '264px' }}
              />
              <Column 
                header="Weight"
                body={(rowData) => calculateAverageWeight(rowData.sets)}
                headerStyle={{ textAlign: 'center' }} 
                style={{ minWidth: '72px', textAlign: 'left' }}
              />
              <Column 
                header="Sets"
                body={(rowData) => rowData.sets.length}
                style={{ minWidth: '72px', textAlign: 'left' }}
              />
              <Column 
                header="Reps"
                body={(rowData) => calculateAverageReps(rowData.sets)}
                headerStyle={{ textAlign: 'center' }} 
                style={{ minWidth: '72px', textAlign: 'left' }}
              />
              <Column 
                field="date" 
                header="Date"
                sortable
                style={{ minWidth: '100px' }}
              />
            </DataTable>
          </div>
        </main>
      </div>
    </>
  );
}
