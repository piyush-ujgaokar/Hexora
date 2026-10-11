import {createBrowserRouter, RouterProvider} from "react-router"
import DashBoard from "./pages/DashBoard";
const AppRoutes = () => {

    const router=createBrowserRouter([
        {
            path:"/",
            element:<DashBoard />
        }
    ])



  return <RouterProvider router={router}/>
}

export default AppRoutes;
