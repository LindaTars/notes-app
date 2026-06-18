import React from 'react'
import { useState, useEffect } from 'react' 
import NuevaTarea from './NuevaTarea'
import { NotebookPen, CircleFadingPlus, Trash2, SquareCheckBig, Bell, BarChart2 } from 'lucide-react'
import { CalendarCheck2, CalendarFold } from 'lucide-react'
import Ajustes from './Ajustes'
import useTema from './useTema'
import { getTareas, crearTarea, eliminarTarea } from '../services/notasService'

const Dashboard = ({ perfilUsuario, setPerfilUsuario, username }) => {

    const [menuAbierto, setMenuAbierto] = useState(false)

    //! ajustes de premium
    const [mostrarAjustes, setMostrarAjustes] = useState(false)
    const [esPremium, setEsPremium] = useState(false)

    //! Lista de tareas --> ya no hardcodeada, ahora viene del back
    const [tareas, setTareas] = useState([])

    //* para saber si todavía está cargando las tareas del back
    const [cargando, setCargando] = useState(true)

    // por si el fetch falla, guardar el mensaje de error
    const [errorTareas, setErrorTareas] = useState(null)

    //? ids de tareas marcadas como completadas
    const [completadas, setCompletadas] = useState([])

    //? mostrar u ocultar formulario de nueva tarea
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    //? limite de tareas
    const [limiteAlcanzado, setLimiteAlcanzado] = useState(false)

    const { temaActual } = useTema()

    // useEffect con [] vacío = se ejecuta una sola vez cuando el componente monta
    // aquí es donde le pido las tareas al back
    useEffect(() => {
        const cargarTareas = async () => {
            try {
                setCargando(true)
                const data = await getTareas()
                // TODO revisar cómo responde exactamente tu NotaController@mostrarTareas
   
                setTareas(data.data ?? data)
            } catch (err) {
                console.error('Error al cargar tareas:', err)
                setErrorTareas('No se pudieron cargar las tareas. Intenta recargar.')
            } finally {
                // con o sin error, ya no estamos cargando
                setCargando(false)
            }
        }

        cargarTareas()
    }, [])

    //*agregar la tarea nueva a la lista y cerrar el formulario
    //* ahora primero la manda al back y luego actualiza el estado local
    const handleGuardarTarea = async (tareaGuardada) => {
        if (!esPremium && tareas.length >= 10) {
            setLimiteAlcanzado(true)
            setTimeout(() => setLimiteAlcanzado(false), 3000)
            return
        }
        try {
            const data = await crearTarea(tareaGuardada)
            //*Se usa la tarea que regresa el back porque ya tiene el id real de la BD
            setTareas(prev => [...prev, data.data ?? data])
            setMostrarFormulario(false)
        } catch (err) {
            console.error('Error al guardar tarea:', err)
            //TODO mostrar algún mensaje de error al usuario aquí
        }
    }

    //? marcar como completada y eliminar después de 1.5s
    const handleCompletar = (id) => {
        setCompletadas(prev => [...prev, id])
        setTimeout(() => {
            //* Se llama al back para borrarlo, pero no espero respuest
            //*si falla, en el siguiente reload aparecerá de nuevo
            //TODO mejorar esto después, manejar el error correctamente
            eliminarTarea(id).catch(err => console.error('Error al completar tarea:', err))
            setTareas(prev => prev.filter(t => t.id !== id))
            setCompletadas(prev => prev.filter(c => c !== id))
        }, 1500)
    }

    //? eliminar tarea directamente
    const handleEliminar = async (id) => {
        try {
            await eliminarTarea(id)
            setTareas(prev => prev.filter(t => t.id !== id))
        } catch (err) {
            console.error('Error al eliminar tarea:', err)
            //TODO mostrar algo al usuario aquí también
        }
    }

    //? cerrar sesión
    const handleCerrarSesion = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        window.location.reload()
    }
