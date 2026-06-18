const BASE = 'https://notes-api-backend.onrender.com'

export async function request(method, endpoint, body = null) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE}/api${endpoint}`, { 
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
    request('POST', '/login', { email, password })

//! notas
export const getTareas = () => request('GET', '/viewNota')
export const CrearTarea = (tarea) => request('POST', '/createNota', tarea)
export const actualizarTarea = (id, tarea) => request('PUT', `/updateNota/${id}`, tarea)
export const eliminarTarea = (id) => request('DELETE', `/deleteNota/${id}`)