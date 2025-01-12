import React, { useState, useEffect } from "react";

export default function BlockLoader(props) {
    const blocks = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % blocks.length);
        }, 100);

        return () => clearInterval(interval);
    }, [blocks.length]);

    return (
        <span>
            {blocks[index]}
        </span>
    );
};