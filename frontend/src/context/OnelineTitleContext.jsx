import React, { createContext, useContext, useState } from 'react'

const OneLineTitleContext = createContext();

export const OneLineTitleProvider = ({ children }) => {

    const [oneLineTitle, setOneLineTitle] = useState('')

    const setTitleName = (title) => {
        setOneLineTitle(title)
    }

    return (
        <OneLineTitleContext.Provider value={{ oneLineTitle, setTitleName }}>
            {children}
        </OneLineTitleContext.Provider>
    )
};

export const useTitle = () => {
    const context = useContext(OneLineTitleContext)
    if (!context) {
        throw new Error('error in oneline provider')
    }
    return context;
}

