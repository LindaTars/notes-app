const BASE = 'https://notes-api-backend.onrender.com/api' 

async function request(method, endpoint, body = null) {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE}${endpoint}`, { 
        method,
        headers: {
            'Content-Type':'application/json',
            ...(token && {Authorization: `Bearer ${token}`}),
        },
        ...(body && {body: JSON.stringify(body)}),
    })

    const data = await res.json()
    if(!res.ok) throw data 
    return data
}

export const login = (email, password) =>
    request('POST', '/registro', { email, password }) 

//! tareas
export const getTareas = () => request('GET', '/tareas')
export const CrearTarea = (tarea) => request('POST', '/tareas', tarea)
export const actualizarTarea = (id, tarea) => request('PUT', `/tareas/${id}`, tarea)
export const eliminarTarea = (id) => request('DELETE', `/tareas/${id}`)