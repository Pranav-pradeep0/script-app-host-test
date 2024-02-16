import React, { createContext, useContext, useState } from 'react';

const ZoomContext = createContext();

export const ZoomProvider = ({ children }) => {
    const [zoomLevel, setZoomLevel] = useState(100);
    const [enlargeValue, setEnlargeValue] = useState(100)
    const [showSidebars, setShowSidebars] = useState(true)
    const [zoomValue, setZoomValue] = useState(100)

    const handleZoomIn = () => {
        const zoomInValue = 10;
        const zoomInDisplayValue = zoomValue + 20
        setZoomValue(zoomInDisplayValue)
        const newZoomLevel = zoomLevel + zoomInValue;
        setZoomLevel(newZoomLevel);
    };

    const handleZoomOut = () => {
        const zoomOutValue = 10;
        const zoomOutDisplayValue = zoomValue - 20
        setZoomValue(zoomOutDisplayValue)
        const newZoomLevel = zoomLevel - zoomOutValue;
        setZoomLevel(newZoomLevel);
    };

    const enableScreenEnlarge = (value) => {
        setEnlargeValue(value)
    }

    const hideSidebars = (value) => {
        setShowSidebars(value)
    }

    return (
        <ZoomContext.Provider value={{ zoomLevel, handleZoomIn, handleZoomOut, enableScreenEnlarge, enlargeValue, showSidebars, hideSidebars, zoomValue }}>
            {children}
        </ZoomContext.Provider>
    );
};

export const useZoom = () => {
    const context = useContext(ZoomContext);
    if (!context) {
        throw new Error('useZoom must be used within a ZoomProvider');
    }
    return context;
};
