<?php

use App\Http\Controllers\Autcontroller;

use App\Http\Controllers\NotaController;
use App\Http\Controllers\PerfilController;
use Illuminate\Support\Facades\Route;

// * Aqui se pondran las rutas para registrar un nuevo usuario
Route::post('/registro', [Autcontroller::class,'registrar']);//! Funciona
//* Ruta pa hacer el logeo
Route::post('/login', [Autcontroller::class,'ingresar']);//! Funciona
//? este pedaso solo permite ejecutar las rutsa dentro del cuadro, revisa que se venga con token 
Route::middleware('auth:sanctum')->group(function () {//! guarda todo se hacen privadas
    //* Ruta pa salir de la secsion 
    Route::post('/logout', [Autcontroller::class, 'salir']);
        
    //* Ruta pa hacer un nuevo perfil 
    Route::post('/newPerfil', [PerfilController::class,'crearPerfil']);//! funciona
    //* Metodo Get para los perfiles
    Route::get('/viewPerfil', [PerfilController::class, 'mostrarPerfil']);//! Funciona
    //* Eliminar el perfil mediante el id
    Route::delete('/deletePerfil/{id}', [PerfilController::class, 'eliminarPerfil']);//! Pasa por el cuerpo el body por que es una llave
    //* Editar perfil mediante id
    Route::put('/updatePerfil/{id}', [PerfilController::class, 'editarPerfil']);//Todo: falta hacer funcionar esta funcion
    //* Nueva materia a agregar, usa id
    Route::patch('/newPerfil/{id}/newMateria', [PerfilController::class, 'nuevasMaterias']);
    //* Ruta para crear tareas
    Route::post('/createNota', [NotaController::class, 'crearNota']);//! Funciona
    //* Ruta para eliminar tarea
    Route::delete('/deleteNota/{id}', [NotaController::class, 'eliminarTarea']);//! ya es funcional
    //* Ruta para mostrar todas las tareas
    Route::get('/viewNota', [NotaController::class, 'mostrarTareas']);
    //* Actualizar Nota 
    Route::put('/updateNota/{id}', [NotaController::class, 'actualizarNota']);
});