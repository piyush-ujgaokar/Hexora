import dotenv from "dotenv"
dotenv.config()
import axios from "axios"



const File_url=process.env.FILE_SERVICE_URL

export const createFolder=async({projectId,parentId,name,userId})=>{
    try {

       const data= await axios.post(`${File_url}/file/create-folder`,{
            projectId,parentId,name
        },{
            headers:{
                "x-user-id":String(userId)
            }
        })

        return data


    } catch (error) {
        throw new Error(error)
        
    }
}


export const createFile=async({projectId,name,parentId,content = "",language = "plaintext",userId})=>{

    try {

       const response= await axios.post(`${File_url}/file/create-file`,{
            projectId,parentId,name,content,language
        },{
            headers:{
                "x-user-id":String(userId)
            }
        })

        return response.data


    } catch (error) {
        throw new Error(error)
        
    }
}


export const updateFile=async({name, content="", userId, id})=>{

    try {

       const data= await axios.post(`${File_url}/file/update/${id}`,
        {name,content},
        {headers:{
                "x-user-id":String(userId)
            }
        }
        )

        return data
    } catch (error) {
        throw new Error(error)
        
    }
}


export const deleteFile=async({userId, id})=>{

    try {

       const data= await axios.delete(`${File_url}/file/${id}`,
        {headers:{
                "x-user-id":String(userId)
            }
        }
        )

        return data
    } catch (error) {
        throw new Error(error)
        
    }
}


export const getTree=async({userId, projectId})=>{

    try {

       const response= await axios.get(`${File_url}/file/tree/${projectId}`,
        {headers:{
                "x-user-id":String(userId)
            }
        }
        )

         console.log("Tree API response:", response.data);


        return response.data
    } catch (error) {
        throw new Error(error)
        
    }
}


export const getFile=async({userId, id})=>{

    try {

       const data= await axios.get(`${File_url}/file/${id}`,
        {headers:{
                "x-user-id":String(userId)
            }
        }
        )

        return data
    } catch (error) {
        throw new Error(error)
        
    }
}