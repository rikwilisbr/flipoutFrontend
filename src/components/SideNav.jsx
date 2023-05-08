import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';

//material ui icons
import WavesIcon from '@mui/icons-material/Waves';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MailIcon from '@mui/icons-material/Mail';


export default function SideNav(prop) {
    const navigate = useNavigate()

    function logOut(){
        localStorage.removeItem('token')
        localStorage.removeItem('user-id')
        localStorage.removeItem('user')
        navigate('/login')
    }

  return (
    <div className='nav col-2'>
            <nav>
              <a href='/'><WavesIcon sx={{color: 'red', fontSize: 50}}/></a>
              <a href='/home'><HomeIcon sx={{color: 'white'}} fontSize='large'/> Home</a>
              <a href='/search'><SearchIcon sx={{color: 'white'}} fontSize='large'/> Search</a>
              <a href='/notifications'>
              <NotificationsIcon sx={{color: 'white'}} fontSize='large'/> 
              <span className='notificationsBadge'></span> Notifications </a>
              <a href='/inbox'><MailIcon sx={{color: 'white', transform: 'scale(0.8)'}} fontSize='large'/> 
              <span className='messagesBadge'></span> Messages</a>
              <a href={'/profile/'+prop.username}><PersonIcon sx={{color: 'white'}} fontSize='large'/> Profile</a>
              <a className='logOutNav' onClick={logOut}><ExitToAppIcon sx={{color: 'white'}} fontSize='large'/> Logout</a>
            </nav>
          </div>
  )
}
