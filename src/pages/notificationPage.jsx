import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//material ui icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneAllIcon from '@mui/icons-material/DoneAll';

//components
import SideNav from '../components/SideNav';
import ThirdSide from '../components/thirdSide';
import MobileNav from '../components/mobileNav';

export default function NotificationPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [notifications, setNotifications] = useState([])

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

    const isFirstRender = useRef(true)
    useEffect(()=>{
      if(isFirstRender){
        isFirstRender.current = false

        async function getNotifications(){
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
    
          const notificationsListRes = await axios(process.env.REACT_APP_APIURL+'/api/notifications/'+myHome.id,  fetchConfig)
          const myNotificationsList = notificationsListRes.data
          
          myNotificationsList.forEach(async (element)=>{
            const currentUserRes = await axios(process.env.REACT_APP_APIURL+'/api/notifications/user/'+element.userFrom, fetchConfig)
            const currentUser = currentUserRes.data
            if(element.notificationsType != 'followed'){
              const currentPostRes = await axios(process.env.REACT_APP_APIURL+'/api/notifications/post/'+element.entityId, fetchConfig)
              const currentPost = currentPostRes.data
              setNotifications(prev=>{
                return([
                  ...prev,
                  {
                    profilePic: currentUser.profilePic,
                    firstName: currentUser.firstname,
                    lastname: currentUser.lastname,
                    username: currentUser.username,
                    id: currentUser._id,
                    postContent: currentPost.content,
                    postId: element.entityId,
                    notifyType: element.notificationsType,
                    opened: element.opened,
                    isFollow: false
                  }
                ])
              })
            } else {
              setNotifications(prev=>{
                return([
                  ...prev,
                  {
                    profilePic: currentUser.profilePic,
                    firstName: currentUser.firstname,
                    lastname: currentUser.lastname,
                    username: currentUser.username,
                    id: currentUser._id,
                    notifyType: element.notificationsType,
                    opened: element.opened,
                    isFollow: true
                  }
                ])
              })
            }

          
          })

        }
        getNotifications()
      }
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

  async function markAsOpened(){
    const fetchConfig = {
      method: 'PUT',
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Expose-Headers': 'user-id',
        "user-id": localStorage.getItem('user-id')
      }
    }

    await axios.put(process.env.REACT_APP_APIURL+'/api/notifications/'+user.id+'/markAsOpened', fetchConfig).then((response)=>{
      if(response.status){
        window.location.reload()
      } else {
        return
      }
    })
    
  }  
    
  const {data, error, isLoading} = useQuery(['MyPostData'], fetchData);

  return (
    <div className='container-fluid home-area'>
      <div className='row'>
        <SideNav username={user.username} />
          
          <div className='main-section scroll col-10 col-md-8 col-lg-6'>
            <div className='messageHeader'>
              <div className='messageHeaderItemsContainer'>
                <ArrowBackIcon onClick={()=> navigate('/home')} className='back-arrow'/>
                <h1>Notifications</h1>
              </div>

              <div className='addButtonContainer'>
                <DoneAllIcon onClick={markAsOpened} className='markAsOpenedButton' />
              </div>
                
            </div>
            <div className='notifyArea'>
              {notifications.map((prop, index)=>{
                return(
                  <div>
                  
                  {prop.isFollow ?

                    <div onClick={()=>navigate('/profile/'+prop.username)} key={index} className={prop.opened ? 'notifyListItem' :'notifyListItem active'}>
                    <div  className='notifyListImageContainer'>
                      <img src={prop.profilePic} alt='UserProfilePic'></img>
                    </div>

                    <div className='notifyListItemContainer'>
                      <span>
                        <span className='notifyListHeadingUsername'>{prop.username}</span>
                        <span className='notifyListHeadingMessage'>{prop.notifyType + ' you'}</span>
                      </span>
                    </div>
                  </div> 
                  
                  :

                  <div onClick={()=>navigate('/posts/'+prop.postId)} key={index} className={prop.opened ? 'notifyListItem ' :'notifyListItem active'}>
                    <div  className='notifyListImageContainer'>
                      <img src={prop.profilePic} alt='UserProfilePic'></img>
                    </div>

                    <div className='notifyListItemContainer'>
                      <span>
                        <span className='notifyListHeadingUsername'>{prop.username}</span>
                        <span className='notifyListHeadingMessage'>{prop.notifyType + ' your post'}</span>
                      </span>
                      <span className='notifyListSubText ellipsis'>{prop.postContent}</span>
                    </div>
                  </div>
                  }
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
