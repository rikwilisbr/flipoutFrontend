import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Register() {

  
  const [firstPass, setFirstPass] = useState()
  const [secondPass, setSecondPass] = useState()

  const [emailCheck, setEmailCheck] = useState(false)
  
  const [errorMessage, setErrorMessage] = useState()

  const [formData, setFormData]= useState({ 
    fname: '',
    lname: '',
    username: '',
    email: '',
    password: ''
    
})

  const navigate = useNavigate()
  
  function checkEmail(event){

    
    const emailInput = event.target.value

    if(emailInput.includes('@')){
       setEmailCheck(false)
    } else {
       setEmailCheck(true)
    }
  }

  function checkingPass(event){

     if(firstPass === secondPass){
        const data_ = formData;

        fetch('http://localhost:2000/register', {
          method: 'POST',
          crossDomain: true,
          headers:{
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
          },
            body: JSON.stringify(data_),
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.register === true){
                    navigate("/sucessRegister")
                } else(
                    setErrorMessage(data.error)
                )
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
                <p className="register-call-message">Already have a account?</p>
                <button onClick={()=>{navigate('/login')} } className="register-button"><a href='/login'>Login Now</a></button>
            </div>
    </div>
    <div className="col-8 register-paper text-center">
        <h1>Register to FlipOut</h1>
        <p className="login-paper-p">Create your account now!</p>
        <p style={{color: 'red'}}>{errorMessage}</p>
            <div className='inputs'>
              <form className='entry-form-register container' onSubmit={(e)=> e.preventDefault()}>
                <div className='row'>
                  <div className='col-6 register-form-1'>
                    <div>
                    <p className="entry-register-p">Your first name:</p>
                    <input className='entry-input' type='text' placeholder='first Name' name='fname' onChange={(e) => setFormData((prev)=> { return {...prev, fname: e.target.value}})} required></input>
                    </div>    

                    <div>
                    <p className="entry-register-p">Your last name:</p>
                    <input className='entry-input' type='text' placeholder='last Name' name='lname' onChange={(e) => setFormData((prev)=> { return {...prev, lname: e.target.value}})}  required></input>
                    </div>  
                    
                    <div>
                    <p className="entry-register-p">Your username:</p>
                    <input className='entry-input' type='text' placeholder='username' name='username' onChange={(e) => setFormData((prev)=> { return {...prev, username: e.target.value}})}  required></input>
                    </div>
                  </div>  
                  <div className='col-6 register-form-2'>
                    <div>
                    <p className="entry-register-p-2">Your email:</p>
                    <input className='entry-input' type='email' placeholder='email' name='email' onChange={(e) => {checkEmail(e); setFormData((prev)=> { return {...prev, email: e.target.value}})}} required></input>
                    </div>  
                    
                    <div>
                    <p className="entry-register-p-2">Your password:</p>
                    <input className='entry-input' type='password' placeholder='password' name='password' onChange={(e) => {setFirstPass(e.target.value); setFormData((prev)=> { return {...prev, password: e.target.value}})}} required></input>
                    </div>  
                    
                    <div>
                    <p className="entry-register-p-2">Confirm password:</p>
                    <input className='entry-input' type='password' placeholder='confirm password' onChange={(e) => setSecondPass(e.target.value)} required></input>
                    </div>
                  </div>
                </div>  
                  <button className='btn btn-dark entry-btn' onClick={ checkingPass } disabled={emailCheck}> Register </button>
              </form>
            </div>
    </div>
    </div>
</div>
  )
}
