import React from 'react'
import { useState, useEffect } from 'react';

const SnackBar = ({ message, isVisible, duration = 3000, onClose, textColor }) => {

    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    return (
        show && (
            <div className={`fixed bottom-5 left-5 bg-gray-300 text-${textColor}-700 font-semibold px-4 py-2 rounded shadow-lg transition-opacity duration-300 ease-in-out`}>
                {message}
            </div>
        )
    )
}

export default SnackBar