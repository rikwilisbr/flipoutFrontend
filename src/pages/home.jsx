import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { socket } from '../services/socket';

//components
import EntryPost from '../components/EntryPost';
import SideNav from '../components/SideNav';
import { TextareaAutosize } from '@mui/material';
import ThirdSide from '../components/thirdSide';
import MobileNav from '../components/mobileNav';
import {MoonLoader} from 'react-spinners'

export default function Home() {

  const navigate = useNavigate()

  const [inputText, setInputText] = useState()

  const [len, setLen] = useState(true)

  const [posts, setPosts] = useState([])

  const [user, setUser] = useState({})

  const [isLiked, setIsLiked]= useState({})

  const [isReposted, setIsReposted] = useState({})

  const [isRepostedMessage, setIsRepostedMessage] = useState({})
  
  const [isDelete, setIsDelete] = useState({})

  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    socket.emit('setup', user)
  },[user])

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

    const postRes = await axios(process.env.REACT_APP_APIURL+'/api/post', fetchConfig)
    const myPosts = postRes.data

    if(myPosts) setPosts(myPosts)

    const homeRes = await axios(process.env.REACT_APP_APIURL+'/home', fetchConfig)
    const myHome =  homeRes.data
    
    if (myHome) setUser(myHome)
    setLoading(false)
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

  useEffect(()=>{
    getColorLikes()
    getColorRePosts()
    getRePostMessage()
    getDelete()
  },[user])


    function getPostText(event){
      const myText = event.target.value
      setInputText(myText)
      if (myText.length === 0){
        setLen(true)
      } else {
        setLen(false)
      }
    }

    async function makeThePost(){
      const postedBy = {
        firstname: user.firstname,
        lastname: user.lastname,
        profilePic: user.profilePic,
        id: user.id,
        username: user.username
      }
      const data = {
        content: inputText,
        postedBy: postedBy
      }
      await axios.post(process.env.REACT_APP_APIURL+'/api/post', data, {
      headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "user-id": localStorage.getItem('user-id')
         }
      })

      setLen(true)
    }

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
            <div className='home-title'>
              <h1>Home</h1>
            </div>
            {
              loading ? <MoonLoader cssOverride={override} color="#FF0000" loading={loading} /> :
              <div>
              <div className='postContainer'>
                <div className='profilePicPOST' >
                  <img src={user.profilePic} alt='user profile pic'/>
                </div>
                <div className='postArea'>
                  <form>
                  <TextareaAutosize maxLength="1200" maxRows={10} className='postAreaText' onChange={getPostText} placeholder='What is happening?' />
                  <button disabled={len} onClick={makeThePost}>Post</button>
                  </form>
                </div>
              </div>
              <div className='feedArea'>
                {posts.map((prop, index)=>{
                    return(
                      <EntryPost 
                          key={index}
                          post_id={prop._id}
                          current_id={prop.rePostsData}
                          content={prop.content}
                          firstname={prop.postedBy.firstname}
                          lastname={prop.postedBy.lastname}
                          username={prop.postedBy.username}
                          profilePic={prop.postedBy_profilePic}
                          date={prop.createdAt}
                          like={true}
                          likes={prop.likesLen}
                          rePosts={prop.rePostsLen}
                          isLiked={isLiked}
                          isReposted={isReposted}
                          isRepostedMessage={isRepostedMessage}
                          setUser={setUser}
                          setPosts={setPosts}
                          isReply={false}
                          reply={true}
                          repost={true}
                          isDelete={isDelete}              
                        />
                    )}).reverse()}
          
              </div>
              </div>
            }
              
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


