<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// class Autcontroller extends Controller
class Autcontroller extends Controller
{

    //* Registra un cuenta de usuario 
    public function registrar(Request $request){
        //* Validacion de datos de desde afuera(react )
        $request->validate([
            'name' => ['requiered', 'string', 'max:225'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:100', 'unique:users'],
            'password' => ['required', 'string', 'min:8'] 

            
        ]);
        //* Los datos de lo anterior se mandaran al modelo para  crear el usuario en postgres
        //*Inyeccion de dependencias
        $user = User::create([
            'name' => $request->name,
            'lastname' =>$request->lastname,
            'email'=> $request->email,
            'password'=> Hash::make($request->password)//*Se encripta la contraseña 
        ]);
        //* Maneja una respuesta si se creo el usuario correctamente
        return response()->json([
            'status'=>'success',
            'message' => 'ya se creo la cuenta',
            'data' => $user
         ], 201);

    }

}
//Todo: Lo siguiente es hacer las rutas para manegar las acciones jsjsj