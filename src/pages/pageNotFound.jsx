import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';


//material ui icons
import WavesIcon from '@mui/icons-material/Waves';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SideNav from '../components/SideNav';

export default function PageNotFound() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})

  function logOut(){
    localStorage.removeItem('token')
    localStorage.removeItem('user-id')
    localStorage.removeItem('user')
    navigate('/login')
    }

  const fetchData = async () =>{
      const fetchConfig = {
        method: 'GET',
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Expose-Headers': 'user-id',
          "user-id": localStorage.getItem('user-id')
        }
      }
  
      const homeRes = await axios('http://localhost:2000/home', fetchConfig)
      const myHome =  homeRes.data
      
      if (myHome) setUser(myHome)
    }

    useEffect(() => {
      try {
        axios.get('http://localhost:2000/isAuth', {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'x-access-token': localStorage.getItem('token')
          }
        }).then(response => {
          if (response.data.message === true) {
            return
          } else {
            navigate('/login')
          }
        })
      } catch (error) {
      }
  
    }, [])
    
  const {data, error, isLoading} = useQuery(['MyPostData'], fetchData);

  return (
    <div className='container-fluid home-area'>
      <div className='row'>
        <SideNav username={user.username} />
          
          <div className='main-section scroll col-10 col-md-8 col-lg-6'>
            <div className='home-title'>
                <ArrowBackIcon onClick={()=> navigate('/home')} className='back-arrow'/>
                <h1>Page not found</h1>
            </div>
            <h3 className='text-center fw-normal'>error: 404</h3>
          </div>

          <div className='third-section d-none d-md-block col-2 col-lg-4'>
             <h1>third section</h1>
          </div>

        </div>
    </div>
  )
}
