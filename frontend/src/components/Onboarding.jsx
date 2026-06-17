import React from 'react'
import {useState} from 'react'
import useTema from './useTema';

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

    const { temaActual } = useTema()

    //? agregar materias a la lista 
    const agregarMateria =() => {
        //? input vacio --> nada 
        //* .trim quita los espacios al inicio y final del texto
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
        const perfil = {
            esEstudiante: esEstudiante,
            materias: materias
        }
        localStorage.setItem('perfilUsuario', JSON.stringify(perfil))
        setPerfilUsuario(perfil)

        //! se cierra esta página y envía al dashboard
        setMostrarOnboaring(false)
    }

    return (
        <div className={`min-h-screen flex items-center justify-center
            ${temaActual ? temaActual.fondo : 'bg-[#e2d2c7]'}`}>
            <div className={`rounded-2xl shadow-md p-10 w-full max-w-md
                ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>

                <h2 className={`text-2xl font-bold mb-1 ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                    ¡Hola, {username || 'usuario'}!
                </h2>
                <p className={`text-sm mb-8 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>
                    Cuéntanos un poco sobre ti para personalizar tu experiencia
                </p>

                <div className='flex gap-3 mb-6'>
                    {/*es estudiante*/}
                    <button
                        onClick={()=> setEsEstudiante(true)}
                        className={`flex-1 p-3 rounded-xl text-sm font-medium border-2 transition-all
                            ${esEstudiante === true
                                ? 'bg-[#f5820d] border-[#f5820d] text-white'
                                : `${temaActual ? temaActual.fondoTarjeta : 'bg-white'} ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'} ${temaActual ? temaActual.textoSecundario : 'text-[#aaa]'} hover:border-[#f5820d]`
                            }`}
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
                                ? 'bg-[#f5820d] border-[#f5820d] text-white'
                                : `${temaActual ? temaActual.fondoTarjeta : 'bg-white'} ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'} ${temaActual ? temaActual.textoSecundario : 'text-[#aaa]'} hover:border-[#f5820d]`
                            }`}
                    >
                        No soy estudiante
                    </button>
                </div>

                {/*estudiante == true --> preguntar por sus materias*/}
                {esEstudiante === true &&(
                    <div className='mb-6'>
                        <p className={`text-sm font-semibold mb-1 ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                            ¿Cuáles son tus materias?
                        </p>

                        <p className={`text-xs mb-3 ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>
                            Escribe el nombre de tu materia y presiona Enter o el botón +
                        </p>

                        <div className='flex gap-2'>
                            <input
                                type='text'
                                value={inputMateria}
                                placeholder='Cálculo Integral, Programación...'
                                className={`flex-1 p-3 rounded-xl border outline-none transition-all text-sm
                                    ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}
                                    ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}
                                    ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}
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
                                        className={`flex items-center gap-1 border text-xs
                                                   px-3 py-1 rounded-full
                                                   ${temaActual ? temaActual.fondoInput : 'bg-[#fff2e8]'}
                                                   ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}
                                                   ${temaActual ? temaActual.acentoTexto : 'text-[#f5820d]'}`}
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