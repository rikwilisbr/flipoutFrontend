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
import {MoonLoader} from 'react-spinners'

//material ui icons
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SearchUsers() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [searchText, setSearchText] = useState('')

    const [tabValue, setTabValue] = useState('users')

    const [foundUsers, setFoundUsers] = useState([])

    const [loading, setLoading] = useState(false)

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
    
        const homeRes = await axios(process.env.REACT_APP_APIURL+'/home', fetchConfig)
        const myHome =  homeRes.data
        
        if (myHome) setUser(myHome)
      }
      
      const {data, error, isLoading} = useQuery(['MyPostData'], fetchData);

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
      
      function getSearchText(event){
        const txt = event.currentTarget.value
        setSearchText(txt)
        setLoading(true)
        if (txt === ''){
          return setLoading(false)
        } else {
          const newTxt = txt.replace('@','')
          axios.get(process.env.REACT_APP_APIURL+'/api/search/users/?username='+newTxt)
          .then(response=>{
            setFoundUsers(response.data)
            setLoading(false)
          })
        }
        
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
                      <ArrowBackIcon onClick={()=> navigate('/home')} className='back-arrow'/>
                      <h1>Search</h1>
                  </div>

                  <div className='searchBarContainer'>
                      <SearchIcon className='searchIcon' fontSize='medium'/>
                      <input onChange={getSearchText} value={searchText} id='searchBox' type='text' placeholder='Search for the user @username'></input>  
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

                <div>
                <MoonLoader cssOverride={override} color="#FF0000" loading={loading} />

                  {foundUsers.map((prop, index)=>{
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
