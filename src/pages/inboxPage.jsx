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
import {MoonLoader} from 'react-spinners'


export default function InboxPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [chatList, setChatList] = useState([])
  const [loading, setLoading] = useState(true)

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
      
      await Promise.all(
        myChatList.map(async (element) => {
          const myArr = [];
          await Promise.all(
            element.usersId.map(async (element2) => {
              const myUserResponse = await axios(process.env.REACT_APP_APIURL+'/api/notifications/user/'+element2, fetchConfig)
              const myUser = myUserResponse.data
              myArr.push({
                id: myUser._id,
                firstname: myUser.firstname,
                lastname: myUser.lastname,
                profilePic: myUser.profilePic,
                username: myUser.username 
              })
            })
          )

          const myData = {
          _id: element._id,
          isGroupChat: element.isGroupChat,
          usersId: element.usersId,
          users: myArr,
          lastestMessage: element.lastestMessage,
          chatName: element.chatName
          }

          setChatList(prev=>{
            return([
              ...prev,
              myData
            ])
          })
          
        })
      )

      setLoading(false)
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

  const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "2rem",
  };

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
              <MoonLoader cssOverride={override} color="#FF0000" loading={loading} />
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
