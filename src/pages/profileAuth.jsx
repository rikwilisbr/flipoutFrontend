import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ProfileAuth() {
   const navigate = useNavigate()

   useEffect(()=>{
    try {
        axios.get(process.env.REACT_APP_APIURL+'/isAuth', {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'x-access-token': localStorage.getItem('token')
          }
        }).then(response => {
          if (response.data.message === true) {
            const user = JSON.parse(localStorage.getItem('user'))
            navigate('/profile/' + user.username )
            console.log('hey')
          } else {
            navigate('/login')
          }
        })
      } catch (error) {
      }

   },[])


  return (
    <h1>loading...</h1>
  )
}
