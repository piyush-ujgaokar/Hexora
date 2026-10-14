import { createSlice } from "@reduxjs/toolkit";


const projectSlice=createSlice({
    name:"project",
    initialState:{
        projects:[],
        currentProject:null
    },
    reducers:{
        setProjects:(state,action)=>{
            state.projects=action.payload
        },
        setCurrentProject:(state,action)=>{
            state.currentProject=action.payload
        },
        addNewProject:(state,action)=>{
            state.projects.unshift(action.payload)
        },
        starProject:(state,action)=>{
            const { project, activeSession } = action.payload
            const index = state.projects.findIndex(p=>p._id==project._id)

            if(index !== -1){
                if(activeSession == "starred" && !project.starred){
                    state.projects.splice(index,1)
                }else{
                    state.projects[index]=project
                }
            }
        },
        setDeleteProject:(state,action)=>{
            state.projects=state.projects.filter(p=>p?._id!=action.payload)
        }
    }
})

export const {setProjects,starProject,setCurrentProject,addNewProject,setDeleteProject}=projectSlice.actions
export default projectSlice.reducer