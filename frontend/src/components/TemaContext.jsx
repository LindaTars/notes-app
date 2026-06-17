import React from 'react'
import { useState, createContext, useContext } from 'react'
import temas from '../themes/temas'

//? creación del contexto 
export const TemaContext = createContext()

//? TemaProvider --> se encarga de envolvre toda la app y los envía a los hijos
const TemaProvider = ({children}) => {
    const [temaActual, setTemaActual] = useState(null)

    //* cambiar el tema, se recibe el ID del tema, se actualiza el estado
    const cambiarTema = (idTema) =>{
        if(temas[idTema]) {
            setTemaActual(temas[idTema]) //* ejecución del cambio de tema
        } else {
            //! si no existe el tema se deja el que está por defecto
            setTemaActual(null)
        }
    }
    return(
        <TemaContext.Provider value = {{temaActual, cambiarTema}} >
            {children}
        </TemaContext.Provider>
    )
}

//! hook para acceder al contexto 
const useTema = () =>{
    return useContext(TemaContext)
}

export {TemaProvider}
