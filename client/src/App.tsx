import { Outlet, useNavigate } from 'react-router-dom';
import './index.css'
import { useEffect } from 'react';
import { useProductManagerStore } from './store/ProductManagerStore';
function App() {
    const error= useProductManagerStore((state)=>state.error)
    const clearError= useProductManagerStore((state)=>state.clearError)
    const navigate = useNavigate();
    useEffect(()=>{
        if(error){
            setTimeout(()=>{
                clearError()
            },3000)
        }
    },[error])
    return (
        <div className="w-full flex flex-col items-center">
            <header className="w-full text-center">
                <span
                onClick={()=>navigate("/")}
                className=" m-2 p-2 border border-black float-left cursor-pointer">Home</span>
                <h1 className="text-2xl font-bold">Mini Order System</h1>
                 
            </header>
            <div className="w-full max-w-7xl">
                <Outlet/>
            </div>
        </div>
    )
}
export default App;
