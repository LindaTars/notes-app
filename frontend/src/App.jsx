import { useState } from 'react'
import Login from './components/Login'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'


function App() {
  const [isLogin, setIsLogin] = useState(true)

  const handleLoginExitoso = (datosUsuario) => {
    setUsuarioLogueado(datosUsuario)

    const perfilGuardado = localStorage.getItem('perfilUsuario')
    if (perfilGuardado) {
      setPerfilUsuario(JSON.parse(perfilGuardado))
    } else {
      setMostrarOnboaring(true)
    }
  }

  //TODO el usuario tiene ya está registrado en la bd?
  const[mostrarOnboaring, setMostrarOnboaring] = useState(false)

  //? guargar el perfil que configura el usuario
  const[perfilUsuario, setPerfilUsuario] = useState(() => {
    const guardado = localStorage.getItem('perfilUsuario')
    return guardado ? JSON.parse(guardado) : null
  })

  //! usuario real
  const [usuarioLogueado, setUsuarioLogueado] = useState(() =>{
    const guardando = localStorage.getItem('usuario')
    return guardando ? JSON.parse(guardando) : null
  })

  //! ---SOLO PRUEBA--
  const[usuarioPrueba] = useState({username: 'Tester'})

  //? perfil configurado Y sigue logueado?
  //! antes esto se mostraba aunque ya no hubiera token, por eso "cerrar sesión" no servía
  if(perfilUsuario && usuarioLogueado){
    return (
      <Dashboard
        perfilUsuario={perfilUsuario}
        username={usuarioLogueado.name}
      />
    )
  }

  //! Mostrar onboarding
  if(mostrarOnboaring){
    return (
      <Onboarding 
        username={usuarioLogueado ? usuarioLogueado.name : usuarioPrueba.username}
        setPerfilUsuario={setPerfilUsuario}
        setMostrarOnboaring={setMostrarOnboaring}
      />
    )
  }

  //! sino, mostrar login o register según el estado
  return (
    <>
      <Login login={isLogin} setLogin={setIsLogin} onLoginExitoso={handleLoginExitoso} />
            
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