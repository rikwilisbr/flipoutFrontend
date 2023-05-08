import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';

//components
import SideNav from '../components/SideNav';
import ThirdSide from '../components/thirdSide';
import MobileNav from '../components/mobileNav';
//material ui icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



export default function InboxNewPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [inputText, setInputText] = useState('')
  const [foundUsers, setFoundUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedUsersId, setSelectedUsersId] = useState([])
  const [buttonActive, setButtonActive] = useState(true)

 
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

  function getInputText(event){
    const txt = event.currentTarget.value
    setInputText(txt)
    if (txt === ''){
      return
    } else {
      const newTxt = txt.replace('@','')
      axios.get(process.env.REACT_APP_APIURL+'/api/search/users/?username='+newTxt)
      .then(response=>{
        const data = response.data
        const arr = []
        data.forEach(element=>{
          if(element.id === user.id || selectedUsers.some(u => u.id === element.id) ){
            return
          } else{
            arr.push(element)
          }
        })

        setFoundUsers(arr)
      })
    }
  }

  function getActiveButton(){

      if(selectedUsers.length !== 0){
        setButtonActive(false)
      } else{
        setButtonActive(true)
      }
  }

  async function deleteSelectedUsers(event){
    const myKey = event.key
    if (inputText === '' && myKey === 'Backspace'){
      let myArr = selectedUsers
      const myIndex = myArr.length-1
      myArr.splice(myIndex, 1)
      setSelectedUsers(myArr)
      getActiveButton()
    }

    const userRes = await axios.get(process.env.REACT_APP_APIURL+'/home', {
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

  async function createChat(){

    const data = {users:selectedUsers, usersId: selectedUsersId, currentUser: user}
    const fetchConfig = {
      method: 'POST',
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Expose-Headers': 'user-id',
        "user-id": localStorage.getItem('user-id')
      }
    }

    await axios.post(process.env.REACT_APP_APIURL+'/api/chat', data, fetchConfig).then((response) =>{
      console.log(response.data)
      navigate('/messages/'+response.data._id)
    })

  }



  useEffect(()=>{
    getActiveButton()
  },[selectedUsers])

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
            <div className='home-title'>
                <ArrowBackIcon onClick={()=> navigate('/inbox')} className='back-arrow'/>
                <h1>New Message</h1>
            </div>
            <div className='chatPageContainer'>

              <div className='chatTitleBar'>
                <label for='userSearchTextBox'>To:</label>
                <div id='selectedUsers'>
                {selectedUsers.map((prop, index)=>{
                    return(
                      <span key={index} className='selectedUser'>{prop.firstname + ' ' + prop.lastname}</span>
                    )
                  })}
                  <input onKeyDown={deleteSelectedUsers} onChange={getInputText} value={inputText} id='userSearchTextBox' type='text' placeholder='Type the user @username'/>
                </div>
                
              </div>

              <div className='resultsContainer'>
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
                            <button onClick={()=>{
                              setInputText('')
                              setFoundUsers([])
                              setSelectedUsers(prev=>{
                                return([
                                  ...prev,
                                  prop
                                ])
                              })
                              setSelectedUsersId(prev=>{
                                return([
                                  ...prev,
                                  prop.id
                                ])
                              })
                            }} className='messageNewPageButton'>Add</button>
                          </div>
                        </div>
                     </div>
                    )
                  })}

                  <button id='createChatButton' onClick={createChat} disabled={buttonActive}>Create chat</button>
              </div>

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
