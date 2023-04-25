import { useState, useEffect } from "react"
import React from 'react'
import { useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"

export default function Login() {

  const [formData, setFormData]= useState({ 
    email: '',
    password: ''
  })

  const [errorMessage, setErrorMessage] = useState()

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const override = {
    display: "block",
    margin: "0 auto",
    marginBottom: "1rem",
  };

  useEffect(()=>{
    fetch('http://localhost:2000/isAuth',{
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

  function submitForm(){
        const data_ = formData
   
        fetch('http://localhost:2000/login', {
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
            if(data.login === true){
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                localStorage.setItem('user-id', data.user.id)
                setTimeout(() => {
                    navigate("/home")
                }, 3000)

                setLoading(true)
            } else(
                setErrorMessage(data.error)
            )
        })

        
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
        <div className="col-8 login-paper text-center">
            <h1>Login to FlipOut</h1>
            <p className="login-paper-p">Access your account right now!</p>
            <p style={{color: 'red'}}>{errorMessage}</p>
                <div className='inputs'>
                <form className='entry-form' onSubmit={(e)=> e.preventDefault()}>
                    <div>
                        <p className="entry-email-p">Your email:</p>
                        <input className='entry-input' type='email' placeholder='example@email.com' onChange={(e) => setFormData((prev)=> { return {...prev, email: e.target.value}})} required></input>
                    </div>
                    <div>
                        <p className="entry-pass-p">Your password:</p>
                        <input className='entry-input' type='password' placeholder='password' onChange={(e) => setFormData((prev)=> { return {...prev, password: e.target.value}})} required></input>
                    </div>
                    <label></label>
                    <button className='entry-btn' onClick={ submitForm } >Login</button>
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
                    <a href='/recover'>Forgot password?</a>
                </div>

        </div>
        </div>
    </div>
  )
}