//! Alertas para las tareas que bienen 
    //? hoy sin horas, para que la comparación de días sea exacta
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    //? una tarea es urgente si le quedan 2 días o menos (o ya se pasó) y no está completada
    //TODO tal vez hacer que el número de días sea configurable, por ahora dejo 2 fijo
    const esUrgente = (tarea) => {
        if (completadas.includes(tarea.id)) return false
        const fechaEntrega = new Date(tarea.fechaEntrega + 'T00:00:00')
        const diasFaltantes = Math.ceil((fechaEntrega - hoy) / (1000 * 60 * 60 * 24))
        return diasFaltantes <= 2
    }

    const tareasUrgentes = tareas.filter(esUrgente)

    //* mientras el back responde, muestra un mensaje simple
    //TODO hacer un spinner más bonito después
    if (cargando) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-[#999]">Cargando tareas...</p>
        </div>
    )

    //*si el fetch falló, aviso al usuario
    if (errorTareas) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-[#f24b6a]">{errorTareas}</p>
        </div>
    )

    return (
        <div className={`min-h-screen ${temaActual ? temaActual.fondo : 'bg-[#e2d2c7]'}`}>

            {/*Headr*/}
            <header className={`px-6 py-4 flex items-center justify-between shadow-sm
                ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>

                <div className='flex items-center gap-2'>
                    <span className={`text-xl font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                        notesApp
                    </span>
                    <NotebookPen className={temaActual ? temaActual.acentoTexto : 'text-[#1a2b35]'} />
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

                    {/*mini menú de perfil, solo si menuAbierto es true*/}
                    {menuAbierto && (
                        <div className={`absolute right-0 mt-2 w-44 rounded-xl shadow-lg z-10 border
                            ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                            ${temaActual ? temaActual.borde : 'border-orange-100'}`}>
                            <div className={`px-4 py-3 border-b ${temaActual ? temaActual.borde : 'border-orange-50'}`}>
                                <p className={`text-xs font-semibold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                                    {username}
                                </p>
                                {/*TODO mostrar el email (sacarlo del back con /viewPerfil)*/}
                                <p className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>
                                    {perfilUsuario?.esEstudiante ? 'Cuenta estudiante' : 'Cuenta personal'}
                                </p>
                            </div>
                            {/*opciones del menú*/}
                            <div className='py-1'>
                                <button
                                    onClick={() => { setMostrarAjustes(true); setMenuAbierto(false) }}
                                    className={`w-full text-left px-4 py-2 text-xs transition-all
                                        ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}
                                        hover:bg-orange-50`}
                                >
                                    Ajustes
                                </button>
                                {/*ya conectado, antes le faltaba el onClick*/}
                                <button
                                    onClick={() => { handleCerrarSesion(); setMenuAbierto(false) }}
                                    className={`w-full text-left px-4 py-2 text-xs transition-all
                                        ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}
                                        hover:bg-orange-50`}
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/*Contenido Pricipal chido*/}
            <main className='max-w-4xl mx-auto px-6 py-8'>

                <div className='mb-8'>
                    <h1 className={`text-2xl font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                        Hola, {username || 'usuario'}
                    </h1>
                    <p className={`text-sm mt-1 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>
                        {perfilUsuario?.esEstudiante
                            ? 'Aquí están tus tareas, exámenes y proyectos.'
                            : 'Aquí están tus pendientes'
                        }
                    </p>
                </div>

                {/*Alerta de las Proximas entregas, solo premium*/}
                {esPremium && tareasUrgentes.length > 0 && (
                    <div className='flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 mb-8'>
                        <Bell size={16} className='text-[#f24b6a] flex-shrink-0' />
                        <p className='text-sm text-[#f24b6a] font-medium'>
                            Tienes {tareasUrgentes.length} {tareasUrgentes.length === 1 ? 'tarea' : 'tareas'} por entregar pronto
                        </p>
                    </div>
                )}

                {/*Aviso de limite de tareas, tambien si es premium*/}
                {limiteAlcanzado && (
                    <div className='flex items-center gap-2 p-4 rounded-xl bg-orange-50 border border-orange-200 mb-8'>
                        <Bell size={16} className='text-[#f5820d] flex-shrink-0' />
                        <p className='text-sm text-[#f5820d] font-medium'>
                            Alcanzaste el límite de 10 tareas. ¡Hazte premium para agregar más! 
                        </p>
                    </div>
                )}

                {/*
              tarjeta resumes solo para estudiantes
                */}
                {perfilUsuario?.esEstudiante && (
                    <div className='grid grid-cols-3 gap-4 mb-8'>

                        {/*examenes*/}
                        <div className={`rounded-2xl p-5 shadow-sm
                            ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                            ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>
                            <p className={`text-xs mb-1 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>Exámenes</p>
                            <p className='text-3xl font-bold text-[#f5820d]'>
                                {tareas.filter(t => t.categoria === 'examen').length}
                            </p>
                            <p className={`text-xs mt-1 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>próximos</p>
                        </div>

                        {/*tareas pendientes*/}
                        <div className={`rounded-2xl p-5 shadow-sm
                            ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                            ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>
                            <p className={`text-xs mb-1 ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>Tareas pendientes</p>
                            <p className='text-3xl font-bold text-[#f24b6a]'>
                                {tareas.filter(t => t.categoria === 'tarea').length}
                            </p>
                            <p className={`text-xs mt-1 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>por entregar</p>
                        </div>

                        {/*proyectos*/}
                        <div className={`rounded-2xl p-5 shadow-sm
                            ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                            ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>
                            <p className={`text-xs mb-1 ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>Proyectos</p>
                            <p className={`text-3xl font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                                {tareas.filter(t => t.categoria === 'proyecto').length}
                            </p>
                            <p className={`text-xs mt-1 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>en curso</p>
                        </div>

                    </div>
                )}

                {/*Analicis de las tareas tambien si es solo premium y solo estudiante*/}
                {perfilUsuario?.esEstudiante && esPremium && (
                    <div className={`rounded-2xl p-6 shadow-sm mb-8
                        ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                        ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>
                        <div className='flex items-center gap-2 mb-4'>
                            <BarChart2 size={16} className={temaActual ? temaActual.acentoTexto : 'text-[#1a2b35]'} />
                            <h2 className={`text-sm font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                                Análisis de tareas
                            </h2>
                        </div>
                        <AnalisisTareas tareas={tareas} temaActual={temaActual} />
                    </div>
                )}

                {/* tareas mas el calendario */}
                <div className='flex flex-col lg:flex-row gap-6'>

                    {/* columna izquierda visualiza la lista de tareas */}
                    <div className={`flex-1 rounded-2xl p-6 shadow-sm
                        ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                        ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>

                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                                <CalendarCheck2 size={16} className={temaActual ? temaActual.acentoTexto : 'text-[#1a2b35]'} />
                                <h2 className={`text-sm font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                                    {perfilUsuario?.esEstudiante ? 'Tareas' : 'Pendientes'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-lg
                                            transition-all active:scale-95
                                            ${temaActual ? temaActual.acento : 'bg-[#f5820d]'}
                                            ${temaActual ? temaActual.acentoHover : 'hover:bg-[#d96e08]'}`}
                            >
                                <CircleFadingPlus />
                            </button>
                        </div>

                        {/*Lista de tareas*/}
                        {tareas.length === 0
                            ? (
                                //* no tareas = mensaje
                                <p className={`text-xs text-center py-6 ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>
                                    No tienes tareas por ahora.
                                </p>
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    {tareas.map(function(tarea) {
                                        return (
                                            <div
                                                key={tarea.id}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                                                    ${esPremium && esUrgente(tarea)
                                                        ? 'bg-red-50 border-red-200'
                                                        : `${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'} ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}`
                                                    }`}
                                            >
                                                {/* checkbox para completar las tareas */}
                                                <button onClick={() => handleCompletar(tarea.id)}>
                                                    <SquareCheckBig
                                                        size={16}
                                                        className={completadas.includes(tarea.id)
                                                            ? 'text-[#f5820d]'
                                                            : `${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'} hover:text-[#f5820d] transition-all`
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
                                                            : temaActual ? temaActual.texto : 'text-[#1a2b35]'
                                                        }`}
                                                    >
                                                        {tarea.nombreTarea}
                                                    </p>
                                                    {/* se musetra la materia si es estudiante y tiene  materia*/}
                                                    {perfilUsuario?.esEstudiante && tarea.materia && (
                                                        <p className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>
                                                            {tarea.materia}
                                                        </p>
                                                    )}
                                                </div>

                                                {/*fecha de entrega*/}
                                                <p className={`text-xs flex-shrink-0 ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>
                                                    {tarea.fechaEntrega}
                                                </p>

                                                {/* botón eliminar */}
                                                <button onClick={() => handleEliminar(tarea.id)}>
                                                    <Trash2
                                                        size={14}
                                                        className={`transition-all ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'} hover:text-[#f24b6a]`}
                                                    />
                                                </button>

                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    </div>
                    {/* fin de la columna  izquierda */}

                    {/* Ahora la columna derecha que muestra el calendario */}
                    <div className={`w-full lg:w-72 rounded-2xl p-6 shadow-sm
                        ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}
                        ${temaActual ? temaActual.sombra : 'shadow-orange-100'}`}>
                        <div className='flex items-center gap-2 mb-4'>
                            <CalendarFold size={16} className={temaActual ? temaActual.acentoTexto : 'text-[#1a2b35]'} />
                            <h2 className={`text-sm font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>Calendario</h2>
                        </div>
                        {/*TODO agregar calendario de verdad*/}
                        <CalendarioSimple tareas={tareas} temaActual={temaActual} />
                    </div>
                    {/* fin de la columna derecha */}

                </div>
                {/* fin tareas y del calendario */}

            </main>
            {/*Fin del del contenido prinsipal*/}

            {/*Formulario para guardar nuevas tareas*/}
            {/*solo se muestra si mostrarFormulario es igual a true*/}
            {mostrarFormulario && (
                <NuevaTarea
                    perfilUsuario={perfilUsuario}
                    onGuardar={handleGuardarTarea}
                    onCerrar={() => setMostrarFormulario(false)}
                />
            )}

            {mostrarAjustes && (
                <Ajustes
                    onCerrar={() => setMostrarAjustes(false)}
                    esPremium={esPremium}
                    setEsPremium={setEsPremium}
                    perfilUsuario={perfilUsuario}
                    setPerfilUsuario={setPerfilUsuario}
                    username={username}
                />
            )}
        </div>
    )
}

//! Cacho para el analicis de las tareas de premium
const AnalisisTareas = ({ tareas, temaActual }) => {

    const categorias = ['examen', 'tarea', 'proyecto']
    const infoCategoria = {
        examen: { nombre: 'Exámenes', color: '#f5820d' },
        tarea: { nombre: 'Tareas', color: '#f24b6a' },
        proyecto: { nombre: 'Proyectos', color: '#1a2b35' }
    }

    //? cuántas tareas hay de cada categoría, examen, proyecto, tarea
    const conteos = categorias.map(cat => ({
        categoria: cat,
        total: tareas.filter(t => t.categoria === cat).length
    }))

    const maximo = Math.max(...conteos.map(c => c.total), 1)

    return (
        <div className='flex flex-col gap-3'>
            {conteos.map(c => (
                <div key={c.categoria} className='flex items-center gap-3'>
                    <p className={`text-xs w-20 flex-shrink-0 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>
                        {infoCategoria[c.categoria].nombre}
                    </p>

                    <div className='flex-1 h-3 rounded-full bg-[#f5f5f5] overflow-hidden'>
                        <div
                            className='h-full rounded-full transition-all'
                            style={{
                                width: `${(c.total / maximo) * 100}%`,
                                backgroundColor: infoCategoria[c.categoria].color
                            }}
                        />
                    </div>

                    <p className={`text-xs font-bold w-5 text-right ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                        {c.total}
                    </p>
                </div>
            ))}
        </div>
    )
}

//! Componente para el calendario
// *Ya recibe temaActual para cambiar sus colores
const CalendarioSimple = ({ tareas, temaActual }) => {

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
                    className={`hover:text-[#f5820d] transition-all text-sm
                        ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}
                >
                    ←
                </button>
                <p className={`text-xs font-semibold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                    {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
                </p>
                <button
                    onClick={mesSiguiente}
                    className={`hover:text-[#f5820d] transition-all text-sm
                        ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}
                >
                    →
                </button>
            </div>

            {/*dias*/}
            <div className='grid grid-cols-7 mb-1'>
                {diasSemana.map(d => (
                    <p key={d} className={`text-center text-xs py-1 ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>{d}</p>
                ))}
            </div>

            {/*grid de dias*/}
            <div className='grid grid-cols-7 gap-y-1'>
                {Array.from({ length: primerDia }).map((_, i) => (
                    <div key={`vacio-${i}`} />
                ))}

                {/*dias del mes*/}
            
                {Array.from({ length: diasEnMes }).map(function(_, i) {
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
                                ${!esHoy && !tieneTarea ? temaActual ? temaActual.texto : 'text-[#1a2b35]' : ''}
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
                    <span className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>hoy</span>
                </div>
                <div className='flex items-center gap-1'>
                    <span className='w-2 h-2 rounded-full bg-[#f24b6a]' />
                    <span className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>entrega</span>
                </div>
            </div>
        </div>
    )
}

export default Dashboard