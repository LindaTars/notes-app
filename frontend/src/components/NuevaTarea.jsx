import React from 'react'
import { useState, useEffect } from 'react'

//* formulario para nueva tarea 
//* esto recibe 
//? perfilUsuario --> es estudiante = mostrar el campo materia
//? onCerrar --> cerrar el formulario sin guardar

const NuevaTarea = ({perfilUsuario, onGuardar, onCerrar}) => {
    //! se usan valores por defecto para que no quede vacio
    const [formData, setFormData] = useState({
        nombreTarea:'',
        fechaInicio:'',
        fechaEntrega:'',
        categoria:'personal',
        materia:'',
        descripcion:''
        //TODO agregar más campos de ser necesario
    })

    //? si es estudiante y tiene materias, el <select> muestra la primera
    //? por defecto aunque formData.materia siga vacío. Por eso la sincronizamos aquí.
    useEffect(() => {
        if(perfilUsuario?.esEstudiante && perfilUsuario.materias?.length > 0 && !formData.materia){
            setFormData(prev => ({
                ...prev,
                materia: perfilUsuario.materias[0]
            }))
        }
    }, [perfilUsuario])

    //! mostrar errores 
    const [errores, setErrores] = useState({})
    //!botón guardar
    const [guardando, setGuardando] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        //? limpiar errores de campo si había
        setErrores({
            ...errores,
            [e.target.name]:''
        })
    }

    //? los campos están vacíos ?
    const validar = () => {
        const nuevosErrores = {}

        if(!formData.nombreTarea.trim()){
            nuevosErrores.nombreTarea = 'El nombre es obligatorio'
        }
        if(!formData.nombreTarea.trim()){
            nuevosErrores.fechaInicio("Debes agregar una fecha de inicio")
        }
        if(!formData.fechaEntrega){
            nuevosErrores.fechaEntrega = 'Debes agregar una fecha de entrega'
        }
        // ? es estudiante = materia obligatoria ?
        if(perfilUsuario?.esEstudiante && !formData.materia.trim()){
            nuevosErrores.materia = 'Selecciona una materia'
        }
        return nuevosErrores
    }

    //? si el usuario da clic en guardar...
    const handleGuardar = async() => {
        const erroresEncontrados = validar()
        //! errores = no quiero seguir 
        if(Object.keys(erroresEncontrados).length > 0){
            setErrores(erroresEncontrados)
            return
        }

        setGuardando(true)

        //TODO conectarlo con el back 
        try{
            //! SIMULACIÓN
            const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {'Content-Type':'application/json'}
            })
            const data = await respuesta.json()
            console.log('tarea guardada (simulado): ', data)

            //TODO id temporal
            const tareaGuardada = {
                ...formData,
                id: Date.now() //! id temporal
            }
            onGuardar(tareaGuardada)
        } catch (err){
            console.log('Error al guardar la tarea: ', err)
        }
        setGuardando(false)
    }

    return (
        <div 
        className='fixed inset-0 bg-black/50 flex items-center justify-center z-20'
        onClick={onCerrar}
        >
            {/*tarjeta del formulario*/}
            {/*stopPropagation --> evita que el click adentro cierre el modo modal*/}
            {/*detiene el clic antes de que llegue al "fondo"*/}
            <div
            className='bg-white rounded-2xl p-8 w-full max-w-md shadow-xl mx-4'
            onClick={(e) => e.stopPropagation()}
            >
                {/*titulo + bptón  de cerrar*/}
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-lg font-bold text-[#1a2b35]'>Nueva tarea</h2>
                    <button
                    onClick={onCerrar}
                    className='text-[#bbb] hover:text-[#f24b6a] transition-all text-xl font-bold'
                    >
                        ×
                    </button>
                </div>
                <div className='flex flex-col gap-4'>
                    {/*campo nombre*/}
                    <div>
                        <label className='text-xs font-semibold text-[#1a2b35] mb-1 block'>Nombre</label>
                        <input 
                            type='text'
                            name='nombreTarea'
                            placeholder='ej: Tarea de Cálculo...'
                            value={formData.nombreTarea}
                            onChange={handleChange}
                            className='w-full p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7]
                                        focus:border-[#f5820d] focus:bg-white outline-none 
                                        transition-all text-sm'
                        />
                        {/*Eror del campo, solo si hayun error*/}
                        {errores.nombreTarea &&(
                            <p className='text-red-400 text-xs mt-1'>{errores.nombreTarea}</p>
                        )}
                    </div>

                    {/*campo de fecha de inicio*/}
                    <div>
                        <label className='text-xs font-semibold text-[#1a2b35] mb-1 block'>
                            Fecha de inicio*
                        </label>
                        <input
                            type='date'
                            name='fechaInicio'
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            className='w-full p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7]
                                        focus:border-[#f5820d] focus:bg-white outline-none transition-all'
                        
                        />
                        {errores.fechaInicio &&(
                            <p className='text-red-400 text-xs mt-1'>{errores.fechaEntrega}</p>
                        )}
                    </div>

                    {/*campo de fecha de entrega*/}
                    <div>
                        <label className='text-xs font-semibold text-[#1a2b35] mb-1 block'>
                            Fecha de entrega*
                        </label>
                        <input
                            type='date'
                            name='fechaEntrega'
                            value={formData.fechaEntrega}
                            onChange={handleChange}
                            className='w-full p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7]
                                        focus:border-[#f5820d] focus:bg-white outline-none transition-all'
                        />
                        {errores.fechaEntrega &&(
                            <p className='text-red-400 text-xs mt-1'>{errores.fechaEntrega}</p>
                            
                        )}
                    </div>
                    {/*campo categoría*/}
                    <div>
                        <label className='text-xs font-semibold text-[#1a2b35] mb-1 block'>
                            Categoría
                        </label> 
                        <select
                            name='categoria'
                            value={formData.categoria}
                            onChange={handleChange}
                            className='w-full p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7]
                                        focus:border-[#f5820d] focus:bg-white outline-none transition-all text-sm'
                        >
                            <option value='personal'>Personal</option>
                            {/*opciones de estudiante, solo si lo es*/}
                            {perfilUsuario?.esEstudiante &&(
                                <>
                                    <option value='tarea'>Tarea</option>
                                    <option value='examen'>Examen</option>
                                    <option value='proyecto'>Proyecto</option>
                                </>
                            )}
                        </select>
                    </div>
                    {/*campo materia, solo si es estudiante*/}
                    {perfilUsuario?.esEstudiante &&(
                        <div>
                            <label
                                className='text-xs font-semibold text-[#1a2b35] mb-1 block'
                            >
                                Materia
                            </label>
                            {/*Si no se escribió ninfuna materia se puede escribir manualmente*/}
                            <select
                                name='materia'
                                value={formData.materia}
                                onChange={handleChange}
                                className='w-full p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7]
                                            focus:border-[#f5820d] focus:bg-white outline-none transition-all text-sm'
                            >
                                {/* recorrer las materias que guardó el usuario en el onboarding */}
                                {perfilUsuario.materias?.map((materia, index) => (
                                    <option key={index} value={materia}>{materia}</option>
                                ))}
                            </select>
                            {errores.materia &&(
                                <p className='text-red-400 text-xs mt-1'>{errores.materia}</p>
                            )}
                        </div>
                    )}
                    {/*campo descripción*/}
                    <div>
                        <label className='text-xs font-semibold text-[#1a2b35] mb-1 block'>
                            Nota <span className='text-[#bbb] font-normal'>(opcional)</span>
                        </label>
                        <textarea
                            name='descripcion'
                            placeholder='¿Algún detalle extra?'
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className='w-full p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7]
                                        focus:border-[#f5820d] focus:bg-white outline-none 
                                        transition-all text-sm resize-none'
                        />
                    </div>
                    {/*botones*/}
                    <div className='flex gap-3 mt-2'>
                        <button
                            onClick={onCerrar}
                            className='flex-1 rounded-xl border border-[#fcd4b0]
                                        text-[#999] text-sm hover:bg-orange-50 transition-all'
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardar}
                            disabled={guardando}
                            className='flex p-3 rounded-xl bg-[#f5820d] hover:bg-[#d96e08] text-white
                                        text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {guardando ? 'Guardando...':'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NuevaTarea