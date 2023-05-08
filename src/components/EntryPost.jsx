import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//material ui icons
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

//components


export default function EntryPost(prop){
  
  const navigate = useNavigate()

    function getPostId(event){
        const id = event.currentTarget.getAttribute("post-id")
        return id
      }
  
      async function rePostBtn(event) {
        event.stopPropagation()
        const myRePost = getPostId(event)
      
        try {
          
           await axios.post(process.env.REACT_APP_APIURL+'/api/post/repost', {
            repost: myRePost
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id'),
              'user': localStorage.getItem('user')
            }
          })
         
          await axios.put(process.env.REACT_APP_APIURL+'/api/post/repost', {
            repost: myRePost
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id'),
            }
          })
      
          await axios.put(process.env.REACT_APP_APIURL+'/api/post/user/repost', {
            repost: myRePost
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
      
          const postsResponse = await axios.get(process.env.REACT_APP_APIURL+'/api/post', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setPosts(postsResponse.data)

          const homeResponse = await axios.get(process.env.REACT_APP_APIURL+'/home', {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': 'user-id',
                'user-id': localStorage.getItem('user-id')
              }
            })
            prop.setUser(homeResponse.data)
          }catch (error) {

          const mainPostResponse = await axios.get(process.env.REACT_APP_APIURL+'/posts/'+prop.reply_id, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setMainPost(mainPostResponse.data)

          const replyResponse = await axios.get(process.env.REACT_APP_APIURL+'/api/reply/'+prop.reply_id, {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': 'user-id',
                'user-id': localStorage.getItem('user-id')
              }
            })
            prop.setReplys(replyResponse.data)

          const homeResponse = await axios.get(process.env.REACT_APP_APIURL+'/home', {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': 'user-id',
                'user-id': localStorage.getItem('user-id')
              }
            })
            prop.setUser(homeResponse.data)
          }
          
      }
  
      async function likeBtn(event) {
        event.stopPropagation()
        const myLike = getPostId(event)
    
          await axios.put(process.env.REACT_APP_APIURL+'/api/post/like', {
            like: myLike
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
      
          await axios.put(process.env.REACT_APP_APIURL+'/api/post/user/like', {
            like: myLike
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
      
          try {
            const postsResponse = await axios.get(process.env.REACT_APP_APIURL+'/api/post', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setPosts(postsResponse.data)

          const homeResponse = await axios.get(process.env.REACT_APP_APIURL+'/home', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setUser(homeResponse.data)

          }
          catch(ex){
            
          const replyResponse = await axios.get(process.env.REACT_APP_APIURL+'/api/reply/'+prop.reply_id, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setReplys(replyResponse.data)

          const mainPostResponse = await axios.get(process.env.REACT_APP_APIURL+'/posts/'+prop.reply_id, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setMainPost(mainPostResponse.data)

          const homeResponse = await axios.get(process.env.REACT_APP_APIURL+'/home', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          
          prop.setUser(homeResponse.data)

          }

      
      }

      async function deleteBtn(event){
        event.stopPropagation()

        await axios.delete(process.env.REACT_APP_APIURL+'/api/delete/'+prop.post_id)
       
        try{
        const postsResponse = await axios.get(process.env.REACT_APP_APIURL+'/api/post', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setPosts(postsResponse.data)

        const homeResponse = await axios.get(process.env.REACT_APP_APIURL+'/home', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          
          prop.setUser(homeResponse.data)
        }catch(ex){

          const replyResponse = await axios.get(process.env.REACT_APP_APIURL+'/api/reply/'+prop.reply_id, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setReplys(replyResponse.data)

          const mainPostResponse = await axios.get(process.env.REACT_APP_APIURL+'/posts/'+prop.reply_id, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          prop.setMainPost(mainPostResponse.data)


          const homeResponse = await axios.get(process.env.REACT_APP_APIURL+'/home', {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Expose-Headers': 'user-id',
              'user-id': localStorage.getItem('user-id')
            }
          })
          
          prop.setUser(homeResponse.data)

          }

      }


    function timeDifference(current, previous) {

      var msPerMinute = 60 * 1000;
      var msPerHour = msPerMinute * 60;
      var msPerDay = msPerHour * 24;
      var msPerMonth = msPerDay * 30;
      var msPerYear = msPerDay * 365;
    
      var elapsed = current - previous;
    
      if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return 'Just now'
           return Math.round(elapsed/1000) + ' seconds ago';   
      }
    
      else if (elapsed < msPerHour) {
           return Math.round(elapsed/msPerMinute) + ' minutes ago';   
      }
    
      else if (elapsed < msPerDay ) {
           return Math.round(elapsed/msPerHour ) + ' hours ago';   
      }
    
      else if (elapsed < msPerMonth) {
          return Math.round(elapsed/msPerDay) + ' days ago';   
      }
    
      else if (elapsed < msPerYear) {
          return Math.round(elapsed/msPerMonth) + ' months ago';   
      }
    
      else {
          return Math.round(elapsed/msPerYear ) + ' years ago';   
      }
    }

    function navigateToPost(event){
      event.stopPropagation()
      navigate(prop.isRepostedMessage[prop.post_id+'status'] ? '/posts/'+prop.current_id : '/posts/'+prop.post_id )
    
    }

    return(
      <div>
      <div onClick={navigateToPost} className='post' post-id={prop.post_id}>
          <div className='postActionContainer'>
          {prop.isRepostedMessage[prop.post_id+'status'] ? <span>Reposted by <a href={'/profile/'+prop.isRepostedMessage[prop.post_id]}>@{prop.isRepostedMessage[prop.post_id]}</a></span> : null}
          </div>
          <div className='mainContentContainer'>
            <div className='profilePicPOST'>
              <img className='profilePic'src={prop.profilePic} alt='user profile pic'/>
            </div>
            <div className='postContentContainer'>
              <div className='postHeader'>
                <div className='col-10'>
                  <a onClick={e => e.stopPropagation()} href={'/profile/'+prop.username}>{prop.firstname +' '+prop.lastname}</a>
                  <span className='username'>{'@'+prop.username}</span>
                  <span className='date'>{timeDifference(new Date(), new Date(prop.date))}</span>
                </div>
              </div>
              <div className='postBody'>
              <div className=''></div>
                <span className='post-content'>{prop.content}</span>
              </div>
              <div className='postFooter'>
               {prop.reply ?  <div className='postButtonContainer'>
                  <button onClick={navigateToPost} post-id={prop.post_id} className='comment-btn'>
                    <ChatBubbleOutlineOutlinedIcon  fontSize='small' />
                  </button>
                </div> : null}

                {prop.repost ? <div className='postButtonContainer'>
                  <button onClick={rePostBtn} post-id={prop.post_id} className={prop.isReposted[prop.post_id] ? 'repost-btn repost-btn-green' : 'repost-btn'}>
                    <CachedOutlinedIcon  fontSize='small' />
                  </button>
                  <span className={prop.isReposted[prop.post_id] ? 'repostNumber-green': 'repostNumber'}>{prop.rePosts || ""}</span>
                </div>: null}

                {prop.like ? <div className='postButtonContainer'>
                  <button post-id={prop.post_id} onClick={likeBtn} className={prop.isLiked[prop.post_id] ? 'like-btn like-btn-red' : 'like-btn'}>
                    {prop.isLiked[prop.post_id] ? <FavoriteIcon fontSize='small' /> : <FavoriteBorderOutlinedIcon fontSize='small' />}
                  </button>
                    <span className={prop.isLiked[prop.post_id] ? 'likeNumber-red': 'likeNumber'}>{prop.likes || ""}</span>
                </div> : null }
                
               { prop.isDelete[prop.post_id] ? 
               <div className='postButtonContainer'>
                      <button onClick={deleteBtn} className='delete-btn' post-id={prop.post_id}>
                          <DeleteOutlineIcon fontSize='small'/>
                      </button>
                </div> : null }
              </div>
            </div>
        </div>
        </div>
      </div>
    )
  }
