<?php

namespace App\Http\Controllers;

use App\Models\Perfil;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class PerfilController extends Controller
{
    //* Primero se cre ala funcin para crear usuarios CrearPerfil
     public function crearPerfil (Request $request){
        //*Validamos los datos a recibir 
        $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],  
            'nombrePerfil'=>['required', 'string', 'max:50'],
            'tipoPerfil'=>['required', 'string'],
            'passwordPerfil'=>['nullable', 'string', 'max:8']//! se pone el nullable por que buede o no tenr contraseña 
        ]);

        $perfil = Perfil::create([
            'user_id' =>$request->user_id,
            'nombrePerfil'=>$request->nombrePerfil,
            'tipoPerfil'=>$request->tipoPerfil,
            'passwordPerfil' => $request->passwordPerfil ? Hash::make($request->passwordPerfil) : null
        ]);
        //* Maneja una respuesta si se creo el usuario correctamente
        return response()->json([
            'status'=>'success',
            'message' => 'Perfil creado correctamente',
            'data' => $perfil
         ], 201);
    }
    public function mostrarPerfil (Request $request){
        //* Se sacan los datos de la tabla perfil 
        $perfiles = Perfil::with('user')->get();

        return response()->json([
            'status' => 'success', //* Responde qu ela respuesta es correcta 
            'count'=> $perfiles->count(),//*Permite contar los perfiles 
            'data'=> $perfiles //* Muestra los perfiles
        ]);
    }
    public function eliminarPerfil ($id){//! Se recibe lo que llega desde el body 
    //! ya no se valida nada que llege en json
        //Validar Parametros para eliminar el perfil
        // $request->validate([
          // 'user_id' => ['required', 'integer', 'exists:users,id'], 
        //     'perfil_id' =>['required', 'integer', 'exists:perfiles,id'],
         //'passwordPerfil'=>['nullable', 'string', 'max:8']
        // ]);
        $buscar =Perfil::find($id);//! se revisa que exista ese id qu ellega del body
       
        if(! $buscar ){
            return response()->json([
                'status'=>'tas mal',
                'message'=>'El perfil no existe',
            ], 401);
        }else{

             $buscar ->delete();
            return response()->json([
                'status'=>'tas bien ',
                'message'=>'El perfil si existe, bueno existia jsjsjsj',
                'data' => $buscar
        ], 201);
        }
        
    }
}
