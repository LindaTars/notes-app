import { useState } from 'react'
import Login from './components/Login'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'


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
      <Dashboard
        perfilUsuario={perfilUsuario}
        username={usuarioPrueba.username}
      />
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