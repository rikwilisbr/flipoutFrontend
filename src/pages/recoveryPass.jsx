import { useState, useEffect, useContext } from "react"
import React from 'react'
import { useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"
import { RecoveryData } from "../contexts/recoveryPassContext"

export default function RecoveryPassPage() {

  const { value, setValue } = useContext(RecoveryData);  
  const [formData, setFormData]= useState({ 
    email: '',
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

  function submitForm(){
        const data_ = {
            email: formData.email,
            otp: Math.floor(Math.random() * 8999 + 1000)
        }
        
        setLoading(true)
        fetch(process.env.REACT_APP_APIURL+'/api/recovery/send_email', {
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
            if(data.sended === true){
                setValue({email: data_.email, otp: data_.otp})
                navigate("/recovery/auth")
                setLoading(false)
            } else {
                setErrorMessage(data.error)
                setLoading(false)
            }
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
        <div className="col-8 login-paper">
            <h1>Recover Your Account</h1>
            <p className="login-paper-p">Forgot your password? Don't worry, we can help you.</p>
            <p style={{color: 'red'}}>{errorMessage}</p>
                <div className='inputs'>
                <form className='entry-form' onSubmit={(e)=> e.preventDefault()}>
                    <div>
                        <p className="entry-email-p">Your email:</p>
                        <input className='entry-input' type='email' placeholder='example@email.com' onChange={(e) => setFormData((prev)=> { return {...prev, email: e.target.value}})} required></input>
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
