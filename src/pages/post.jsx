import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//components
import EntryPost from '../components/EntryPost';
import SideNav from '../components/SideNav';
import { TextareaAutosize } from '@mui/material';

//material ui icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function Post() {
    const { postid } = useParams()

    const navigate = useNavigate()
    
    const [inputText, setInputText] = useState()
    const [len, setLen] = useState(true)
  
    const [commentPosts, setCommentPosts] = useState([])
    const [mainPost, setMainPost] = useState([])
  
    const [user, setUser] = useState({})
    const [isLiked, setIsLiked]= useState({})
    const [isReposted, setIsReposted] = useState({})
    const [isRepostedMessage, setIsRepostedMessage] = useState({})
    const [userNotFound, setUserNotFound] = useState(false)
    const [isDelete, setIsDelete] = useState({})

  function getDelete(){
    const ids = document.querySelectorAll('[post-id]')
    
    commentPosts.forEach(element =>{
      if(element.postedBy_id === user.id){
        setIsDelete(prev=>{
          return(
            {
              ...prev,
              [element._id]: true
            }
          )
        })
      }
    })

    mainPost.forEach(element =>{
      if(element.postedBy_id === user.id){
        setIsDelete(prev=>{
          return(
            {
              ...prev,
              [element._id]: true
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
        commentPosts.forEach(element2=>{
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
  
      const postRes = await axios('http://localhost:2000/api/reply/'+postid, fetchConfig)
      const myPosts = postRes.data
  
      if(myPosts) setCommentPosts(myPosts)
  
      const mainPost = await axios.get('http://localhost:2000/posts/'+postid , fetchConfig)
      const myMainPost = mainPost.data
  
      if(mainPost.data.length === 0){
        setUserNotFound(true)
      } else {
        setUserNotFound(false)
        setMainPost(myMainPost)
      }

      const homeRes = await axios('http://localhost:2000/home', fetchConfig)
      const myHome =  homeRes.data
      
      if (myHome) setUser(myHome)
    } 
  
    const {data, error, isLoading} = useQuery(['MyPostData'], fetchData);
    
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
        // handle error
      }
  
    }, [])
  
    useEffect(()=>{
      getColorLikes()
      getColorRePosts()
      getRePostMessage()
      getDelete()
    },[user])
  
    
      function logOut(){
        localStorage.removeItem('token')
        localStorage.removeItem('user-id')
        localStorage.removeItem('user')
        navigate('/login')
        }
  
      function getPostText(event){
        const myText = event.target.value
        setInputText(myText)
        if (myText.length === 0){
          setLen(true)
        } else {
          setLen(false)
        }
      }
  
      async function replyBtn() {
        const data = {
            reply: inputText,
            postid: postid,
            postedBy: user,
            postedBy_id: user.id,
            postedBy_username: user.username,
            replyToUserId: mainPost[0].postedBy_id
        }

        await axios.post('http://localhost:2000/api/reply',data, {
        headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "user-id": localStorage.getItem('user-id')
           }
        })
      }

  return (
    <div className='container-fluid home-area'>
      <div className='row'>
        <SideNav username={user.username} />
          
          <div className='main-section scroll col-10 col-md-8 col-lg-6'>
            <div className='home-title'>
                <ArrowBackIcon onClick={()=> navigate('/home')} className='back-arrow'/>
                <h1>Post</h1>
            </div>
              <div className=''>
               <div className='mainPostArea'>
               { userNotFound ? <h4 style={{marginLeft: '1rem'}}>post do not exist or was deleted by author</h4> : mainPost.map((prop, index)=>{
                return(
                    <EntryPost
                          key={prop._id}  
                          post_id={prop._id}
                          content={prop.content}
                          firstname={prop.postedBy.firstname}
                          lastname={prop.postedBy.lastname}
                          username={prop.postedBy.username}
                          profilePic={prop.postedBy_profilePic}
                          like={true}
                          date={prop.createdAt}
                          likes={prop.likesLen}
                          rePosts={prop.rePostsLen}
                          isLiked={isLiked}
                          isReposted={isReposted}
                          isRepostedMessage={isRepostedMessage}
                          setUser={setUser}
                          setMainPost={setMainPost}
                          reply_id={postid}    
                          setReplys={setCommentPosts}
                          reply={true}
                          repost={true}
                          isDelete={isDelete}        
                        />
                )
               })}
               </div>
              </div>
              <div className='commentArea'>
                    {userNotFound ? null :
                        <div className='postContainerReply'>
                          <div className='profilePicPOST' >
                            <img src={user.profilePic} alt='user profile pic'/>
                          </div>
                          <div className='postArea'>
                            <form>
                            <TextareaAutosize maxLength="600" maxRows={10} className='postAreaText' onChange={getPostText} placeholder='Type your comment here' />
                            <button disabled={len} onClick={replyBtn}>Post</button>
                            </form>
                          </div>
                        </div>
                        }
                    <div className='comments'>
                        {commentPosts.map((prop,index)=>{
                            return(
                            <div>
                                <EntryPost
                                    key={index}   
                                    post_id={prop._id}
                                    content={prop.content}
                                    firstname={prop.postedBy.firstname}
                                    lastname={prop.postedBy.lastname}
                                    username={prop.postedBy.username}
                                    profilePic={prop.postedBy_profilePic}
                                    date={prop.createdAt}
                                    likes={prop.likesLen}
                                    rePosts={prop.rePostsLen}
                                    isLiked={isLiked}
                                    like={true}
                                    isReposted={isReposted}
                                    isRepostedMessage={isRepostedMessage}
                                    setUser={setUser}
                                    reply_id={postid}
                                    setReplys={setCommentPosts}
                                    isReply={true}
                                    current_id={postid}
                                    setMainPost={setMainPost}
                                    reply={false}
                                    repost={false}
                                    isDelete={isDelete}         
                                />
                            </div>
                            )
                        }).reverse()}
                    </div>
                </div>
            </div>

          <div className='third-section d-none d-md-block col-2 col-lg-4'>
             <h1>third section</h1>
          </div>

        </div>
    </div>
  )
}