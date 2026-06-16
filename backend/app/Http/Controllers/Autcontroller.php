<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// class Autcontroller extends Controller
class Autcontroller extends Controller
{
    //! Funcion Crear Cuenta
    //* Registra un cuenta de usuario 
    public function registrar(Request $request){
        //* Validacion de datos de desde afuera(react )
        $request->validate([
            'name' => ['required', 'string', 'max:225'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:100', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
           // 'userName'=>['required', 'string', 'max:100', 'unique:users'],   //Todo: eliminar             
        ]);
        //* Los datos de lo anterior se mandaran al modelo para  crear el usuario en postgres
        //*Inyeccion de dependencias
        $user = User::create([
            'name' => $request->name,
            'lastName' =>$request->lastName,
            'email'=> $request->email,
            'password'=> Hash::make($request->password),//*Se encripta la contraseña 
           // 'userName'=> $request->userName//todo, eliminar
        ]);
        //* Maneja una respuesta si se creo el usuario correctamente
        return response()->json([
            'status'=>'success',
            'message' => 'ya se creo la cuenta',
            'data' => $user
         ], 201);
    }
    //!Funcion Iniciar secion 
    public function ingresar(Request $request){

        $request -> validate([
            'email' => ['required', 'string', 'max:100'],//Todo: cambiar por el email
            'password' => ['required', 'string', 'min:8']  
        ]);
        //* busca la existencia de algun usuario con ese nombre de usuario
        $user = User::where('email', $request->email)->first();//Todo:  cambiar a email
        //* Valida las contraseñas y que el usuairo exista 
          if (!$user || !Hash::check($request ->password, $user ->password)){
            return response()->json([
                'status'=>'error',
                'message' => 'contraseña incorrecta',
                'data' => $user
            ], 404);
         }else{
            //* Creamos el token para que funcione 
            $token = $user->createToken('cuentaToken')->plainTextToken;
            //* Respondemos que si se creo bien 

            return response()->json([
                'status'=>'success',
                'message' => 'ingreso correctamente ',
                'data' => $user,
                'token'=> $token
            ], 200);   
        }

    }
            //* Funcion para eliminar el token al cerrar secion
    public function salir(Request $request)
        {
            //* Para cerrar sesión, borramos el token actual del usuario
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'status'  => 'success',
                'message' => 'Sesión cerrada correctamente'
            ], 200);
        }
}