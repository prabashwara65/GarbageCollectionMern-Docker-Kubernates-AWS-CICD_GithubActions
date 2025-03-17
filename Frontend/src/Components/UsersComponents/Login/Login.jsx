import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../ReduxTool/userSlice';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/login', { email, password })
            .then(res => {
                if (res.data.Status === "Success") {
                    dispatch(setUser({
                        name: res.data.name,
                        email: res.data.email,
                        role: res.data.role,
                        loggedIn: res.data.loggedIn,
                        userId: res.data.userId
                    }));

                    if (res.data.role === "admin") {
                        navigate('/adminDashboard');
                    } else {
                        const intendedPath = location.state?.from?.pathname || '/';
                        navigate(intendedPath);
                    }
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>

                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Email" 
                            id="email" 
                            required 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="relative">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            id="pass" 
                            required 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={(e) => setPass(e.target.value)} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <p className="text-gray-500">
                            Don't Have an Account? 
                            <Link to="/register" className="text-indigo-600 hover:underline"> Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
