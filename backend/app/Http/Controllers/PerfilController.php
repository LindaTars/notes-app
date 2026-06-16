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
            'passwordPerfil'=>['nullable', 'string', 'max:8']//! se pone el nullable por que buede o no tener contraseña 
        ]);
//* Se revisa que tipo de perfil se usa, Estudiante o Personal
        if($request->tipoPerfil === 'Estudiante'){  
             $quePerfil = [
                'rol' => $request->tipoPerfil,
                'materias'=>['tipo', 'matematicas', '', ''],//!Materias las guarda
             ];   

        }else{
            $quePerfil = [
                'rol' => $request->tipoPerfil,
                'materias'=>[],//! No mete ninguna materia
             ];   
        }
        $perfil = Perfil::create([
            'user_id' =>$request->user_id,
            'nombrePerfil'=>$request->nombrePerfil,
            // 'tipoPerfil'=>$request->tipoPerfil,
            'tipoPerfil' => $quePerfil,//! Resive el tipo de perfiil, que se analizo en el if
            'passwordPerfil' => $request->passwordPerfil ? Hash::make($request->passwordPerfil) : null
        ]);

        //* Maneja una respuesta si se creo el usuario correctamente
        return response()->json([
            'status'=>'success',
            'message' => 'Perfil creado correctamente',
            'data' => $perfil
         ], 201);
    }
    public function nuevasMaterias($id, Request $request){
        $request->validate([
            'materia'=>['required', 'string', 'max:50']
        ]);
        $perfil =Perfil::find($id);
        //* Si no existe el perfil se manda un error
        if (!$perfil){
            return response()->json([
                'status'=> 'error',
                'message'=>'al parecer no existe ese perfil'
            ]);
        }
        //* Sacamos el tipo de perfil de la funcion para crear el perfil
        $elPerfil = $perfil->tipoPerfil;
        if (!isset($elPerfil['materias'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Este tipo de perfil no puede registrar materias'
            ], 400);
        }
        //* Sacamos las materias que ya existen 
        $materiasExistentes= $elPerfil['materias'];

        $materiasExistentes = array_values(array_filter($materiasExistentes));
        //* se valida que no se repitan las materias
        if (in_array($request->materia, $materiasExistentes)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Esta materia ya se encuentra registrada'
            ], 422);    
        }
        //* Se guardan las nuevas materias 
        $materiasExistentes[]=$request->materia;
        //* Reasignamos el arreglo actualizado al objeto del perfil
        $datosPerfil['materias'] = $materiasExistentes;
        $perfil->tipoPerfil = $datosPerfil;
        //*se guarda todo
        $perfil->save();
        return response()->json([
            'status'=> 'OK',
            'message'=> 'Se agrego al tarea',
            'data'=>  $perfil
        ]);
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
    public function eliminarPerfil ($iidd){//! Se recibe lo que llega desde el body 

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


    //? Funcion para edtar el perfil 
    public function editarPerfil($id, Request $request){
        //* Validamos los datos 
        $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],  
            'nombrePerfil'=>['nullable', 'string', 'max:50'],
            'tipoPerfil'=>['nullable', 'string'],
            'passwordPerfil'=>['nullable', 'string', 'max:8']
        ]);
        //* Se busca el perfil por medio de id
        $buscar = Perfil::find($id);
        //* Validamos el 
        if(! $buscar){
            return response()->json([
                'status'=>'no se encuentra ese id',
                'message'=>'el perfil no se encuentra'
            ],404);

        }
        //* Se revisa que datos se cambiaran y pues los cambia
        //TODO: hace falta resolver el problema de los cambios
        $buscar->user_id = $request->user_id;
        $buscar->nombrePerfil = $request->nombrePerfil;
        $buscar->tipoPerfil = $request->tipoPerfil;
        //* se valida la contraseña a camniar 
        if($request->filled('passwordPerfil')){
            $buscar->passwordPerfil = Hash::make($request->passwordPerfil);
        }
        //* se Actualizan los cambios de lo que ya se valido 
        $buscar->save();
  
        //* se Manda una respuesta de ser correcto 
        return response()->json([
            'status'=>'succes',
            'message'=>'Cambios correctos al perfil',
            'data'=> $buscar
        ],200);
    }

}
