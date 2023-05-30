import React, { useContext, useReducer } from "react";
import reducer from "./reducers";
import { 
    CLEAR_ALERT, 
    DISPLAY_ALERT, 
    REGISTER_USER_BEGIN, 
    REGISTER_USER_SUCCESSS, 
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESSS,
    LOGIN_USER_ERROR,
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESSS,
    SETUP_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER, 
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESSS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESSS,
    CREATE_JOB_ERROR,
    GET_JOB_BEGIN,
    GET_JOB_SUCCESSS,
    SETUP_EDIT_JOB,
    DELETE_JOB_BEGIN,
    DELETE_JOB_ERROR,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESSS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE
} from "./actions";
import axios from "axios";

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
    isLoading:false,
    showAlert:false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobTypeOptions: ['full-time','part-time','remote','internship'],
    jobType: 'full-time',
    statusOptions: ['interview','declined','pending'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest','oldest','a-z','z-a']
}

const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialState);
    // axios.defaults.headers['Authorization'] = `Bearer ${state.token}`

    const authFetch = axios.create({
        baseURL: '/app/v1'
    })

    authFetch.interceptors.request.use((config) =>{
        config.headers['Authorization'] = `Bearer ${state.token}`
        return config
    },
    (error) => {
        return Promise.reject(error)
    })

    authFetch.interceptors.response.use((response) => {
        return response
    },
    (error) => {
        console.log(error.response);
        if (error.response.status === 401) {
            console.log('AUTH ERROR');
        }
    })

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({
                type: CLEAR_ALERT
            })
        }, 3000)
    }

    const displayAlert = () => {
        dispatch({ type:DISPLAY_ALERT })
        clearAlert()
    }

    const addUserToLocalStorage = ({ user,token,location }) => {
        localStorage.setItem('user',JSON.stringify(user))
        localStorage.setItem('token',token)
        localStorage.setItem('location',location)
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    const registerUser = async (currentUser) => {
        dispatch({ type:REGISTER_USER_BEGIN })
        try {
            const response = await axios.post('/app/v1/auth/register',currentUser);
            console.log(response);
            const { user, token, location } = response.data;
            dispatch({
                type: REGISTER_USER_SUCCESSS,
                payload: {
                    user,
                    token,
                    location
                }
            })
            addUserToLocalStorage({ user,token,location })
        } catch (error) {
            console.log(error.response);
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }

    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            console.log(currentUser);
            const {data} = await axios.post('/app/v1/auth/login', currentUser);
            // console.log(response);
            const { user, token, location } = data;
            dispatch({
                type: LOGIN_USER_SUCCESSS,
                payload: { user, token, location }
            })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            console.log(error.response);
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }

    const setupUser = async ({currentUser,endPoint,alertText}) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const {data} = await axios.post(`/app/v1/auth/${endPoint}`, currentUser);
            // console.log(response);
            const { user, token, location } = data;
            dispatch({
                type: SETUP_USER_SUCCESSS,
                payload: { user, token, location, alertText }
            })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            console.log(error.response);
            dispatch({
                type: SETUP_USER_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
          // axios.defaults.headers['Authorization'] = `Bearer ${state.token}`
          const { data } = await authFetch.patch('/auth/updateUser', currentUser)
          const { user, location, token } = data

          dispatch({
            type: UPDATE_USER_SUCCESSS,
            payload: { user, location, token }
          })

          addUserToLocalStorage({ user, location, token })
        } catch (error) {
          dispatch({
            type: UPDATE_USER_ERROR,
            payload: { msg: error.response.data.msg }
          }) 
        }
        clearAlert();
    }

    const handleChange = ({ name, value }) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: { name, value }
        })
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status, token } = state
            await authFetch.post('/jobs',{
                company,
                position,
                jobLocation,
                jobType,
                status
            })
            dispatch({
                type: CREATE_JOB_SUCCESSS
            })

            dispatch({
                type: CLEAR_VALUES
            })
        } catch (e) {
            if(e.response.status === 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: e.response.data.msg }
            })  
        }
        clearAlert()
    }

    const getJobs = async () => {
        const { page, search, searchStatus, searchType, sort } = state
        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if (search) {
            url = url + `&search=${search}`
        }
        dispatch({ type: GET_JOB_BEGIN })
        try {
            const { data } = await authFetch(url)
            const { jobs, totalJobs, numOfPages } = data
            dispatch({
                type: GET_JOB_SUCCESSS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages
                }
            })
        } catch (error) {
           logoutUser() 
        }
        clearAlert()
    }

    const setEditJob = (id) => {
        console.log(`set edit job : ${id}`);
        dispatch({ type: SETUP_EDIT_JOB, payload: { id } })
    }

    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN })
        const { position, company, jobLocation, jobType, status } = state
        try {
            await authFetch.patch(`/jobs/${state.editJobId}`,{
                position,
                company,
                jobLocation,
                jobType,
                status
            })
            dispatch({ type: EDIT_JOB_SUCCESSS })
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if(error.response === 401) return
            dispatch({ 
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg } 
            })
        }
        clearAlert()
    }

    const deleteJob = async (id) => {
        dispatch({ type: DELETE_JOB_BEGIN })
        try {
          await authFetch.delete(`/jobs/${id}`) 
          getJobs() 
        } catch (error) {
            if (error.response.status === 401) return;
            dispatch({
                type: DELETE_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            });
            logoutUser();
        }
        clearAlert()
    };

    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications
                }                
            })
        } catch (error) {
            logoutUser();
        }
        clearAlert()
    }

    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS })       
    }

    const changePage = (page) => {
        dispatch({ type: CHANGE_PAGE, payload: { page } })
    }
    // useEffect(() => {
    //     getJobs()
    // }, [])
    return (
       <AppContext.Provider value={{ 
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage 
    }} >{children}</AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export {AppProvider, initialState, useAppContext};