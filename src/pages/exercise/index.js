import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";

import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export default function NewExercisePage() {
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState([
        { weight: 55, reps: 8, warmUp: false }, 
        { weight: 55, reps: 8, warmUp: false }, 
        { weight: 55, reps: 8, warmUp: false }
    ]);

    const renderSet = (index) => {
        const set = sets[index];
        const weight = set.weight;
        const reps = set.reps;
        const warmUp = set.warmUp;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label>{`Set ${index + 1}`}</label>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <InputNumber 
                            inputId="weight1" 
                            value={weight} 
                            onValueChange={(e) => updateSet(index, 'weight', e.value)} 
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={1}
                            inputStyle={{ width: '96px', padding: '4px' }}
                            suffix=" lb"
                        />
                        <Dropdown
                            value={reps}
                            options={[...Array(24).keys()].map(i => i + 1)}
                            onChange={(e) => updateSet(index, 'reps', e.value)} 
                            style={{ width: '96px',  padding: '4px' }}
                            panelStyle={{ padding: '4px' }}
                        />
                        <Button 
                            onClick={() => updateSet(index, 'warmUp', !sets[index].warmUp)} 
                            className={styles.warmUpToggle}
                            style={{ border: warmUp ? "solid 2px rgba(0, 200, 255, 1)" : "dashed 1px rgba(0, 133, 170, 0.66)" }}
                        >
                            <span style={{  opacity: warmUp ? 1 : 0.7, filter: warmUp ? 'none' : 'grayscale(100%)' }}>❄️</span>
                        </Button>
                    </div>
                    
                    <Button 
                        onClick={() => deleteSet(index)} 
                        icon="pi pi-trash" 
                        className={`${styles.trashButton} p-button-danger`}
                        disabled={sets.length <= 1}
                    />
                </div>
            </div>

        );
    }

    const updateSet = (index, key, value) => {
        setSets((prevSets) => {
            const newSets = [...prevSets];
            newSets[index] = { ...newSets[index], [key]: value };
            return newSets;
        });
    };

    const deleteSet = (index) => {
        setSets((prevSets) => prevSets.filter((_, i) => i !== index));
    };

    const addSet = () => {
        setSets((prevSets) => [
            ...prevSets, 
            { ...prevSets[prevSets.length - 1] }
        ]);
    };

    const logExercise = () => {

    };

    return (
        <div className={styles.page}>
            <main className={styles.main} style={{ maxWidth: '400px', padding: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="exerciseName">New Exercise</label>
                        <InputText 
                            id="exerciseName" 
                            value={exerciseName} 
                            onChange={(e) => setExerciseName(e.target.value)}
                            style={{ padding: '4px' }}
                        />
                    </div>
                    {sets.map((_, index) => (
                        renderSet(index)
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '16px' }} >
                        <Button className={styles.addSetButton} onClick={() =>  addSet()}>Add Set</Button>
                        <Button className={styles.logExerciseButton}>Log Exercise</Button>
                    </div>
                    
                </div> 
            </main>
        </div>
    );
}