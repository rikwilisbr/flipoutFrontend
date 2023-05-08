import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';

//material ui icons

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SideNav from '../components/SideNav';

//components
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ThirdSide from '../components/thirdSide';
import MobileNav from '../components/mobileNav';

export default function InboxPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [chatList, setChatList] = useState([])

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

  
      const homeRes = await axios(process.env.REACT_APP_APIURL+'/home', fetchConfig)
      const myHome =  homeRes.data
      
      if (myHome) setUser(myHome)
    }
    
  const {data, error, isLoading} = useQuery(['MyPostData'], fetchData);

  useEffect(()=>{
    async function getData(){
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

      const chatListRes = await axios(process.env.REACT_APP_APIURL+'/api/chat', fetchConfig)
      const myChatList =  chatListRes.data
      
      setChatList(myChatList)
    }
    getData()
  },[])

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



  return (
    <div className='container-fluid home-area'>
      <div className='row'>
          <SideNav username={user.username} />
          
          <div className='main-section scroll col-10 col-md-8 col-lg-6'>
            <div className='messageHeader'>
                <div className='messageHeaderItemsContainer'>
                <ArrowBackIcon onClick={()=> navigate('/home')} className='back-arrow'/>
                <h1>Inbox</h1>
                </div>
                
                <div className='addButtonContainer'>
                <AddBoxOutlinedIcon onClick={()=> navigate('/inbox/new')} className='new-message'/>
                </div>
            </div>
            <div>
                {chatList.map((prop,index)=>{
                  const chatNamesArray = prop.users.map(element => element.firstname + ' ' + element.lastname)
                  const chatNames = chatNamesArray.join(', ')

                  return(
                    <div className='chatListItem' key={index} onClick={()=>navigate('/messages/'+prop._id)}>
                    {prop.isGroupChat ?
                        <div className='chatListImageContainer groupChatImage'>
                        <img src={prop.users[0].profilePic} alt='User' />
                        <img src={prop.users[1].profilePic} alt='User' />
                        </div> :
                        <div className='chatListImageContainer'>
                        <img src={prop.users[0].id != user.id ? prop.users[0].profilePic : prop.users[1].profilePic} alt='User' />
                        </div> 
                        }
                      <div className='chatListItemContainer ellipsis'>
                        <span className='chatListHeading ellipsis'>{prop.chatName ? prop.chatName : chatNames}</span>
                        <span className='chatListSubText ellipsis'>{prop.lastestMessage ? prop.lastestMessage : 'No messages yet, click to send the first message'}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
           
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
