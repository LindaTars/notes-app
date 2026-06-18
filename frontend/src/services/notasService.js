const API_URL = import.meta.env.VITE_API_URL

//* helper pa no repetir el header con el token en cada fetch
//* sanctum necesita el Bearer token en Authorization
const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// GET /viewNota --> trae todas las tareas del usuario logueado
export const getTareas = async () => {
    const res = await fetch(`${API_URL}/viewNota`, {
        method: 'GET',
        headers: headers()
    })
    // si el token expiró o no es válido, el back manda 401
    if (!res.ok) throw new Error('No se pudieron cargar las tareas')
    return res.json()
}

// POST /createNota --> crea una tarea nueva
// tarea = { nombreTarea, categoria, fechaInicio, fechaEntrega, materia, descripcion }
export const crearTarea = async (tarea) => {
    console.log('body que llega al servicio:', JSON.stringify(tarea))
    const res = await fetch(`${API_URL}/createNota`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(tarea)
    })
    if (!res.ok) throw new Error('No se pudo guardar la tarea')
    return res.json()
}

// DELETE /deleteNota/:id --> elimina la tarea por id
export const eliminarTarea = async (id) => {
    const res = await fetch(`${API_URL}/deleteNota/${id}`, {
        method: 'DELETE',
        headers: headers()
    })
    if (!res.ok) throw new Error('No se pudo eliminar la tarea')
    return res.json()
}

// PUT /updateNota/:id --> por ahora no lo uso en el dashboard
// pero lo dejo aquí por si después lo necesito
export const actualizarTarea = async (id, datos) => {
    const res = await fetch(`${API_URL}/updateNota/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('No se pudo actualizar la tarea')
    return res.json()
}