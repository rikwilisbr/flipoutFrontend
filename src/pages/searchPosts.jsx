import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//components
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EntryPost from '../components/EntryPost';
import SideNav from '../components/SideNav';
import ThirdSide from '../components/thirdSide';

//material ui icons
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function SearchPosts() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [searchText, setSearchText] = useState('')

    const [posts, setPosts] = useState([])

    const [isLiked, setIsLiked]= useState({})

    const [isReposted, setIsReposted] = useState({})

    const [isRepostedMessage, setIsRepostedMessage] = useState({})
  
    const [isDelete, setIsDelete] = useState({})

    const [tabValue, setTabValue] = useState('posts')

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

  
  async function tabChange(event, newValue){
      navigate('/search/'+newValue)
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
        }
    
      }, [])

      useEffect(()=>{
        getColorLikes()
        getColorRePosts()
        getRePostMessage()
        getDelete()
        console.log('hi')
      },[posts])

      function getSearchText(event){
        const txt = event.currentTarget.value
        setSearchText(txt)
        if (txt === ''){
          return
        } else {
          axios.get('http://localhost:2000/api/search/posts/?content='+txt)
          .then(response=>{
            setPosts(response.data)
          })
        }
        
      }

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
                    <ArrowBackIcon onClick={()=> navigate('/home')} className='back-arrow'/>
                    <h1>Search</h1>
                </div>

                <div className='searchBarContainer'>
                    <SearchIcon className='searchIcon' fontSize='medium'/>
                    <input onChange={getSearchText} value={searchText} id='searchBox' type='text' placeholder='Search for posts'></input>  
                </div>

                <div className='tabsContainer followTabs'>
                    <Tabs
                        value={tabValue}
                        onChange={tabChange}
                        variant='fullWidth'
                        TabIndicatorProps={{style: {background:'#EB5353'}}}
                        centered
                        >
                        <Tab value="users" className='tabText' label="users" />
                        <Tab value="posts" className='tabText' label="posts" />
                    </Tabs>
                  </div>
                  <div className='feedArea'>
                    {posts.map((prop, index)=>{
                        return(
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
                              isReposted={isReposted}
                              isRepostedMessage={isRepostedMessage}
                              setUser={setUser}
                              setPosts={setPosts}
                              isReply={false}
                              like={false}
                              reply={false}
                              repost={false}
                              isDelete={false}              
                            />
                    )}).reverse()}
          
              </div>
            </div>

            <div className='third-section d-none d-md-block col-2 col-lg-4'>
              <ThirdSide userId={user.id}/>
          </div>

        </div>
    </div>
  )
}
