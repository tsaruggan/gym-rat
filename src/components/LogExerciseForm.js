import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from "@/styles/Home.module.css";

const defaultSets = [{ weight: 55, reps: 8, warmUp: false }, { weight: 55, reps: 8, warmUp: false }, { weight: 55, reps: 8, warmUp: false }];

const initializeSets = (initialSets = defaultSets) => {
    return initialSets.map(set => ({ ...set, key: generateUniqueKey() }));
};

const generateUniqueKey = () => Math.random().toString();

const initializeDate = (initialDate) => {
    const date = initialDate ? new Date(initialDate) : new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
}

export default function LogExerciseForm({
    initialExerciseName = '',
    initialSets = defaultSets,
    initialDate,
    hideExerciseName = false,
    edit = false,
    onLog,
    onEdit,
    onDelete
}) {
    const [exerciseName, setExerciseName] = useState(initialExerciseName);
    const [sets, setSets] = useState(initializeSets(initialSets));
    const [date, setDate] = useState(initializeDate(initialDate));

    const renderSet = (index) => {
        const set = sets[index];
        const weight = set.weight;
        const reps = set.reps;
        const warmUp = set.warmUp;
        const key = set.key;

        return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>{`Set ${index + 1}`}</label>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <InputNumber
                            inputId="weight1"
                            value={weight}
                            onValueChange={(e) => updateSet(index, 'weight', e.value)}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={1}
                            inputStyle={{ width: '96px', padding: '4px', borderRadius: '0' }}
                            suffix=" lb"
                        />
                        <Dropdown
                            value={reps}
                            options={[...Array(24).keys()].map(i => i + 1)}
                            onChange={(e) => updateSet(index, 'reps', e.value)}
                            style={{ width: '96px', padding: '4px', borderRadius: '0' }}
                            panelStyle={{ padding: '4px' }}
                        />
                        <Button
                            onClick={() => updateSet(index, 'warmUp', !sets[index].warmUp)}
                            className={styles.warmUpToggle}
                            style={{ 
                                border: warmUp ? "solid 2px rgba(0, 200, 255, 1)" : "dashed 1px rgba(0, 133, 170, 0.66)", 
                                color: "rgba(0, 200, 255, 1)",
                                background: warmUp ? "linear-gradient(to bottom, rgba(0, 200, 255, 0.2), rgba(249, 105, 0, 0.2))" : "transparent",
                            }}
                        >
                            <span style={{ opacity: warmUp ? 1 : 0.7, filter: warmUp ? 'none' : 'grayscale(100%)' }}>✱</span>
                        </Button>
                    </div>
                    <Button
                        onClick={() => deleteSet(index)}
                        icon="pi pi-trash"
                        className={styles.trashButton}
                        disabled={sets.length <= 1}
                    />
                </div>
            </div>
        );
    };

    const updateSet = (index, key, value) => {
        const updatedSets = sets.map((set, i) =>
            i === index ? { ...set, [key]: value } : set
        );
        setSets(updatedSets);
    };

    const deleteSet = (index) => {
        setSets((prevSets) => prevSets.filter((_, i) => i !== index));
    };

    const addSet = () => {
        setSets((prevSets) => [
            ...prevSets,
            {
                ...prevSets[prevSets.length - 1],
                key: generateUniqueKey()
            }
        ]);
    };

    const validateForm = () => {
        const invalidName = exerciseName.trim() === "";
        if (invalidName) {
            return false;
        }

        const hasWorkingSet = sets.some(set => !set.warmUp);
        if (!hasWorkingSet) {
            return false;
        }

        const allValidSets = sets.every(set => set.weight > 0 && set.reps >= 1);
        if (!allValidSets) {
            return false;
        }

        return true;
    };

    const logExercise = () => {
        if (validateForm()) {
            const formattedDate = new Date(date).toISOString();
            const formattedSets = sets.map(({ key, ...rest }) => rest);
            onLog({
                "name": exerciseName,
                "date": formattedDate,
                "sets": formattedSets
            });
        }
    };

    const editExercise = () => {
        if (validateForm()) {
            const formattedDate = new Date(date).toISOString();
            const formattedSets = sets.map(({ key, ...rest }) => rest);
            onEdit({
                "name": exerciseName,
                "date": formattedDate,
                "sets": formattedSets
            });
        }
    };

    const deleteExercise = () => {
        onDelete();
    };

    const renderNewExerciseForm = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {!hideExerciseName && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="exerciseName">{initialExerciseName == "" ? "New Exercise" : "Exercise Name"}</label>
                        <InputText
                            id="exerciseName"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            style={{ padding: '4px' }}
                        />
                    </div>
                )}

                {sets.map((_, index) => renderSet(index))}

                <Button className={styles.addSetButton} onClick={addSet}>+ Add Set +</Button>

                <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={styles.dateTimePickerInput} />

                <Button className={styles.logExerciseButton} disabled={!validateForm()} onClick={logExercise}>Log Exercise</Button>
            </div>
        );
    }

    const renderEditExerciseForm = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="exerciseName">{"Edit Exercise"}</label>
                    <InputText
                        id="exerciseName"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        style={{ padding: '4px' }}
                    />
                </div>

                {sets.map((_, index) => renderSet(index))}

                <Button className={styles.addSetButton} onClick={addSet}>+ Add Set +</Button>

                <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={styles.dateTimePickerInput} />

                <Button className={styles.editExerciseButton} disabled={!validateForm()} onClick={editExercise}>Edit Exercise</Button>
                
                <hr className={styles.divider} />

                <Button className={styles.deleteExerciseButton} onClick={deleteExercise}>Delete Exercise</Button>
            </div>
        );
    }

    if (edit) {
        return renderEditExerciseForm();
    } else {
        return renderNewExerciseForm();
    }
}

