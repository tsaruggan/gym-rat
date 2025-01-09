import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { useUser } from './UserProvider';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import styles from "@/styles/Home.module.css";
import { updateUserPreferences } from '@/utils/firebase';

export default function SettingsPopup(props) {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const { user, darkMode, setDarkMode, units, setUnits } = useUser();

    const handleCopy = (copyText) => {
        navigator.clipboard.writeText(copyText)
            .then(() => showToast("Copied!"));
    };

    const showToast = (text, severity = 'success') => {
        toast.current.show({
            severity: severity,
            summary: text,
            life: 2000,
            content: (
                <div style={{ flex: '1' }}>
                    <div style={{ padding: '12px' }}>
                        <div>Copied!</div>
                    </div>
                </div>
            ),
        });
    }

    const renderCopyUserIdButton = () => {
        const domain = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';
        const text = `${domain}${port}/${user.id}`;
        return (
            <button className={styles.copyUserIdButton} onClick={() => handleCopy(text)}>
                {text}
                <i className="pi pi-copy" style={{ marginLeft: '8px' }}></i>
            </button>
        );
    }

    const renderUserPreferencesSettings = () => {
        const darkModeOptions = [
            { label: "light", value: false },
            { label: "dark", value: true },
        ];

        const unitsOptions = [
            { label: "lb", value: "lb" },
            { label: "kg", value: "kg" }
        ];

        return (
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', gap: '12px' }} >
                {renderSelectButton("Theme", darkMode, darkModeOptions, (e) => handleDarkModeChange(e.value))}
                {renderSelectButton("Units", units, unitsOptions, (e) => handleUnitsChange(e.value))}
            </div>
        );
    }

    const renderSelectButton = (title, value, options, onChange) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>{title}</label>
                <Dropdown
                    value={value}
                    options={options}
                    onChange={(e) => e.value !== value && onChange(e)}
                    style={{ width: '100px', padding: '4px', borderRadius: '0' }}
                    itemTemplate={(option) => (
                        <div style={{ padding: '4px'}}>
                            {option.label}
                        </div>
                    )}
                />
            </div>
        )
    }

    const handleDarkModeChange = (newDarkMode) => {
        setDarkMode(newDarkMode);
        if (user) {
            updateUserPreferences(user.id, { ...user.preferences, darkMode: newDarkMode });
        }
    };

    const handleUnitsChange = (newUnits) => {
        setUnits(newUnits);
        if (user) {
            updateUserPreferences(user.id, { ...user.preferences, units: newUnits });
        }
    };

    return (
        <>
            <Button className={styles.headerButton} style={{ minWidth: '52.5px', aspectRatio: 1 }} onClick={() => setVisible(true)}>
                <span>🧀</span>
            </Button>

            <Dialog
                visible={visible}
                onHide={() => { if (!visible) return; setVisible(false); }}
                style={{ width: "100%", maxWidth: "400px", height: "100%" }}
                headerStyle={{ height: '48px', padding: '12px' }}
            >
                <div style={{ width: "100%", padding: "24px", display: 'flex', flexDirection: 'column', gap: '24px'}} >
                    {renderCopyUserIdButton()}
                    {renderUserPreferencesSettings()}
                </div>

                <Toast ref={toast} position="top-center" />
            </Dialog>

        </>
    );
}