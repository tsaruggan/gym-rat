import React, { useState, useEffect } from 'react';

const BlockLoader = () => {
  const blocks = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % blocks.length);
    }, 100);
    
    return () => clearInterval(interval);
  }, [blocks.length]);

  return (
    <span style={{  }}>
      {blocks[index]}
    </span>
  );
};

export default BlockLoader;
