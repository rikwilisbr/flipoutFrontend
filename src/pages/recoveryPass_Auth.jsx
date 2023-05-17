import { useState, useEffect, useContext } from "react"
import React from 'react'
import { useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"
import { RecoveryData } from "../contexts/recoveryPassContext"

function RecoveryPassPage_Auth() {
  const navigate = useNavigate()
  const {value, setValue } = useContext(RecoveryData)
  const [counter, setCounter] = useState(true)
  const [countDown, setCountDown] = useState(30)


  const [formData, setFormData]= useState({ 
    otp: '',
  })

  const [errorMessage, setErrorMessage] = useState()

  const [loading, setLoading] = useState(false)

  const { myRecoveryData, setMyRecoveryData } = useContext(RecoveryData);

  const override = {
    display: "block",
    margin: "0 auto",
    marginBottom: "1rem",
  };

  useEffect(() => {
    let intervalId; // Store the interval ID

    const decreaseCountDown = () => {
      setCountDown((prevCountDown) => prevCountDown - 1);
    };

    if (countDown === 0) {
      setCounter(false);
    } else {
      intervalId = setInterval(decreaseCountDown, 1000);
    }

    return () => {
      // Cleanup function to clear the interval
      clearInterval(intervalId);
    };
  }, [countDown]);

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
        setLoading(true)
        if (formData.otp == value.otp){
          setValue(value)
          navigate('/recovery/change_password')
        } else {
          setErrorMessage('code is not valid')
          setLoading(false)
        }
  }

  function resendEmail(){
    setCountDown(30)
    setCounter(true)
    fetch(process.env.REACT_APP_APIURL+'/api/recovery/send_email', {
      method: 'POST',
      crossDomain: true,
      headers:{
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
      },
    body: JSON.stringify(value),
    })  
    .then((response) => response.json())
    .then((data) => {
      if(data.sended === true){
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
            <img src='https://i.imgur.com/3S3tFKN.png' className="logo"/>
                <div className="text-center register-call">
                    <h2 className="welcome-side-paper">Welcome<br/> Back</h2>
                    <p className="register-call-message">Don't have a account?</p>
                    <button onClick={()=>{navigate('/register')} } className="register-button"><a href='/register'>Register Now</a></button>
                </div>
        </div>
        <div className="col-8 login-paper">
            <h1>Recover Your Account</h1>
            <p className="login-paper-p">We sended a email to: <strong>{value.email}</strong><br/> type bellow the code you received</p>
            <p style={{color: 'red'}}>{errorMessage}</p>
                <div className='inputs'>
                <form className='entry-form' onSubmit={(e)=> e.preventDefault()}>
                    <div>
                        <p className="entry-email-p">Your code:</p>
                        <input className='entry-input' type='text' placeholder='example: 1234' maxLength="4" onChange={(e) => setFormData((prev)=> { return {...prev, otp: e.target.value}})} required></input>
                    </div>
                    <div className="entry-btn-container">
                    <button className='entry-btn' onClick={ submitForm }>Next</button>
                    </div>
                </form>
                </div>
                <div style={{marginTop: '0.5rem'}}>
                    <span>Resend email? {counter ? <span style={{color: 'gray'}}>{'You need wait ' + countDown +'s to resend'}</span> :<div> <span onClick={resendEmail} className="resendEmailLink">Click here<br/></span> <span>(check in your spam section)</span></div> }</span>
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

export default RecoveryPassPage_Auth