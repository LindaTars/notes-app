import React from 'react';
import { useState } from 'react';

const Login = ( {login, setLogin} ) =>  {
    const [formData, setFormData] = useState({ email: '', password: '' });
    // const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //TODO checar endpoints
        // const endpoint = login ? 'api/login' : 'api/register';

        // try {
            //Todo checar url
        //     const r = await fetch(`https://localhost:3000/${endpoint}`, {
        //         method: 'POST', 
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(formData),
        //     })
        //     const info = await r.json()
        //     console.log("Respuesta: ", info)
        // } catch (error) {
        //     console.error("Error de comunicaición cn el back", error);
        // }

        //TODO prueba local
    //     try {
    //         const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    //             method: 'POST',
    //             body: JSON.stringify(formData),
    //             headers: { 'Content-Type': 'application/json' },
    //         });

    //         const info = await response.json();
    //         console.log("Respuesta: ", info);
            
    //     } catch (error) {
    //         console.error("Error de comunicación con el back", error);
    //     }

    const endpoint = login ? '/api/login' : '/api/registro';
    try {
        const r = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        })
        const info = await r.json()
        console.log("Respuesta: ", info)
    } catch (error) {
        console.error("Error de comunicación con el back", error)
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fef6f0]">
            <div className="flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-md shadow-orange-100">

                <div className="flex-1 bg-white p-10">
                    <h2 className="text-2xl font-bold text-[#1a2b35] mb-1">
                        {login ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                    </h2>
                    <p className="text-sm text-[#999] mb-7">
                        {login ? "Ingresa para continuar con tus notas." : "Empieza a organizar tus ideas hoy."}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="tu_correo@ejemplo.com"
                            className="p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white outline-none transition-all text-sm"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="p-3 rounded-xl border border-[#fcd4b0] bg-[#fffaf7] focus:border-[#f5820d] focus:bg-white outline-none transition-all text-sm"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="submit"
                            className="bg-[#f5820d] hover:bg-[#d96e08] text-white p-3 rounded-xl text-sm transition-all active:scale-95 mt-1"
                        >
                            {login ? "Iniciar Sesión" : "Registrarse"}
                        </button>
                    </form>

                    <p className="text-center mt-5 text-xs text-[#aaa]">
                        {login ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}
                        <button
                            onClick={() => setLogin(!login)}
                            className="ml-1 text-[#f24b6a] hover:underline"
                        >
                            {login ? "Regístrate" : "Inicia sesión"}
                        </button>
                    </p>
                </div>

                <div className="hidden lg:flex items-center justify-center w-56 bg-gradient-to-br from-[#fff2e8] via-[#fde0d0] to-[#fcd4d4]">
                    <div className="relative w-36 h-36">
                        <div className="w-36 h-36 rounded-full bg-gradient-to-b from-[#f5820d] via-[#f24b6a] to-transparent" />
                        <div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#f24b6a] rounded-full opacity-50"
                            style={{ filter: 'blur(14px)' }}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login