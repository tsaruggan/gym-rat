import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import LogExerciseForm from "./LogExerciseForm";
import { editExercise, deleteExercise } from "@/utils/firebase";
import styles from "@/styles/Home.module.css";

export default function EditExercisePopup({ exercise, units="lb" }) {
    const [visible, setVisible] = useState(false);

    const onEdit = async (updatedExercise) => {
        try {
            await editExercise(exercise.id, updatedExercise);
            setVisible(false);
        } catch (error) {
            console.error(error.message);
        }
    };

    const onDelete = async () => {
        try {
            await deleteExercise(exercise.id);
            setVisible(false);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            <Button 
                icon="pi pi-wrench" 
                onClick={() => setVisible(true)}
                className={styles.editButton}
            />
            <Dialog 
                visible={visible} 
                onHide={() => {if (!visible) return; setVisible(false); }}
                style={{ width: "100%", maxWidth: "400px", height: "100%" }}
                headerStyle={{ height: '48px', padding: '12px' }}
            >
                <div style={{ width: "100%", padding: "24px" }}>
                    <LogExerciseForm
                        initialExerciseName={exercise.name}
                        initialSets={exercise.sets}
                        initialDate={exercise.date}
                        edit={true}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        units={units}
                    />
                </div>
            </Dialog>
        </>
    );
}