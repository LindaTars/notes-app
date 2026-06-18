import { useState } from 'react'
import Login from './components/Login'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'


function App() {
  const [isLogin, setIsLogin] = useState(true)

  const handleLoginExitoso = async (datosUsuario) => {
    setUsuarioLogueado(datosUsuario)

    //? el usuario ya está registrado en la bd?
    try {
      const respuesta = await fetch('/api/viewPerfil', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const info = await respuesta.json()

      //? si count es 0 significa que no tiene perfil (data llega como arreglo vacío)
      if (info.count > 0) {
        //? el perfil viene dentro de un arreglo, se toma el primero
        const perfil = info.data[0]
        localStorage.setItem('perfilUsuario', JSON.stringify(perfil))
        setPerfilUsuario(perfil)
      } else {
        //? no tiene perfil todavía --> mandarlo al onboarding
        localStorage.removeItem('perfilUsuario')
        setMostrarOnboaring(true)
      }
    } catch (error) {
      console.error('Error al revisar el perfil: ', error)
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