<?php

use App\Http\Controllers\Autcontroller;
use App\Http\Controllers\PerfilController;
use Illuminate\Support\Facades\Route;

// * Aqui se pondran las rutas para registrar un nuevo usuario
Route::post('/registro', [Autcontroller::class,'registrar']);
//* Ruta pa hacer el logeo
Route::post('/login', [Autcontroller::class,'ingresar']);
//* Ruta pa hacer un nuevo perfil 
Route::post('/newPerfil', [PerfilController::class,'crearPerfil']);
//* Metodo Get para los perfiles
Route::get('/viewPerfil', [PerfilController::class, 'mostrarPerfil']);
//* Eliminar el perfil mediante el id
Route::delete('deletePerfil/{id}', [PerfilController::class, 'eliminarPerfil']);//! Pasa por el cuerpo el body por que es una llave