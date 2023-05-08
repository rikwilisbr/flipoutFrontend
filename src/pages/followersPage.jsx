import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//components
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SideNav from '../components/SideNav';
import ThirdSide from '../components/thirdSide';
import MobileNav from '../components/mobileNav';


//material ui icons
import WavesIcon from '@mui/icons-material/Waves';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { TextareaAutosize } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

function FollowersPage() {
  const { username } = useParams()

  const navigate = useNavigate()

  const [user, setUser] = useState({})

  const [ids, setIds] = useState([])

  const [followersData, setFollowersData]= useState([])

  const [tabValue, setTabValue] = useState('followers')


  async function tabChange(event, newValue){
      navigate('/profile/'+username+'/'+newValue)
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

    const followersid = await axios(process.env.REACT_APP_APIURL+'/api/followers/ids/'+username, fetchConfig)
    const myFollowersId =  followersid.data
    fetch(process.env.REACT_APP_APIURL+'/api/followers/data/'+username,{
      method: 'GET',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Expose-Headers': 'user-id',
        "ids": JSON.stringify(myFollowersId)
      },
    })
    .then((response) => response.json())
    .then((data) => {
      setFollowersData(data)
    })
    
    if (myFollowersId) setIds(myFollowersId)

    const homeRes = await axios(process.env.REACT_APP_APIURL+'/home', fetchConfig)
    const myHome =  homeRes.data
    
    if (myHome) setUser(myHome)
  } 

  const {data, error, isLoading} = useQuery(['MyData'], fetchData);
  
  useEffect(() => {
    try {
      axios.get(process.env.REACT_APP_APIURL+'/isAuth', {
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

  function logOut(){
    localStorage.removeItem('token')
    localStorage.removeItem('user-id')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className='container-fluid home-area'>
      <div className='row'>
        <SideNav username={user.username} />

          <div className='main-section scroll col-10 col-md-8 col-lg-6'>
            <div className='home-title'>
                <ArrowBackIcon onClick={()=> navigate('/profile/'+username)} className='back-arrow'/>
                <h1>{username}</h1>
            </div>
            <div className='tabsContainer followTabs'>
                  <Tabs
                      value={tabValue}
                      onChange={tabChange}
                      variant='fullWidth'
                      TabIndicatorProps={{style: {background:'#EB5353'}}}
                      centered
                      >
                      <Tab value="following" className='tabText' label="following" />
                      <Tab value="followers" className='tabText' label="followers" />
                  </Tabs>
                  </div>
                  {followersData.map((prop,index)=>{
                    return(
                      <div key={index} className='resultsContainer'>
                        <div className='followProfile'>
                          <div></div> 
                          <div className='profilePicPOST'>
                            <img src={prop.profilePic} alt='user profile pic' />
                          </div>
                          <div className='postHeader followPostHeader'>
                            <a onClick={e => e.stopPropagation()} href={'/profile/'+prop.username}>{prop.firstname + ' ' + prop.lastname}</a>
                            <span className='username'>{'@'+prop.username}</span>
                          </div>
                          <div className='followPageContainer'>
                            <button onClick={() => navigate('/profile/'+prop.username)} className='followPageButton'>Visit Profile</button>
                          </div>
                        </div>
                     </div>
                    )
                  })}
                  
          </div>

          <div className='third-section d-none d-md-block col-2 col-lg-4'>
              <ThirdSide userId={user.id}/>
          </div>
      </div>
      <div className='row'>
            <MobileNav username={user.username} />
      </div>
    </div>
  )
}

export default FollowersPage