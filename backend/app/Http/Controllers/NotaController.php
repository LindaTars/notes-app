<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nota;

class NotaController extends Controller
{
    public function crearNota (Request $request){
        $request -> validate([
            'user_id' =>['required', 'integer', 'exists:users,id'],
            'nombreTarea' =>['required', 'string', 'max:50'], 
            'categoria'=>['required', 'string', 'max:20'],
            'Descripcion'=>['required', 'string', 'max:100'],
            'materia'=>['nullable', 'string', 'max:50'],
            'fechaEntrega'=>['nullable', 'date' ],
            'fechaInicio'=>['nullable', 'date']
        ]);
        $nota = Nota::create([
            'user_id'=>$request->user_id,
            'nombreTarea' =>$request->nombreTarea,
            'categoria'=>$request->categoria,
            'Descripcion'=>$request->Descripcion,
            'materia'=>  $request->materia ? ($request->materia): null ,
            'fechaEntrega'=>$request->fechaEntrega ? ($request->fechaEntrega): null,
             'fechaInicio'=>$request->fechaInicio ? ($request-> fechaInicio): null,
        ]);
        return response() -> json([
            'status'=>'en efecto si se creo',
            'message'=>'se creo la tarea',
            'data'=>  $nota
        ], 200);

    }
    public function eliminarTarea ($id ){
        $buscar =Nota::find($id);
        if(! $buscar){
            return response()->json([
                'status'=>'error',
                'message'=>'No se encontro la tarea',
            ],401);
        }else{
            $buscar->delete();
            return response()->json([
                'status'=>'bien',
                'message'=>'se elimino la tarea',
                'data'=> $buscar
            ], 201);
        }
    }
    public function mostrarTareas (Request $request){
        $nota = Nota::with('user')->get();
       // $perfiles = Perfil::with('user')->get();
        return response()->json([
             'status'=> 'bien',
            'count'=> $nota->count(),
            'data'=> $nota
        ]);
    }
    public function actualizarNota ($id,Request $request){
        $request->validate([
            'user_id' =>['required', 'integer', 'exists:users,id'],
            'nombreTarea' =>['nullable', 'string', 'max:50'], 
            'categoria'=>['nullable', 'string', 'max:20'],
            'Descripcion'=>['nullable', 'string', 'max:100'],
            'materia'=>['nullable', 'string', 'max:50'],
            'fechaEntrega'=>['nullable', 'date' ],
            'fechaInicio'=>['nullable', 'date']
        ]);
        $buscar  =Nota::find($id);

        if(! $buscar){
            return response()->json([
            'status'=>'no se encuentra ese id',
            'message'=>'la nota no se encuentra'
        ],404);
        }
        $buscar->user_id = $request->user_id;
        $buscar-> nombreTarea = $request->nombreTarea;
        $buscar->categoria = $request->categoria;
        $buscar->Descripcion = $request->Descripcion;
        $buscar-> materia= $request->materia;
        $buscar->fechaEntrega = $request->fechaEntrega;
        $buscar-> fechaInicio= $request->fechaInicio;

        $buscar->save();

        //* se Manda una respuesta de ser correcto 
        return response()->json([
            'status'=>'succes',
            'message'=>'Cambios correctos a la tarea',
            'data'=> $buscar
        ],200);
    } 
    

}
