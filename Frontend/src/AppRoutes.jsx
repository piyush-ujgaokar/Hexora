import {createBrowserRouter, RouterProvider} from "react-router"
import DashBoard from "./pages/DashBoard";
import { useEffect } from "react";
import { me } from "./features/api/me";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import ProjectPage from "./pages/ProjectPage";

const AppRoutes = () => {

    const dispatch=useDispatch()
    useEffect(()=>{
        const fetch=async()=>{
            const data= await me()
            dispatch(setUserData(data))
        }
        fetch()
    },[dispatch])


    const router=createBrowserRouter([
        {
            path:"/",
            element:<DashBoard />
        },
        {
            path:"/project/:id",
            element:<ProjectPage/>
        }
    ])



  return <RouterProvider router={router}/>
}

export default AppRoutes;
