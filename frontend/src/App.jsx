import { useState } from 'react'
import Login from './components/Login'
import Onboarding from './components/Onboarding'


function App() {
  const [isLogin, setIsLogin] = useState(true)

  //TODO el usuario tiene ya está registrado en la bd?
  const[mostrarOnboaring, setMostrarOnboaring] = useState(false)

  //? guargar el perfil que configura el usuario
  const[perfilUsuario, setPerfilUsuario] = useState(null)

  //! ---SOLO PRUEBA--
  const[usuarioPrueba] = useState({username: 'Tester'})

  //? perfil configurado ?
  if(perfilUsuario){
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e2d2c7]">
        <div className='bg-white rounded-2xl p-10 shadow-md text-center'>
          <p className='text-[#1a2b35] font-bold text-xl mb-2'>¡Perfil creado con éxito!</p>
          <p className='text-sm text-[#999] mb-1'>Es estudiante: {perfilUsuario.esEstudiante ? 'Si':'No'}</p>
          {perfilUsuario.esEstudiante &&(
            <p className='text-sm text-[#999]'>Materias: {perfilUsuario.materias.join(',')}</p>
          )}
          <p className='text-xs text-[#bbb] mt-4'>//Dashboard proximamente</p>
          {/* NOTE: los nombres de las funciones tienen que coincidir con los useState de arriba */}
          <button
            onClick={() => {setPerfilUsuario(null); setMostrarOnboaring(false); setIsLogin(true)}}
            className='mt-5 text-xs text-[#f24b6a] hover:underline'
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  //! Mostrar onboarding
  if(mostrarOnboaring){
    return (
      <Onboarding 
        username={usuarioPrueba.username}
        setPerfilUsuario={setPerfilUsuario}
        setMostrarOnboaring={setMostrarOnboaring}
      />
    )
  }

  //! sino, mostrar login o register según el estado
  return (
    <>
      <Login login={isLogin} setLogin={setIsLogin} />
            
      {/* ---SOLO PRUEBAS--- */}
      {/* TODO: borrar esto cuando el back este listo */}
      <button
        onClick={()=> setMostrarOnboaring(true)}
        className='fixed bottom-4 right-4 bg-[#1a2b35] 
                 text-white text-xs px-4 py-2 rounded-full
                 opacity-60 hover:opacity-100 transition-all'
      >
        Ir a onboarding
      </button>
    </>

  )

}

export default App