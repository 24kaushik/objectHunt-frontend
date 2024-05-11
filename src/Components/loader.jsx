// Loader.jsx

import React, { useState, useEffect } from 'react';

const Loader = ({ onFinishLoading }) => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            onFinishLoading();
        }
    }, [countdown, onFinishLoading]);

    return (
        <div className="loader">
            <h1>{countdown}</h1>
        </div>
    );
};

export default Loader;
