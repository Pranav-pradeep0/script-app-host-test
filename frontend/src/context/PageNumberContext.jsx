import React, { createContext, useContext, useState } from 'react';

const PageNumberContext = createContext();

export const PageNumberProvider = ({ children }) => {

    const [pageNumber, setPageNumber] = useState(1)

    const setPageNum = (pageCount) => {
        setPageNumber(pageCount + 1)
    }

    return (
        <PageNumberContext.Provider value={{ pageNumber, setPageNum }}>
            {children}
        </PageNumberContext.Provider>
    );

};

export const usePageNumber = () => {
    const context = useContext(PageNumberContext);
    if (!context) {
        throw new Error('usePageNumber must be used within a PageNumberProvider')
    }
    return context
};