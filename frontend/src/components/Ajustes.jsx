import React from 'react'
import { useState } from 'react'
import { X, Crown, Check, Palette, Bell, BarChart2, ListTodo, ChevronRight, BookOpenCheck } from 'lucide-react'
import temas from '../themes/temas'
import useTema from './useTema'

import {PayPalScriptProvider, PayPalButtons} from '@paypal/react-paypal-js'

//!datos de los planes
const planes = [
    {
        id: 'mensual',
        nombre: 'Mensual',
        precio: '49',
        precioMostrar: '$49',
        periodo: 'por mes',
        descripcion: 'Ideal para probar Premium'
    },
    {
        id: 'anual',
        nombre: 'Anual',
        precio: '399',
        precioMostrar: '$399',
        periodo: 'por año',
        descripcion: 'Ahorra 32% vs mensual',
        recomendado: true
    }
]

const beneficiosPremium = [
    { icono: <ListTodo size={15} />, texto: 'Tareas ilimitadas (gratis: máx. 10)' },
    { icono: <Palette size={15} />, texto: 'Cambio de temas y colores' },
    { icono: <Bell size={15} />, texto: 'Alertas de próximas entregas' },
    // { icono: <BookOpenCheck size={15} />, texto:'Agrega más de 10 tareas'},
    { icono: <BarChart2 size={15} />, texto: 'Gráficas de análisis de tareas' },
]

