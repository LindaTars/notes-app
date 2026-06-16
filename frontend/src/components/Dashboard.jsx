import React from 'react'
import { useState } from 'react'
import NuevaTarea from './NuevaTarea'
import { NotebookPen, CircleFadingPlus, Trash2, SquareCheckBig } from 'lucide-react'
import { CalendarCheck2, CalendarFold } from 'lucide-react'
import Ajustes from './Ajustes'
import { use } from 'react'

const Dashboard = ({ perfilUsuario, username }) => {

    const [menuAbierto, setMenuAbierto] = useState(false)

    //! ajustes de premium
    const [mostrarAjustes, setMostrarAjustes] = useState(false)
    const [esPremium, setEsPremium] = useState(false)

    //! Lista de tareas --> solo prueba
    //TODO conectar la tabla TAREAS del back
    const [tareas, setTareas] = useState([
        {
            id: 1, nombreTarea: 'Tarea de Ejemplo', categoria: 'personal',
            fechaInicio: '2026-06-15', fechaEntrega: '2026-06-20', materia: '', descripcion: ''
        },
        {
            id: 2, nombreTarea: 'Estudiar para el examen', categoria: 'examen',
            fechaInicio: '2026-06-15', fechaEntrega: '2026-06-18', materia: 'inglés'
        }
    ])

    //? ids de tareas marcadas como completadas
    const [completadas, setCompletadas] = useState([])

    //? mostrar u ocultar formulario de nueva tarea
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    //? agregar la tarea nueva a la lista y cerrar el formulario
    const handleGuardarTarea = (tareaGuardada) => {
        setTareas([...tareas, tareaGuardada])
        setMostrarFormulario(false)
    }

    //? marcar como completada y eliminar después de 1.5s
    const handleCompletar = (id) => {
        setCompletadas(prev => [...prev, id])
        setTimeout(() => {
            setTareas(prev => prev.filter(t => t.id !== id))
            setCompletadas(prev => prev.filter(c => c !== id))
        }, 1500)
    }

    //? eliminar tarea directamente
    const handleEliminar = (id) => {
        setTareas(prev => prev.filter(t => t.id !== id))
    }

    return (
        <div className='min-h-screen bg-[#e2d2c7]'>

            {/*--HEADER--*/}
            <header className='bg-white shadow-sm shadow-orange-100
                                px-6 py-4 flex items-center justify-between'>

                <div className='flex items-center gap-2'>
                    <span className='text-xl font-bold text-[#1a2b35]'>notesApp</span>
                    <NotebookPen />
                </div>

                <div className='relative'>
                    <button
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        className='w-9 h-9 rounded-full bg-gradient-to-br
                                from-[#f5820d] to-[#f24b6a] flex items-center
                                justify-center text-white text-sm font-bold'
                    >
                        {/*Muestra la primera letra del username*/}
                        {username ? username[0].toUpperCase() : '?'}
                    </button>

                    {/*mini menú de perfil, solo si menuAbierto=true*/}
                    {menuAbierto && (
                        <div className='absolute right-0 mt-2 w-44 bg-white rounded-xl
                                        shadow-lg border border-orange-100 z-10'>
                            <div className='px-4 py-3 border-b border-orange-50'>
                                <p className='text-xs font-semibold text-[#1a2b35]'>{username}</p>
                                {/*TODO mostrar el email (sacarlo del back)*/}
                                <p className='text-xs text-[#bbb]'>
                                    {perfilUsuario?.esEstudiante ? 'Cuenta estudiante' : 'Cuenta personal'}
                                </p>
                            </div>
                            {/*opciones del menú*/}
                            <div className='py-1'>
                                {/*TODO conectar cerrar sesión*/}
                                <button
                                    onClick={() => {
                                        setMostrarAjustes(true); setMenuAbierto(false)
                                    }}
                                    className='w-full text-left px-4 text-xs text-[#999]
                                                hover:bg-orange-50 transition-all'
                                >
                                    Ajustes
                                </button>
                                <button
                                    className='w-full text-left px-4 py-2 text-xs text-[#999]
                                                hover:bg-orange-50 transition-all'
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/*---CONTENIDO PRINCIPAL---*/}
            <main className='max-w-4xl mx-auto px-6 py-8'>

                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-[#1a2b35]'>
                        Hola, {username || 'usuario'}
                    </h1>
                    <p className='text-sm text-[#999] mt-1'>
                        {perfilUsuario?.esEstudiante
                            ? 'Aquí están tus tareas, exámenes y proyectos.'
                            : 'Aquí están tus pendientes'
                        }
                    </p>
                </div>

                {/*
                ---TARJETAS DE RESUMEN---
                esto solo aparece si el usuario == estudiante
                */}
                {perfilUsuario?.esEstudiante && (
                    <div className='grid grid-cols-3 gap-4 mb-8'>

                        {/*examenes*/}
                        <div className='bg-white rounded-2xl p-5 shadow-sm shadow-orange-100'>
                            <p className='text-xs text-[#999] mb-1'>Exámenes</p>
                            <p className='text-3xl font-bold text-[#f5820d]'>
                                {tareas.filter(t => t.categoria === 'examen').length}
                            </p>
                            <p className='text-xs text-[#999] mt-1'>próximos</p>
                        </div>

                        {/*tareas pendientes*/}
                        <div className='bg-white rounded-2xl p-5 shadow-sm shadow-orange-100'>
                            <p className='text-xs text-[#bbb] mb-1'>Tareas pendientes</p>
                            <p className='text-3xl font-bold text-[#f24b6a]'>
                                {tareas.filter(t => t.categoria === 'tarea').length}
                            </p>
                            <p className='text-xs text-[#999] mt-1'>por entregar</p>
                        </div>

                        {/*proyectos*/}
                        <div className='bg-white rounded-2xl p-5 shadow-sm shadow-orange-100'>
                            <p className='text-xs text-[#bbb] mb-1'>Proyectos</p>
                            <p className='text-3xl font-bold text-[#1a2b35]'>
                                {tareas.filter(t => t.categoria === 'proyecto').length}
                            </p>
                            <p className='text-xs text-[#999] mt-1'>en curso</p>
                        </div>

                    </div>
                )}

                {/* tareas + calendario */}
                <div className='flex flex-col lg:flex-row gap-6'>

                    {/* columna izquierda: lista de tareas */}
                    <div className='flex-1 bg-white rounded-2xl p-6 shadow-sm shadow-orange-100'>

                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                                <CalendarCheck2 size={16} />
                                <h2 className='text-sm font-bold text-[#1a2b35]'>
                                    {perfilUsuario?.esEstudiante ? 'Tareas' : 'Pendientes'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className='w-7 h-7 rounded-full bg-[#f5820d] hover:bg-[#d96e08]
                                            text-white flex items-center justify-center text-lg
                                            transition-all active:scale-95'
                            >
                                <CircleFadingPlus />
                            </button>
                        </div>

                        {/*---LISTA DE TAREAS---*/}
                        {tareas.length === 0
                            ? (
                                //* no tareas = mensaje
                                <p className='text-xs text-[#bbb] text-center py-6'>
                                    No tienes tareas por ahora.
                                </p>
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    {tareas.map((tarea) => (
                                        <div
                                            key={tarea.id}
                                            className='flex items-center gap-3 p-3 rounded-xl
                                                        bg-[#fffaf7] border border-[#fcd4b0]'
                                        >
                                            {/* checkbox completar */}
                                            <button onClick={() => handleCompletar(tarea.id)}>
                                                <SquareCheckBig
                                                    size={16}
                                                    className={completadas.includes(tarea.id)
                                                        ? 'text-[#f5820d]'
                                                        : 'text-[#bbb] hover:text-[#f5820d] transition-all'
                                                    }
                                                />
                                            </button>

                                            {/* punto de color por categoría */}
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0
                                                ${tarea.categoria === 'examen' ? 'bg-[#f5820d]'
                                                : tarea.categoria === 'proyecto' ? 'bg-[#1a2b35]'
                                                : 'bg-[#f24b6a]'}`}
                                            />

                                            <div className='flex-1 min-w-0'>
                                                <p className={`text-sm font-medium truncate transition-all
                                                    ${completadas.includes(tarea.id)
                                                        ? 'line-through text-[#bbb]'
                                                        : 'text-[#1a2b35]'
                                                    }`}
                                                >
                                                    {tarea.nombreTarea}
                                                </p>
                                                {/*mostrar materia si == estudiante && materia*/}
                                                {perfilUsuario?.esEstudiante && tarea.materia && (
                                                    <p className='text-xs text-[#bbb]'>{tarea.materia}</p>
                                                )}
                                            </div>

                                            {/*fecha de entrega*/}
                                            <p className='text-xs text-[#bbb] flex-shrink-0'>
                                                {tarea.fechaEntrega}
                                            </p>

                                            {/* botón eliminar */}
                                            <button onClick={() => handleEliminar(tarea.id)}>
                                                <Trash2
                                                    size={14}
                                                    className='text-[#bbb] hover:text-[#f24b6a] transition-all'
                                                />
                                            </button>

                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                    {/* fin columna izquierda */}

                    {/* columna derecha: calendario */}
                    <div className='w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm shadow-orange-100'>
                        <div className='flex items-center gap-2 mb-4'>
                            <CalendarFold size={16} />
                            <h2 className='text-sm font-bold text-[#1a2b35]'>Calendario</h2>
                        </div>
                        {/*TODO agregar calendario de verdad*/}
                        <CalendarioSimple tareas={tareas} />
                    </div>
                    {/* fin columna derecha */}

                </div>
                {/* fin tareas + calendario */}

            </main>
            {/*==== FIN CONTENIDO ====*/}

            {/*---FORMULARIO DE NUEVA TAREA---*/}
            {/*solo se muestra si mostrarFormulario=true*/}
            {mostrarFormulario && (
                <NuevaTarea
                    perfilUsuario={perfilUsuario}
                    onGuardar={handleGuardarTarea}
                    onCerrar={() => setMostrarFormulario(false)}
                />
            )}

        {mostrarAjustes &&(
            <Ajustes 
                onCerrar={() => setMostrarAjustes(false)}
                esPremium={esPremium}
                setEsPremium={setEsPremium}
                perfilUsuario={perfilUsuario}
            />
        )}
        </div>

        
    )
}

//! ===== COMPONENTE CALENDARIO ====
const CalendarioSimple = ({ tareas }) => {

    //? obtención del mes y año actual
    const hoy = new Date()
    const [mesActual, setMesActual] = useState(hoy)
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
        'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
        'Noviembre', 'Diciembre'
    ]
    const diasSemana = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

    //? cuántos días tiene el mes actual
    const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate()
    //? qué dia empieza el mes (0 = domingo, 6 = sábado)
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).getDay()

    //? obtener los días en los que se tiene tarea para marcarlos
    //TODO sacar info del back
    const diasConTarea = tareas
        .map(t => new Date(t.fechaEntrega + 'T00:00:00'))
        .filter(f => f.getMonth() === mesActual.getMonth() && f.getFullYear() === mesActual.getFullYear())
        .map(f => f.getDate())

    //* mostrar mes anterior
    const mesAntes = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))
    }

    //* mostrar mes siguiente
    const mesSiguiente = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-3'>
                <button
                    onClick={mesAntes}
                    className='text-[#bbb] hover:text-[#f5820d] transition-all text-sm'
                >
                    ←
                </button>
                <p className='text-xs font-semibold text-[#1a2b35]'>
                    {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
                </p>
                <button
                    onClick={mesSiguiente}
                    className='text-[#bbb] hover:text-[#f5820d] transition-all text-sm'
                >
                    →
                </button>
            </div>

            {/*dias*/}
            <div className='grid grid-cols-7 mb-1'>
                {diasSemana.map(d => (
                    <p key={d} className='text-center text-xs text-[#bbb] py-1'>{d}</p>
                ))}
            </div>

            {/*grid de dias*/}
            <div className='grid grid-cols-7 gap-y-1'>
                {Array.from({ length: primerDia }).map((_, i) => (
                    <div key={`vacio-${i}`} />
                ))}

                {/*dias del mes*/}
                {/* tienes que usar llaves {} y poner return explícito*/}
                {Array.from({ length: diasEnMes }).map((_, i) => {
                    const dia = i + 1
                    const esHoy = dia === hoy.getDate()
                        && mesActual.getMonth() === hoy.getMonth()
                        && mesActual.getFullYear() === hoy.getFullYear()
                    const tieneTarea = diasConTarea.includes(dia)

                    return (
                        <div
                            key={dia}
                            className={`text-center text-xs py-1 rounded-full mx-auto w-6 h-6 flex items-center justify-center
                                ${esHoy ? 'bg-[#f5820d] text-white font-bold' : ''}
                                ${tieneTarea && !esHoy ? 'text-[#f24b6a] font-semibold' : ''}
                                ${!esHoy && !tieneTarea ? 'text-[#1a2b35]' : ''}
                            `}
                        >
                            {dia}
                        </div>
                    )
                })}
            </div>

            {/*leyenda*/}
            <div className='flex gap-3 mt-3'>
                <div className='flex items-center gap-1'>
                    <span className='w-2 h-2 rounded-full bg-[#f5820d]' />
                    <span className='text-xs text-[#bbb]'>hoy</span>
                </div>
                <div className='flex items-center gap-1'>
                    <span className='w-2 h-2 rounded-full bg-[#f24b6a]' />
                    <span className='text-xs text-[#bbb]'>entrega</span>
                </div>
            </div>
        </div>
    )
}

export default Dashboard