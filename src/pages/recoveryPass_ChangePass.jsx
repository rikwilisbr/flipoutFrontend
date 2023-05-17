import { useState, useEffect, useContext } from "react"
import React from 'react'
import { useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"
import { RecoveryData } from "../contexts/recoveryPassContext"

export default function RecoveryPassPage_ChangePass() {
    const [firstPass, setFirstPass] = useState()
    const [secondPass, setSecondPass] = useState()

  const { value, setValue } = useContext(RecoveryData);  
  const [formData, setFormData]= useState({ 
    password: '',
  })

  const [errorMessage, setErrorMessage] = useState()

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(()=>{
    if(value.email){
      return
    } else{
      navigate('/recovery')
    }
  },[])

  const override = {
    display: "block",
    margin: "0 auto",
    marginBottom: "1rem",
  };

  useEffect(()=>{
    fetch(process.env.REACT_APP_APIURL+'/isAuth',{
      method: 'GET',
      crossDomain: true,
      headers:{
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": localStorage.getItem("token")
      }
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.message === true){
                navigate('/home')
            } else {
                return
            }
        })
  },[])

  useEffect(()=>{
    if(value.email){
      return
    } else{
      navigate('/recovery')
    }
  },[])

  

  function submitForm(){
    if(firstPass === secondPass){
       const data_ = {
        email: value.email,
        password: formData.password
       }

       setLoading(true)
       fetch(process.env.REACT_APP_APIURL+'/register/change_password', {
           method: 'POST',
           crossDomain: true,
           headers:{
               "Content-Type": "application/json",
               Accept: "application/json",
               "Access-Control-Allow-Origin": "*",
           },
       body: JSON.stringify(data_),
       })
       .then((response) => response.json())
       .then((data) => {
           if(data.changed === true){
               navigate("/success")
               setLoading(false)
           } else {
               setErrorMessage(data.error)
               setLoading(false)
           }
       }) 
    } else {
       setErrorMessage('passwords not matching')
    }
    
 }

  return (
    <div className='container-fluid login-page'>
        <div className="row">
        <div className="col-4 side-paper">
            <img src='https://i.imgur.com/wMyGVWw.png' className="logo"/>
                <div className="text-center register-call">
                    <h2 className="welcome-side-paper">Welcome<br/> Back</h2>
                    <p className="register-call-message">Don't have a account?</p>
                    <button onClick={()=>{navigate('/register')} } className="register-button"><a href='/register'>Register Now</a></button>
                </div>
        </div>
        <div className="col-8 login-paper">
            <h1>Recover Your Account</h1>
            <p className="login-paper-p">Forgot your password? Don't worry, we can help you.</p>
            <p style={{color: 'red'}}>{errorMessage}</p>
                <div className='inputs'>
                <form className='entry-form' onSubmit={(e)=> e.preventDefault()}>
                    <div>
                        <p className="entry-pass-p">Your password:</p>
                        <input className='entry-input' type='password' placeholder='password' onChange={(e) =>{setFirstPass(e.target.value); setFormData((prev)=> { return {...prev, password: e.target.value}})} } required></input>
                    </div>
                    <div>
                        <p className="entry-pass-p">Confirm your password:</p>
                        <input className='entry-input' type='password' placeholder='password' onChange={(e) => setSecondPass(e.target.value)} required></input>
                    </div>

                    <div className="entry-btn-container">
                    <button className='entry-btn' onClick={ submitForm }>Next</button>
                    </div>
                </form>
                </div>
                <div>
                    
                </div>
                <div>
                    <PulseLoader 
                        color="#FF0000"
                        loading={loading}
                        cssOverride={override}
                    />
                    
                    
                </div>

        </div>
        </div>
    </div>
  )
}
