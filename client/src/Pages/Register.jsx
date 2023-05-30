import React,{ useState, useEffect } from 'react'
import { FormRow,Alert } from "../components";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterPage";

const initialState = {
    name: "",
    email: "",
    password: "",
    isMember: true
}
const Register = () => {
  const navigate = useNavigate();
  const [values,setValues] = useState(initialState);
  const {
    isLoading,
    showAlert,
    displayAlert,
    user,
    setupUser
  } = useAppContext();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }, [user,navigate])

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if(!email || !password || (!isMember && !name)){
      displayAlert()
      return
    }
    const currentUser = {name,email,password}
    if(isMember){
      delete currentUser.name;
      setupUser({
        currentUser,
        endPoint: 'login',
        alertText: 'Login Successful! Redirecting...'
      })
    }else{
      setupUser({
        currentUser,
        endPoint: 'register',
        alertText: 'User Created! Redirecting...'
      })
    }
  }

  return (
    <Wrapper>
    <form className='form' onSubmit={handleSubmit}>
    <h3>{values.isMember ? 'Login':'Register'}</h3>
    { showAlert && <Alert/> }
      {
        !values.isMember && 
        <FormRow 
          type='text'
          name='name'
          value={values.name}
          handleChange={handleChange}
          labelText="Name" 
        />
      }

      <FormRow 
        type='email'
        name='email'
        value={values.email}
        handleChange={handleChange}
        labelText="Email" 
      />

      <FormRow 
        type='password'
        name='password'
        value={values.password}
        handleChange={handleChange}
        labelText="Password" 
      />

      <button type='submit' className='btn btn-block' disabled={isLoading}>submit</button>
      <p>
        { values.isMember ? 'Not a member yet?': 'Already a member?' }
        <button type='button' onClick={toggleMember} className='member-btn'>
          { values.isMember ? 'Register': 'Login'}
        </button>
      </p>
    </form>
    </Wrapper>
  )
}

export default Register
