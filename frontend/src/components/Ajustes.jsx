import React from 'react'
import { useState } from 'react'
import { X, Crown, Check, Palette, Bell, BarChart2, ListTodo, CreditCard, ChevronRight } from 'lucide-react'

//!datos de los planes
const planes = [
    {
        id: 'mensual',
        nombre: 'Mensual',
        precio: '$49',
        periodo: 'por mes',
        descripcion: 'Ideal para probar Premium'
    },
    {
        id: 'anual',
        nombre: 'Anual',
        precio: '$399',
        periodo: 'por año',
        descripcion: 'Ahorra 32% vs mensual',
        recomendado: true
    }
]

const beneficiosPremium = [
    { icono: <ListTodo size={15} />, texto: 'Tareas ilimitadas (gratis: máx. 10)' },
    { icono: <Palette size={15} />, texto: 'Cambio de temas y colores' },
    { icono: <Bell size={15} />, texto: 'Alertas de próximas entregas' },
    { icono: <BarChart2 size={15} />, texto: 'Gráficas de análisis de tareas' },
]

//!principal componente
const Ajustes = ({ onCerrar, esPremium, setEsPremium, perfilUsuario }) => {

    //? paso del flujo PayPal: null | 'planes' | 'pago' | 'confirmacion'
    const [pasoPaypal, setPasoPaypal] = useState(null)
    const [planSeleccionado, setPlanSeleccionado] = useState('anual')
    const [procesando, setProcesando] = useState(false)

    //? datos del formulario de pago simulado
    const [datosPago, setDatosPago] = useState({
        email: '',
        nombreTarjeta: '',
        numeroTarjeta: '',
        expiracion: '',
        cvv: ''
    })

    //? simular el proceso de pago
    const handlePagar = async () => {
        setProcesando(true)
        //* simulación de una espera de red
        await new Promise(function(resolve) {
            setTimeout(resolve, 2000)
        })
        setProcesando(false)
        setPasoPaypal('confirmacion')
        setEsPremium(true)
    }

    //!render del paso de paypal
    if (pasoPaypal == 'planes') {
        return (
            <ModalBase onCerrar={() => setPasoPaypal(null)} titulo='Elige tu plan'>
                <div className='flex flex-col gap-3 mb-6'>
                    {planes.map(function(plan) {
                        return (
                            <button
                                key={plan.id}
                                onClick={() => setPlanSeleccionado(plan.id)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all
                                    ${planSeleccionado == plan.id
                                        ? 'border-[#f5820d] bg-[#fffaf7]'
                                        : 'border-[#fcd4b0] bg-white hover:border-[#f5820d]'
                                    }`}
                            >
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-bold text-[#1a2b35]'>{plan.nombre}</p>
                                        <p className='text-xs text-[#999]'>{plan.descripcion}</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-lg font-bold text-[#f5820d]'>{plan.precio}</p>
                                        <p className='text-xs text-[#bbb]'>{plan.periodo}</p>
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
            <ModalBase onCerrar={() => setPasoPaypal('planes')} titulo='Pago seguro'>

                {/* logo PayPal simulado */}
                <div className='flex items-center justify-center gap-2 mb-5 p-3 bg-[#fffaf7] rounded-xl border border-[#fcd4b0]'>
                    <span className='text-[#003087] font-black text-lg'>Pay</span>
                    <span className='text-[#009cde] font-black text-lg'>Pal</span>
                    <span className='text-xs text-[#999] ml-1'>— pago simulado —</span>
                </div>

                <div className='flex flex-col gap-3 mb-5'>
                    <input
                        type='email'
                        placeholder='Correo de PayPal'
                        className='p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white outline-none text-sm'
                        onChange={e => setDatosPago({ ...datosPago, email: e.target.value })}
                    />
                    <input
                        type='text'
                        placeholder='Nombre en la tarjeta'
                        className='p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white outline-none text-sm'
                        onChange={e => setDatosPago({ ...datosPago, nombreTarjeta: e.target.value })}
                    />
                    <input
                        type='text'
                        placeholder='Número de tarjeta'
                        maxLength={19}
                        className='p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white outline-none text-sm'
                        onChange={e => setDatosPago({ ...datosPago, numeroTarjeta: e.target.value })}
                    />
                    <div className='flex gap-3'>
                        <input
                            type='text'
                            placeholder='MM/AA'
                            maxLength={5}
                            className='flex-1 p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white outline-none text-sm'
                            onChange={e => setDatosPago({ ...datosPago, expiracion: e.target.value })}
                        />
                        <input
                            type='text'
                            placeholder='CVV'
                            maxLength={3}
                            className='w-24 p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white outline-none text-sm'
                            onChange={e => setDatosPago({ ...datosPago, cvv: e.target.value })}
                        />
                    </div>
                </div>

                {/* resumen del plan */}
                <div className='flex items-center justify-between p-3 bg-[#fffaf7] rounded-xl border border-[#fcd4b0] mb-5'>
                    <div>
                        <p className='text-xs text-[#999]'>Plan seleccionado</p>
                        <p className='text-sm font-bold text-[#1a2b35]'>
                            Premium {planes.find(p => p.id == planSeleccionado)?.nombre}
                        </p>
                    </div>
                    <p className='text-lg font-bold text-[#f5820d]'>
                        {planes.find(p => p.id == planSeleccionado)?.precio}
                    </p>
                </div>

                <button
                    onClick={handlePagar}
                    disabled={procesando}
                    className='w-full bg-[#003087] hover:bg-[#002060] text-white p-3 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60'
                >
                    {procesando == true
                        ? 'Procesando...'
                        : <><CreditCard size={16} /> Pagar con PayPal</>
                    }
                </button>
            </ModalBase>
        )
    }

    if (pasoPaypal == 'confirmacion') {
        return (
            <ModalBase onCerrar={onCerrar} titulo=''>
                <div className='flex flex-col items-center text-center py-4'>
                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[#f5820d] to-[#f24b6a] flex items-center justify-center mb-4'>
                        <Crown size={28} className='text-white' />
                    </div>
                    <h2 className='text-xl font-bold text-[#1a2b35] mb-1'>¡Ya eres Premium!</h2>
                    <p className='text-sm text-[#999] mb-6'>
                        Tu cuenta ha sido actualizada. Disfruta de todas las funciones.
                    </p>
                    <div className='flex flex-col gap-2 w-full mb-6'>
                        {beneficiosPremium.map(function(b, i) {
                            return (
                                <div key={i} className='flex items-center gap-2 text-left p-2 rounded-lg bg-[#fffaf7]'>
                                    <span className='text-[#f5820d]'>{b.icono}</span>
                                    <span className='text-xs text-[#1a2b35]'>{b.texto}</span>
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

    //!pantalla principal de los planes
    return (
        <ModalBase onCerrar={onCerrar} titulo='Ajustes'>

            {/* info de cuenta */}
            <div className='mb-6'>
                <p className='text-xs font-semibold text-[#999] uppercase tracking-wide mb-3'>
                    Mi cuenta
                </p>
                <div className='flex items-center gap-3 p-4 bg-[#fffaf7] rounded-xl border border-[#fcd4b0]'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#f5820d] to-[#f24b6a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                        {perfilUsuario?.nombre?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <p className='text-sm font-semibold text-[#1a2b35]'>
                            {perfilUsuario?.nombre || 'Usuario'}
                        </p>
                        <p className='text-xs text-[#bbb]'>
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
                <p className='text-xs font-semibold text-[#999] uppercase tracking-wide mb-3'>
                    Preferencias
                </p>
                <div className={`flex flex-col gap-2 ${esPremium == false ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className='flex items-center justify-between p-3 rounded-xl bg-[#fffaf7] border border-[#fcd4b0]'>
                        <div className='flex items-center gap-2'>
                            <Palette size={15} className='text-[#f5820d]' />
                            <span className='text-sm text-[#1a2b35]'>Cambiar tema</span>
                        </div>
                        {esPremium == false && <Crown size={13} className='text-[#f5820d]' />}
                    </div>
                    <div className='flex items-center justify-between p-3 rounded-xl bg-[#fffaf7] border border-[#fcd4b0]'>
                        <div className='flex items-center gap-2'>
                            <Bell size={15} className='text-[#f5820d]' />
                            <span className='text-sm text-[#1a2b35]'>Alertas de entregas</span>
                        </div>
                        {esPremium == false && <Crown size={13} className='text-[#f5820d]' />}
                    </div>
                    <div className='flex items-center justify-between p-3 rounded-xl bg-[#fffaf7] border border-[#fcd4b0]'>
                        <div className='flex items-center gap-2'>
                            <BarChart2 size={15} className='text-[#f5820d]' />
                            <span className='text-sm text-[#1a2b35]'>Análisis de tareas</span>
                        </div>
                        {esPremium == false && <Crown size={13} className='text-[#f5820d]' />}
                    </div>
                </div>
                {esPremium == false && (
                    <p className='text-xs text-[#bbb] mt-2 text-center'>
                        Estas funciones están disponibles en Premium
                    </p>
                )}
            </div>

            {/* sección upgrade (solo si no es premium) */}
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
const ModalBase = ({ onCerrar, titulo, children }) => {
    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'>
            <div className='bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl'>
                <div className='flex items-center justify-between mb-5'>
                    <h2 className='text-base font-bold text-[#1a2b35]'>{titulo}</h2>
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