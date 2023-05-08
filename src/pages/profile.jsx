import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//components
import ProfileEntryPost from '../components/ProfileEntryPost';
import ProfileReplyEntryPost from '../components/profileReplyEntryPost';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import SideNav from '../components/SideNav';
import ThirdSide from '../components/thirdSide';

//material ui icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


export default function Post() {
  const { username } = useParams()

    const navigate = useNavigate()

    const [user, setUser] = useState({})

    const [currentUser, setCurrentUser] = useState({})

    const [isLiked, setIsLiked]= useState({})

    const [isReposted, setIsReposted] = useState({})

    const [isRepostedMessage, setIsRepostedMessage] = useState({})
    
    const [isDelete, setIsDelete] = useState({})

    const [tabValue, setTabValue] = useState('post')

    const [tabBoolean, setTabBoolean] = useState(true)
    
    const [posts, setPosts] = useState([])

    const [isloggedUser, setIsLoggedUser] = useState(false)

    const [isFollowing, setIsFollowing] = useState(false)

    const [followersLen, setFollowersLen] = useState(0)

    const [followingLen, setFollowingLen] = useState(0)

    const [uploadProfilePic, setUploadProfilePic] = useState('')

    const [cropper, setCropper] = useState()

    const [cropper2, setCropper2] = useState()

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
        console.log(error)
      }
  
    }, [])

    function getIsFollowing(){
      if(user.following && user.following.includes(currentUser.id)){
        setIsFollowing(true)
      } else {
        setIsFollowing(false)
      }
    }

    function getFollowLen(){
      if(currentUser.followers){
        const len = currentUser.followers
        setFollowersLen(len.length)
      }
      if(currentUser.following){
        const len = currentUser.following
        setFollowingLen(len.length)
      
    }
  }

    async function follow(){
      const myId = localStorage.getItem('user-id')
      await axios.put('http://localhost:2000/api/followers/profile/'+username+'/'+myId, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'user-id',
          'user-id': localStorage.getItem('user-id')
        }
      })
      
  
       await axios.put('http://localhost:2000/api/following/profile/'+username+'/'+myId+'/'+currentUser.id, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'user-id',
          'user-id': localStorage.getItem('user-id')
        }
      })
  
      const currentUserRes = await axios.get('http://localhost:2000/api/user/profile/'+username, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'user-id',
            'user-id': localStorage.getItem('user-id')
          }
        })
        const myCurrentUser = currentUserRes.data
     
        if(myCurrentUser) setCurrentUser(myCurrentUser)
      
  
      const userRes = await axios.get('http://localhost:2000/home', {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': 'user-id',
                'user-id': localStorage.getItem('user-id')
              }
            })
        const myUser = userRes.data    
  
        if(myUser) setUser(myUser)
  
    }

    function getDelete(){
      posts.forEach(element =>{
        if(element.postedBy_id === user.id){
          setIsDelete(prev=>{
            return(
              {
                ...prev,
                [element._id]: true
              }
            )
          })
        } else {
          setIsDelete(prev=>{
            return(
              {
                ...prev,
                [element._id]: false
              }
            )
          })
        }
      })
    }
    
    function getColorLikes(){
      
      const id =  user.likes
      const ids = document.querySelectorAll('[post-id]')
      const arr = []
  
      ids.forEach(element => {
        arr.push(element.getAttribute('post-id'))
      })
      
        arr.forEach(element=>{
          if(id.includes(element)){
            setIsLiked(prev=>{
              return(
                {
                  ...prev,
                  [element]: true
                }
              )
            })
          } else{
            setIsLiked((prev)=>{
              return(
                  {
                    ...prev,
                    [element]: false
                  }
              )
            })
    
          }
        })
      }
  
    function getColorRePosts(){
      const id =  user.rePosts
      const ids = document.querySelectorAll('[post-id]')
      const arr = []
  
      ids.forEach(element => {
        arr.push(element.getAttribute('post-id'))
      })
  
      arr.forEach(element =>{
        if (id.includes(element)){
          setIsReposted((prev)=>{
            return(
                {
                  ...prev,
                  [element]: true
                }
            )
          })
        } else{
          setIsReposted((prev)=>{
            return(
                {
                  ...prev,
                  [element]: false
                }
            )
          })
  
        }
      })
      
    }
  
    function getRePostMessage(){
      const ids = document.querySelectorAll('[post-id]')
      const arr = []
     
      ids.forEach(element => {
        arr.push(element.getAttribute('post-id'))
      })
  
      arr.forEach((element) =>{
        posts.forEach(element2=>{
          if(element2.sharedby && element2._id === element){
            setIsRepostedMessage(prev =>{
              return(
                {
                  ...prev,
                  [element]:element2.sharedby,
                  [element+'status']: true
                }
              )
            })
          }
        })
      })
    
    }

    function getLoggedUser (){
      const localUser = JSON.parse(localStorage.getItem('user')) 
      if(localUser && localUser.username === username){
        setIsLoggedUser(false)
      } else{
        setIsLoggedUser(true)
      }
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

      const postRes = await axios.get('http://localhost:2000/api/post/profile/'+username, fetchConfig)
      const myPosts = postRes.data

      if(myPosts) setPosts(myPosts)

      const currentUserRes = await axios.get('http://localhost:2000/api/user/profile/'+username, fetchConfig)
      const myCurrentUser = currentUserRes.data
   
      if(myCurrentUser) setCurrentUser(myCurrentUser)
  
      const userRes = await axios.get('http://localhost:2000/home', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
      const myUser = userRes.data    

      if(myUser) setUser(myUser)
  
    } 
  
    const {data, error, isLoading} = useQuery(['MyPostData'], fetchData);
  
    
  
    useEffect(()=>{
      getColorLikes()
      getColorRePosts()
      getRePostMessage()
      getDelete()
      getLoggedUser()
      getIsFollowing()
      getFollowLen()
    },[user])
  
    
    function logOut(){
        localStorage.removeItem('token')
        localStorage.removeItem('user-id')
        localStorage.removeItem('user')
        navigate('/login')
        }

    
    async function tabChange(event, newValue){
      event.stopPropagation()
      if(newValue === 'post'){
        setTabValue('post')
        setTabBoolean(true)
        const postsResponse = await axios.get('http://localhost:2000/api/post/profile/'+username, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'user-id',
            'user-id': localStorage.getItem('user-id')
          }
        })
      setPosts(postsResponse.data)
      } else {
        setTabValue('reply')
        setTabBoolean(false)
        const postsResponse = await axios.get('http://localhost:2000/api/post/reply/profile/'+username, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'user-id',
            'user-id': localStorage.getItem('user-id')
          }
        })
      setPosts(postsResponse.data)

      const homeResponse = await axios.get('http://localhost:2000/home', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
      setUser(homeResponse.data)
      }
    }

    const cropperRef = useRef(null)
    function onCrop() {
        const imageElement  = cropperRef?.current
        const cropper = imageElement?.cropper
        //console.log(cropper.getCroppedCanvas().toDataURL());
      }

    function handlerImageInput(event){
      const input = event.target
      if (input.files && input.files[0]){
        const reader = new FileReader()
        reader.onload = (e)=>{
          setUploadProfilePic(e.target.result)
        }
        reader.readAsDataURL(input.files[0])
      }
    }

    function uploadImage(){
        const canvas = cropper.getCroppedCanvas()
        if(canvas == null){
          alert('Could not upload. Make sure it is a image file')
          return
        }

        let formData = new FormData()
        canvas.toBlob(async blob=>{
          formData.append("img", blob)
          
           await axios.post('http://localhost:2000/api/upload/profilePicture', formData, {
            headers:{
              "Content-Type": 'multipart/form-data',
              'user-id': localStorage.getItem('user-id')
            }
          }).then(response =>{
            if (response.status === 200){
              window.location.reload()
            } else{
              alert('something went wrong')
            }
          })

          
        });
    }

    function uploadCoverImage(){
      const canvas = cropper2.getCroppedCanvas()
      if(canvas == null){
        alert('Could not upload. Make sure it is a image file')
        return
      }

      let formData = new FormData()
      canvas.toBlob(async blob=>{
        formData.append("img", blob)
        
         await axios.post('http://localhost:2000/api/upload/coverPhoto', formData, {
          headers:{
            "Content-Type": 'multipart/form-data',
            'user-id': localStorage.getItem('user-id')
          }
        }).then(response =>{
          if (response.status === 200){
            window.location.reload()
          } else{
            alert('something went wrong')
          }
        })

        
      });
  }

  async function messageButton(){
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

    const chat = await axios('http://localhost:2000/api/chat/check/'+user.id+'/'+currentUser.id, fetchConfig)
    const myChat =  chat.data
    if (myChat && myChat.status === false){
      const payloadUser = { 
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        profilePic: user.profilePic,
        username: user.username
      }
      const payloadCurrentUser = { 
        id: currentUser.id,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        profilePic: currentUser.profilePic,
        username: currentUser.username
      }
      
      const payload = {
        users: [payloadUser,payloadCurrentUser],
        usersId: [user.id, currentUser.id]
      }

      axios.post('http://localhost:2000/api/chat/check', payload, fetchConfig).then((response)=>{
        navigate('/messages/'+response.data._id)
      })

    } else if(myChat && myChat.status === true){
      navigate('/messages/'+myChat.result._id)
    }
  }


  return (
    <div className='container-fluid home-area'>
      <div className='row'>
        <SideNav username={user.username} />
          
          <div className='main-section scroll col-10 col-md-8 col-lg-6'>
            <div className='home-title'>
                <ArrowBackIcon onClick={()=> navigate('/home')} className='back-arrow'/>
                <h1>{username}</h1>
            </div>
            <div className='profileHeaderContainer'>
              <div className='coverPhotoSection'>
                <div className='coverPhotoContainer'>
                  <img src={currentUser.coverPhoto} alt='cover photo'></img>
                  {isloggedUser ?
                      null : <button className='coverPhotoButton' data-bs-toggle='modal' data-bs-target='#coverImageUploadModal' > <CameraAltIcon fontSize='large' /> </button>
                      }
                </div>
                <div className='userImageContainer'>
                  <img src={currentUser.profilePic} alt='profile image'></img>
                  {isloggedUser ?
                   null : <button className='profilePictureButton' data-bs-toggle='modal' data-bs-target='#imageUploadModal' > <CameraAltIcon fontSize='large' /> </button>
                  }
                </div>
              </div>
                {isloggedUser ? 
                <div className='profileButtonsContainer'> <button className='profileMessageButton' onClick={messageButton}><MailOutlineIcon /></button> <button onClick={follow} className={isFollowing ? 'profileFollowingButton' : 'profileFollowButton'}>{isFollowing ? 'Following' : 'Follow'}</button></div> : 
                <div className='profileButtonsContainer'> <button className='profileEditButton'>Edit profile</button></div>
                }
                <div className='profileUserDetails'>
                  <span className='displayName'>{currentUser.firstname + ' ' + currentUser.lastname}</span>
                  <span className='displayUsername'>{'@'+username}</span>
                  <div className='description'>
                    <div className='followsContainer'>
                      <a className='following' href={'/profile/'+username+'/following'}>
                        <span className='value'>{followingLen}</span>
                        <span className='valueName'>Following</span>
                      </a>

                      <a className='followers' href={'/profile/'+username+'/followers'}>
                        <span className='value'>{followersLen}</span>
                        <span className='valueName'>Followers</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="modal fade" id="imageUploadModal"  data-bs-backdrop="static" tabIndex="-1" aria-labelledby="imageUploadModalLabel" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5">Upload a new profile picture</h1>
                            <button type="button" onClick={()=>window.location.reload()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                            <input type='file' onChange={handlerImageInput}/>
                            <div>
                            <Cropper
                                src={uploadProfilePic}
                                style={{ height: 'auto', width: "100%", maxWidth: "100%" }}
                                // Cropper.js options
                                initialAspectRatio={1/1}
                                guides={true}
                                crop={onCrop}
                                dragMode='move'
                                ref={cropperRef}
                                viewMode='1'
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                restore={true}
                                checkOrientation={false}
                                onInitialized={(instance) => {
                                setCropper(instance);
                              }}
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button onClick={()=>window.location.reload()} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={uploadImage} type="button" className="btn btn-primary">Save</button>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="modal fade" id="coverImageUploadModal" tabIndex="-1" data-bs-backdrop="static" aria-labelledby="coverImageUploadModalLabel" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5">Upload a new cover photo</h1>
                            <button type="button" onClick={()=>window.location.reload()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                            <input type='file' onChange={handlerImageInput}/>
                            <div>
                            <Cropper
                                src={uploadProfilePic}
                                style={{ height: '100%', width: "100%", maxWidth: "100%" }}
                                // Cropper.js options
                                initialAspectRatio={4/3}
                                guides={true}
                                crop={onCrop}
                                dragMode='move'
                                ref={cropperRef}
                                viewMode='1'
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                restore={true}
                                checkOrientation={false}
                                onInitialized={(instance) => {
                                setCropper2(instance);
                              }}
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button onClick={()=>window.location.reload()} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={uploadCoverImage} type="button" className="btn btn-primary">Save</button>
                          </div>
                        </div>
                      </div>
                    </div>

                  <div className='tabsContainer'>
                  <Tabs
                      value={tabValue}
                      onChange={tabChange}
                      variant='fullWidth'
                      TabIndicatorProps={{style: {background:'#EB5353'}}}
                      centered
                      >
                      <Tab value="post" className='tabText' label="Posts" />
                      <Tab value="reply" className='tabText' label="Replys" />
                  </Tabs>
                  </div>
                </div>
            </div>
            <div>
                  {tabBoolean ? posts.map((prop, index)=>{
                    return(
                      <ProfileEntryPost 
                          key={index}
                          post_id={prop._id}
                          current_id={prop.rePostsData}
                          content={prop.content}
                          currentUsername={username}
                          firstname={prop.postedBy.firstname}
                          lastname={prop.postedBy.lastname}
                          username={prop.postedBy.username}
                          profilePic={prop.postedBy_profilePic}
                          date={prop.createdAt}
                          likes={prop.likesLen}
                          rePosts={prop.rePostsLen}
                          isLiked={isLiked}
                          isReposted={isReposted}
                          isRepostedMessage={isRepostedMessage}
                          setUser={setUser}
                          setCurrentUser={setCurrentUser}
                          setPosts={setPosts}
                          isReply={false}
                          reply={true}
                          repost={true}
                          isDelete={isDelete}              
                        />
                    )
                  }).reverse() :

                  posts.map((prop, index)=>{
                    return(
                      <ProfileReplyEntryPost 
                          key={index}
                          post_id={prop._id}
                          content={prop.content}
                          firstname={prop.postedBy.firstname}
                          lastname={prop.postedBy.lastname}
                          username={prop.postedBy.username}
                          currentUsername={username}
                          profilePic={prop.postedBy_profilePic}
                          date={prop.createdAt}
                          likes={prop.likesLen}
                          rePosts={prop.rePostsLen}
                          isLiked={isLiked}
                          isReposted={isReposted}
                          isRepostedMessage={isRepostedMessage}
                          setUser={setUser}
                          setCurrentUser={setCurrentUser}
                          setPosts={setPosts}
                          isReply={false}
                          reply={false}
                          repost={false}
                          isDelete={isDelete}
                          replyTo={prop.replyTo}              
                        />
                    )
                  }).reverse()
                                  
                  }
                </div>
          </div>

          <div className='third-section d-none d-md-block col-2 col-lg-4'>
              <ThirdSide userId={user.id}/>
          </div>

        </div>
    </div>
  )
}
