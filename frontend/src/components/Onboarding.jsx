import React from 'react'
import {useState} from 'react'

//? pantalla de bienvenida para nuevos usuarios

//! se recibe username, setPerfilUsuario, setMostrarOnboaring
//*        nombre user  es estudiante?    cerrar ventana    

const Onboarding = ({username, setPerfilUsuario, setMostrarOnboaring}) => {
    //? es estudiante?
    const[esEstudiante, setEsEstudiante] = useState(null);

    //? es estudiante = true --> lista de materias
    const[materias, setMaterias] = useState([]) //* arreglo para guardar las materias
    
    //? input de las materias 
    const[inputMateria, setInputMateria] = useState("");
    //? tareas == null --> error
    
    const[errorMaterias, setErrorMaterias] = useState("");

    //? agregar materias a la lista 
    const agregarMateria =() => {
        //? input vacio --> nada 
        //* .trim quita los espacios al inicio y fianl del texto
        if (inputMateria.trim() === '') return

        setMaterias([...materias, inputMateria.trim()]);
        setInputMateria('') //* limpiar input
        setErrorMaterias('') //* solo si hay un error se limpia
    }

    //? agregar materias al dar enter
    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            agregarMateria()
        }
    }

    //! borrar una materia de la lista si se equivoca el usuario
    const eliminarMateria = (index) =>{
        //? no sé bien qué hace filter pero funciona
        const nuevaLista = materias.filter((_,i) => i !== index)
        setMaterias(nuevaLista)
    }

    //! el usuario termina de configurar su perfil
    const handleContinuar = () => {
        //* validar que se haya puesto por lo menos una materia
        if(esEstudiante && materias.length === 0){
            setErrorMaterias('Agrega por lo menos una materia para continuar')
            return
        }

        //TODO conexión con el back --> las materias se enviarán a la bd
        console.log('perfil configurado: ',{
            esEstudiante, materias
        });

        //? guardar el perfil
        setPerfilUsuario({
            esEstudiante: esEstudiante,
            materias: materias
        })

        //! se cierra esta página y envía al dashboard
        setMostrarOnboaring(false)
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#e2d2c7]'>
            <div className='bg-white rounded-2xl shadow-md shadow-orange-100 p-10 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-[#1a2b35] mb-1'>
                    ¡Hola, {username || 'usuario'}!
                </h2>
                <p className='text-sm text-[#999] mb-8'>
                    Cuéntanos un poco sobre ti para personalizar tu experiencia
                </p>

                <div className='flex gap-3 mb-6'>
                    {/*es estudiante*/}
                    <button
                        onClick={()=> setEsEstudiante(true)}
                        className={`flex-1 p-3 rounded-xl text-sm font-medium border-2 transition-all
                            ${esEstudiante === true
                                ?'bg-[#f5820d] border-[#f5820d] text-white' //?seleccionado el botón
                                :'bg-white border-[#fcd4b0] text-[#aaa] hover:border-[#f5820d]' //? no seleccionado
                            } `}
                    >
                        Si, soy estudiante
                    </button>
                    
                    {/*no es estudiante*/}
                    <button
                        onClick={()=> {
                            setEsEstudiante(false)
                            setMaterias([])
                        }}
                        className={`flex-1 p-3 rounded-xl text-sm font-medium border-2 transition-all
                            ${esEstudiante === false
                                ?'bg-[#f5820d] border-[#f5820d] text-white'
                                :'bg-white border-[#fcd4b0] text-[#aaa] hover:border-[#f5820d]'
                            }`}
                    >
                        No soy estudiante
                    </button>
                </div>

                {/*estudiante == true --> preguntar por sus materias*/}
                {esEstudiante === true &&(
                    <div className='mb-6'>
                        <p className='text-sm font-semibold text-[#1a2b35] mb-1'>
                            ¿Cuáles son tus materias?
                        </p>

                        <p className='text-xs text-[#bbb] mb-3'>
                            Escribe el nombre de tu materia y presiona Enter o el botón +
                        </p>

                        <div className='flex gap-2'>
                            <input
                                type='text'
                                value={inputMateria}
                                placeholder='Cálculo Integral, Programación...'
                                className='flex-1 p-3 rounded-xl border border-[#fcd4b0] 
                                           bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white 
                                           outline-none transition-all text-sm'
                                onChange={(e)=> setInputMateria(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />

                            <button
                                onClick={agregarMateria}
                                className='bg-[#f5820d] hover:bg-[#d96e08] text-white 
                                        px-4 rounded-xl text-lg transition-all active:scale-95'
                            >
                                +
                            </button>
                        </div>

                        {/*error si intenta continuar sin agregar materias*/}
                        {errorMaterias && (
                            <p className='text-red-400 text-xs mt-2'>{errorMaterias}</p>
                        )}

                        {/*lista materias*/}
                        {materias.length > 0 &&(
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {materias.map((materia, index)=> (
                                    <span 
                                        key={index}
                                        className='flex items-center gap-1 bg-[#fff2e8] border 
                                                   border-[#fcd4b0] text-[#f5820d] text-xs
                                                   px-3 py-1 rounded-full'
                                    >
                                        {materia}
                                        <button
                                            onClick={()=> eliminarMateria(index)}
                                            className='text-[#f24b6a] hover:text-red-600 ml-1 font-bold'
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))} 
                            </div>
                        )}
                    </div>
                )}

                {/*boton continuar, solo aparece si ya eligio una opcion*/}
                {esEstudiante !== null &&(
                    <button
                        onClick={handleContinuar}
                        className='w-full bg-[#f5820d] hover:bg-[#d96e08] text-white 
                                   p-3 rounded-xl text-sm transition-all active:scale-95 mt-2'
                    >
                        Comenzar
                    </button>
                )}

            </div>
        </div>
    )
}

export default Onboarding