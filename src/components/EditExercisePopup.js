import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import styles from "@/styles/Home.module.css";
import LogExerciseForm from "./LogExerciseForm";
import { editExercise, deleteExercise } from "@/utils/firebase";

export default function EditExercisePopup({ exercise }) {
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
                style={{ width: "100%", maxWidth: "400px"}}
                headerStyle={{ padding: '8px'}}
            >
                <div style={{ width: "100%", padding: "24px"}}>
                    <LogExerciseForm
                        initialExerciseName={exercise.name}
                        initialSets={exercise.sets}
                        initialDate={exercise.date}
                        edit={true}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </Dialog>
        </>
    );
}