//!principal componente
const Ajustes = ({ onCerrar, esPremium, setEsPremium, perfilUsuario }) => {

    //? paso del flujo PayPal: null --> planes --> pago --> confirmación
    const [pasoPaypal, setPasoPaypal] = useState(null)
    const [planSeleccionado, setPlanSeleccionado] = useState('anual')

    const { temaActual, cambiarTema } = useTema()

    const payPalOptions = {
        "client-id": 'AXbv6tUGQq-1xSWfJihI8uBU0P1omjQcv61PzIIui-DJVcWTfVWnXTLGd_gbJU5yD6sFNa_yx2OwIj_S',
        currency: 'MXN',
        intent: 'capture',
    }

    const createOrder = (data, actions) => {
        const plan = planes.find(p => p.id === planSeleccionado)

        return actions.order.create({
            purchase_units:[
                {
                    description : `Suscripción Premium ${plan.nombre} - notesApp`,
                    amount:{
                        value: plan.precio,
                    },
                },
            ],
        })
    }

    const onApprove = async (data, actions) => {
        const details = await actions.order.capture()

        console.log("Detalles de la transación exitosa: ", details)
        setEsPremium(true)
        setPasoPaypal('confirmacion')
    }

    const onError = (err) => {
        console.error("Error en el SDK de PayPal: ", err)
        alert("Ha ocurrido un problema al conectar con PayPal. Inténtelo de nuevo.")
    }

    //!render del paso de paypal
    if (pasoPaypal == 'planes') {
        return (
            <ModalBase onCerrar={() => setPasoPaypal(null)} titulo='Elige tu plan' temaActual={temaActual}>
                <div className='flex flex-col gap-3 mb-6'>
                    {planes.map(function(plan) {
                        return (
                            <button
                                key={plan.id}
                                onClick={() => setPlanSeleccionado(plan.id)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all
                                    ${planSeleccionado == plan.id
                                        ? `border-[#f5820d] ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}`
                                        : `${temaActual ? temaActual.borde : 'border-[#fcd4b0]'} ${temaActual ? temaActual.fondoTarjeta : 'bg-white'} hover:border-[#f5820d]`
                                    }`}
                            >
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className={`text-sm font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>{plan.nombre}</p>
                                        <p className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>{plan.descripcion}</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-lg font-bold text-[#f5820d]'>{plan.precioMostrar}</p>
                                        <p className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>{plan.periodo}</p>
                                    </div>
                                </div>
                                {plan.recomendado == true && (
                                    <span className='inline-block mt-2 text-xs bg-[#f5820d] text-white px-2 py-0.5 rounded-full'>
                                        Recomendado
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
                <button
                    onClick={() => setPasoPaypal('pago')}
                    className='w-full bg-[#f5820d] hover:bg-[#d96e08] text-white p-3 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2'
                >
                    Continuar <ChevronRight size={16} />
                </button>
            </ModalBase>
        )
    }

    if (pasoPaypal == 'pago') {
        return (
            <ModalBase onCerrar={() => setPasoPaypal('planes')} titulo='Pago seguro' temaActual={temaActual}>

                {/* resumen del plan */}
                <div className={`flex items-center justify-between p-3 rounded-xl border mb-5
                    ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}
                    ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}`}>
                    <div>
                        <p className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>Plan seleccionado</p>
                        <p className={`text-sm font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                            Premium {planes.find(p => p.id == planSeleccionado)?.nombre}
                        </p>
                    </div>
                    <p className='text-lg font-bold text-[#f5820d]'>
                        {planes.find(p => p.id == planSeleccionado)?.precioMostrar}
                    </p>
                </div>

                {/* botones reales de paypal, esto reemplaza el formulario falso */}
                <PayPalScriptProvider options={payPalOptions}>
                    <PayPalButtons
                        style={{ layout: 'vertical', color: 'gold' }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                    />
                </PayPalScriptProvider>

            </ModalBase>
        )
    }

    if (pasoPaypal == 'confirmacion') {
        return (
            <ModalBase onCerrar={onCerrar} titulo='' temaActual={temaActual}>
                <div className='flex flex-col items-center text-center py-4'>
                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[#f5820d] to-[#f24b6a] flex items-center justify-center mb-4'>
                        <Crown size={28} className='text-white' />
                    </div>
                    <h2 className={`text-xl font-bold mb-1 ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>¡Ya eres Premium!</h2>
                    <p className={`text-sm mb-6 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>
                        Tu cuenta ha sido actualizada. Disfruta de todas las funciones.
                    </p>
                    <div className='flex flex-col gap-2 w-full mb-6'>
                        {beneficiosPremium.map(function(b, i) {
                            return (
                                <div key={i} className={`flex items-center gap-2 text-left p-2 rounded-lg
                                    ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}`}>
                                    <span className='text-[#f5820d]'>{b.icono}</span>
                                    <span className={`text-xs ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>{b.texto}</span>
                                </div>
                            )
                        })}
                    </div>
                    <button
                        onClick={onCerrar}
                        className='w-full bg-[#f5820d] hover:bg-[#d96e08] text-white p-3 rounded-xl text-sm font-semibold transition-all active:scale-95'
                    >
                        Ir al Dashboard
                    </button>
                </div>
            </ModalBase>
        )
    }

    //!pantalla principal de ajustes
    return (
        <ModalBase onCerrar={onCerrar} titulo='Ajustes' temaActual={temaActual}>

            {/* info de cuenta */}
            <div className='mb-6'>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>
                    Mi cuenta
                </p>
                <div className={`flex items-center gap-3 p-4 rounded-xl border
                    ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}
                    ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}`}>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#f5820d] to-[#f24b6a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                        {perfilUsuario?.nombre?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <p className={`text-sm font-semibold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>
                            {perfilUsuario?.nombre || 'Usuario'}
                        </p>
                        <p className={`text-xs ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>
                            {perfilUsuario?.esEstudiante ? 'Cuenta estudiante' : 'Cuenta personal'}
                        </p>
                    </div>
                    {esPremium == true && (
                        <span className='ml-auto flex items-center gap-1 text-xs font-semibold text-[#f5820d] bg-orange-50 px-2 py-1 rounded-full'>
                            <Crown size={12} /> Premium
                        </span>
                    )}
                </div>
            </div>

            {/* preferencias (solo premium) */}
            <div className='mb-6'>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${temaActual ? temaActual.textoSecundario : 'text-[#999]'}`}>
                    Preferencias
                </p>
                <div className={`flex flex-col gap-2 ${esPremium == false ? 'opacity-40 pointer-events-none' : ''}`}>

                    {/* selector de temas - solo visible si es premium */}
                    <div className={`p-3 rounded-xl border
                        ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}
                        ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}`}>
                        <div className='flex items-center gap-2 mb-3'>
                            <Palette size={15} className='text-[#f5820d]' />
                            <span className={`text-sm ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>Tema de color</span>
                            {esPremium == false && <Crown size={13} className='text-[#f5820d] ml-auto' />}
                        </div>

                        {/* grid de temas */}
                        <div className='grid grid-cols-3 gap-2'>

                            {/* opción tema original */}
                            <button
                                onClick={() => cambiarTema(null)}
                                className={`p-2 rounded-xl border-2 text-xs font-medium transition-all
                                    ${temaActual == null
                                        ? 'border-[#f5820d] bg-orange-50'
                                        : 'border-[#fcd4b0] bg-white hover:border-[#f5820d]'
                                    }`}
                            >
                                <div className='w-full h-4 rounded-md bg-[#f5820d] mb-1' />
                                Original
                            </button>

                            {/* un botón pora cada tema  */}
                            {Object.values(temas).map(function(tema) {
                                var colorMuestra = tema.acento.replace('bg-[', '').replace(']', '')
                                return (
                                    <button
                                        key={tema.id}
                                        onClick={() => cambiarTema(tema.id)}
                                        className={`p-2 rounded-xl border-2 text-xs font-medium transition-all
                                            ${temaActual?.id == tema.id
                                                ? 'border-[#f5820d] bg-orange-50'
                                                : 'border-[#fcd4b0] bg-white hover:border-[#f5820d]'
                                            }`}
                                    >
                                        <div
                                            className='w-full h-4 rounded-md mb-1'
                                            style={{ backgroundColor: colorMuestra }}
                                        />
                                        {tema.nombre}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className={`flex items-center justify-between p-3 rounded-xl border
                        ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}
                        ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}`}>
                        <div className='flex items-center gap-2'>
                            <Bell size={15} className='text-[#f5820d]' />
                            <span className={`text-sm ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>Alertas de entregas</span>
                        </div>
                        {esPremium == false && <Crown size={13} className='text-[#f5820d]' />}
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl border
                        ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}
                        ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}`}>
                        <div className='flex items-center gap-2'>
                            <BarChart2 size={15} className='text-[#f5820d]' />
                            <span className={`text-sm ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>Análisis de tareas</span>
                        </div>
                        {esPremium == false && <Crown size={13} className='text-[#f5820d]' />}
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl border
                        ${temaActual ? temaActual.fondoInput : 'bg-[#fffaf7]'}
                        ${temaActual ? temaActual.borde : 'border-[#fcd4b0]'}`}>
                        <div className='flex items-center gap-2'>
                            <BookOpenCheck size={15} className='text-[#f5820d]' />
                            <span className={`text-sm ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>Agrega más de 10 tareas</span>
                        </div>
                        {esPremium == false && <Crown size={13} className='text-[#f5820d]' />}
                    </div>
                </div>
                {esPremium == false && (
                    <p className={`text-xs mt-2 text-center ${temaActual ? temaActual.textoSecundario : 'text-[#bbb]'}`}>
                        Estas funciones están disponibles en Premium
                    </p>
                )}
            </div>

            {/* sección upgrade */}
            {esPremium == false && (
                <div className='rounded-2xl border-2 border-[#f5820d] bg-gradient-to-br from-[#fffaf7] to-[#fff2e8] p-5'>
                    <div className='flex items-center gap-2 mb-3'>
                        <Crown size={16} className='text-[#f5820d]' />
                        <p className='text-sm font-bold text-[#1a2b35]'>Hazte Premium</p>
                    </div>
                    <div className='flex flex-col gap-1.5 mb-4'>
                        {beneficiosPremium.map(function(b, i) {
                            return (
                                <div key={i} className='flex items-center gap-2'>
                                    <Check size={13} className='text-[#f5820d] flex-shrink-0' />
                                    <span className='text-xs text-[#555]'>{b.texto}</span>
                                </div>
                            )
                        })}
                    </div>
                    <button
                        onClick={() => setPasoPaypal('planes')}
                        className='w-full bg-[#f5820d] hover:bg-[#d96e08] text-white p-3 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2'
                    >
                        <Crown size={15} /> Ver planes
                    </button>
                </div>
            )}

            {/* si ya es premium */}
            {esPremium == true && (
                <div className='rounded-2xl bg-gradient-to-br from-[#fff2e8] to-[#fde0d0] p-4 flex items-center gap-3'>
                    <Crown size={20} className='text-[#f5820d] flex-shrink-0' />
                    <div>
                        <p className='text-sm font-bold text-[#1a2b35]'>Cuenta Premium activa</p>
                        <p className='text-xs text-[#999]'>Tienes acceso a todas las funciones</p>
                    </div>
                </div>
            )}

        </ModalBase>
    )
}

//! reutilización de modal base
// ahora recibe temaActual para cambiar sus colores también
const ModalBase = ({ onCerrar, titulo, children, temaActual }) => {
    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'>
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-xl
                max-h-[90vh] overflow-y-auto
                ${temaActual ? temaActual.fondoTarjeta : 'bg-white'}`}>
                <div className='flex items-center justify-between mb-5'>
                    <h2 className={`text-base font-bold ${temaActual ? temaActual.texto : 'text-[#1a2b35]'}`}>{titulo}</h2>
                    <button
                        onClick={onCerrar}
                        className='w-7 h-7 rounded-full bg-[#f5f5f5] hover:bg-[#fcd4b0] flex items-center justify-center transition-all'
                    >
                        <X size={14} className='text-[#999]' />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Ajustes