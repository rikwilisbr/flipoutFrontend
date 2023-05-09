import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { socket } from '../services/socket';

//components
import { TextareaAutosize } from '@mui/material';
import ThirdSide from '../components/thirdSide';
import MobileNav from '../components/mobileNav';

//material ui icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SideNav from '../components/SideNav';
import SendIcon from '@mui/icons-material/Send';



export default function ChatPage() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [chat, setChat] = useState([])
  const [chatNameValue, setChatNameValue ] = useState('')
  const [messageValue, setMessageValue] = useState('')
  const [messagesList, setMessagesList] = useState([])
  const [updateTyping, setUpdateTyping] = useState(false)
  const [userTypingName, setUserTypingName] = useState()

  const messagesEndRef = useRef(null)


  useEffect(()=>{
    socket.emit('setup', user)
    socket.emit('join_chat', chatId)
  },[user])

  useEffect(()=>{
    socket.on('typing', (data)=>{
      setUpdateTyping(true)
      setUserTypingName(data)
    })

    socket.on('sended', (data)=>{
      setUpdateTyping(false)
    })

    socket.on('received', async (data)=>{
      const myMessage = data
    
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
     
      const messagesListRes = await axios.get(process.env.REACT_APP_APIURL+'/api/chat/messages/'+chatId, fetchConfig)
      const myMessageList = messagesListRes.data

      const lastMessageLen = myMessageList.length - 1
      
      if(myMessage.content.length > 0){
        setMessagesList(prev=>{
          const updateArray = prev.map((element, index)=>{
            if(index === lastMessageLen - 1 && element.senderId === user.id && element.isFirst !== true){
              return({...element, isFirst: false, isLast: false, className: ''})
            } else if(index === lastMessageLen - 1 && element.senderId === user.id && element.isFirst) {
              return({...element, isFirst: true, isLast: false, className: 'isFirst'})
            } else {
              return element
            }
          })
  
          return updateArray
        })
      }

      let isFirst = Boolean
        if(myMessageList[lastMessageLen - 1]){
          isFirst = myMessage.senderId != myMessageList[lastMessageLen - 1].senderId ? true : false
          console.log(isFirst)
        } else {
          isFirst = true
        }

      let isLast = Boolean
        if(myMessageList[lastMessageLen + 1]){
          isLast = myMessage.senderId != myMessageList[lastMessageLen + 1].senderId ? true : false
        } else {
          isLast = true
        }
        
      let className = String
        if(isFirst && isLast) {
          className = 'isFirst isLast'
        } else if(isFirst) {
          className = 'isFirst'
        } else if(isLast) {
          className = 'isLast'
        } else {
          className = ''
        }
      
      if(myMessage.senderId === user.id){
        setMessagesList((prev)=>{
          return([
            ...prev,
            {
            [myMessage.senderId]: true,
            content: myMessage.content,
            senderId: myMessage.id,
            profilePic: myMessage.profilePic,
            firstname: myMessage.firstname,
            lastname: myMessage.lastname,
            isFirst: isFirst,
            isLast: isLast,
            className: className
          }
          ])
        })
      } else{
        setMessagesList((prev)=>{
          return([
            ...prev,
            {
            [myMessage.senderId]: false,
            content: myMessage.content,
            senderId: myMessage.id,
            profilePic: myMessage.profilePic,
            firstname: myMessage.firstname,
            lastname: myMessage.lastname,
            isFirst: isFirst,
            isLast: isLast,
            className: className
            }
          ])
        })
      }
    })
  },[socket])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesList]);
 

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
    
    
  const {data, error, isLoading} = useQuery(['MyChatData'], fetchData);

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

      const chatListRes = await axios(process.env.REACT_APP_APIURL+'/api/chat/'+chatId, fetchConfig)
      const myChatList =  chatListRes.data
    
      if(myChatList) setChat(myChatList)


      const messagesListRes = await axios(process.env.REACT_APP_APIURL+'/api/chat/messages/'+chatId, fetchConfig)
      const myMessageList = messagesListRes.data

      const homeRes = await axios(process.env.REACT_APP_APIURL+'/home', fetchConfig)
      const myHome =  homeRes.data
      
      if (myHome) setUser(myHome)
   

      if(myMessageList){
        myMessageList.forEach((element, index, array) => {
        let isFirst = Boolean
        if(array[index - 1]){
          isFirst = element.senderId != array[index - 1].senderId ? true : false
        } else {
          isFirst = true
        }

        let isLast = Boolean
        if(array[index + 1]){
          isLast = element.senderId != array[index + 1].senderId ? true : false
        } else {
          isLast = true
        }
        

        let className = String
        if(isFirst && isLast) {
          className = 'isFirst isLast'
        } else if(isFirst) {
          className = 'isFirst'
        } else if(isLast) {
          className = 'isLast'
        } else {
          className = ''
        }
        
          if(element.senderId === myHome.id){
            setMessagesList((prev)=>{
              return(
                [
                  ...prev,
                  {
                    [element.senderId]: true,
                    content: element.content,
                    senderId: element.senderId,
                    profilePic: element.sender.profilePic,
                    firstname: element.sender.firstname,
                    lastname: element.sender.lastname,
                    isFirst: isFirst,
                    isLast: isLast,
                    className: className
                  }
                ]
              )
            })
          } else{
            setMessagesList((prev)=>{
              return(
                [
                  ...prev,
                  {
                    [element.senderId]: false,
                    content: element.content,
                    senderId: element.senderId,
                    profilePic: element.sender.profilePic,
                    firstname: element.sender.firstname,
                    lastname: element.sender.lastname,
                    isFirst: isFirst,
                    isLast: isLast,
                    className: className
                  }
                ]
              )
            })
          }
        })
      } 

    }

    getData()
  },[])



  function getNewChatName(event){
    const value = event.target.value
    setChatNameValue(value)
  }

  function changeChatName(){
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

    axios.put(process.env.REACT_APP_APIURL+'/api/chat/change/chatname/'+chatId, {newChatName: chatNameValue}, fetchConfig)
    .then((response)=>{
      
      window.location.reload()
    } )

    
  }

  async function sendMessageByKey(event){
    const enterKey = event.key
    if(enterKey === 'Enter' && messageValue.length > 0){
      event.preventDefault()
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

      const messageData = {
        message:{
          [user.id]: true,
          content: messageValue,
          senderId: user.id,
          profilePic: user.profilePic,
          firstname: user.firstname,
          lastname: user.lastname
        },
        chatId: chatId
      }

      socket.emit('message_send', messageData)

      await axios.post(process.env.REACT_APP_APIURL+'/api/chat/messages',{content: messageValue, chatId: chatId, firstname: user.firstname, lastname: user.lastname, profilePic: user.profilePic, username: user.username}, fetchConfig)
      .then((response)=>{
      })

      await axios.put(process.env.REACT_APP_APIURL+'/api/chat/change/lastestMessage/'+chatId, {message: messageValue}, fetchConfig)
      .then((response)=>{
      })

      const messagesListRes = await axios.get(process.env.REACT_APP_APIURL+'/api/chat/messages/'+chatId, fetchConfig)
      const myMessageList = messagesListRes.data

      const homeRes = await axios.get(process.env.REACT_APP_APIURL+'/home', fetchConfig)
      const myHome =  homeRes.data
      
      if (myHome) setUser(myHome)
      
      const mylen = myMessageList.length - 1
      const lastMessageLen = messagesList.length - 1

      const updateArray = messagesList.map((element, index, array)=>{
      
        if(index === mylen - 1 && element.senderId === user.id && element.isFirst !== true){
          return({...element, isFirst: false, isLast: false, className: ''})
        } else if(index === mylen - 1 && element.senderId === user.id && element.isFirst) {
          return({...element, isFirst: false, isLast: false, className: 'isFirst'})
        } else {
          return element
        }
      })

      setMessagesList(updateArray)


      let isFirst = Boolean
        if(messagesList[lastMessageLen]){
          isFirst = myMessageList[mylen].senderId != messagesList[lastMessageLen].senderId ? true : false
        } else {
          isFirst = true
        }
  
      let isLast = Boolean
        if(messagesList[lastMessageLen + 1]){
          isLast = myMessageList[mylen].senderId != messagesList[lastMessageLen + 1].senderId ? true : false
        } else {
          isLast = true
        }
        
      let className = String
        if(isFirst && isLast) {
          className = 'isFirst isLast'
        } else if(isFirst) {
          className = 'isFirst'
        } else if(isLast) {
          className = 'isLast'
        } else {
          className = ''
        }

      
      if(myMessageList[mylen].senderId === user.id){
        setMessagesList((prev)=>{
          return(
            [
              ...prev,
              {
                [myMessageList[mylen].senderId]: true,
                content: myMessageList[mylen].content,
                senderId: myMessageList[mylen].senderId,
                profilePic: myMessageList[mylen].profilePic,
                firstname: myMessageList[mylen].firstname,
                lastname: myMessageList[mylen].lastname,
                isFirst: isFirst,
                isLast: isLast,
                className: className
                
              }
            ]
          )
        })
      } else {
        setMessagesList((prev)=>{
          return(
            [
              ...prev,
              {
                [myMessageList[mylen].senderId]: false,
                content: myMessageList[mylen].content,
                senderId: myMessageList[mylen].senderId,
                profilePic: myMessageList[mylen].profilePic,
                firstname: myMessageList[mylen].firstname,
                lastname: myMessageList[mylen].lastname,
                isFirst: isFirst,
                isLast: isLast,
                className: className
              }
            ]
          )
        })
      } 

      setMessageValue('')
    }
  }

  async function sendMessageByButton(event){
    if (messageValue.length > 0){
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

      const messageData = {
        message:{
          [user.id]: true,
          content: messageValue,
          senderId: user.id,
          profilePic: user.profilePic,
          firstname: user.firstname,
          lastname: user.lastname
        },
        chatId: chatId
      }

      socket.emit('message_send', messageData)

      await axios.post(process.env.REACT_APP_APIURL+'/api/chat/messages', {content: messageValue, chatId: chatId, firstname: user.firstname, lastname: user.lastname, profilePic: user.profilePic, username: user.username}, fetchConfig)
      .then((response)=>{
        
      })

      await axios.put(process.env.REACT_APP_APIURL+'/api/chat/change/lastestMessage/'+chatId, {message: messageValue}, fetchConfig)
      .then((response)=>{
      })
      
      const messagesListRes = await axios.get(process.env.REACT_APP_APIURL+'/api/chat/messages/'+chatId, fetchConfig)
      const myMessageList = messagesListRes.data

      const homeRes = await axios.get(process.env.REACT_APP_APIURL+'/home', fetchConfig)
      const myHome =  homeRes.data
      
      if (myHome) setUser(myHome)
      
      const mylen = myMessageList.length - 1
      const lastMessageLen = messagesList.length - 1

      const updateArray = messagesList.map((element, index, array)=>{
      
        if(index === mylen - 1 && element.senderId === user.id && element.isFirst !== true){
          return({...element, isFirst: false, isLast: false, className: ''})
        } else if(index === mylen - 1 && element.senderId === user.id && element.isFirst) {
          return({...element, isFirst: true, isLast: false, className: 'isFirst'})
        } else {
          return element
        }
      })

      setMessagesList(updateArray)
      
      let isFirst = Boolean
        if(messagesList[lastMessageLen]){
          isFirst = myMessageList[mylen].senderId != messagesList[lastMessageLen].senderId ? true : false
        } else {
          isFirst = true
        }

      let isLast = Boolean
        if(messagesList[lastMessageLen + 1]){
          isLast = myMessageList[mylen].senderId != messagesList[lastMessageLen + 1].senderId ? true : false
        } else {
          isLast = true
        }
        

      let className = String
        if(isFirst && isLast) {
          className = 'isFirst isLast'
        } else if(isFirst) {
          className = 'isFirst'
        } else if(isLast) {
          className = 'isLast'
        } else {
          className = ''
        }
      
      if(myMessageList[mylen].senderId === user.id){
        setMessagesList((prev)=>{
          return(
            [
              ...prev,
              {
                [myMessageList[mylen].senderId]: true,
                content: myMessageList[mylen].content,
                senderId: myMessageList[mylen].senderId,
                profilePic: myMessageList[mylen].profilePic,
                firstname: myMessageList[mylen].firstname,
                lastname: myMessageList[mylen].lastname,
                isFirst: isFirst,
                isLast: isLast,
                className: className
              }
            ]
          )
        })
      } else {
        setMessagesList((prev)=>{
          return(
            [
              ...prev,
              {
                [myMessageList[mylen].senderId]: false,
                content: myMessageList[mylen].content,
                senderId: myMessageList[mylen].senderId,
                profilePic: myMessageList[mylen].profilePic,
                firstname: myMessageList[mylen].firstname,
                lastname: myMessageList[mylen].lastname,
                isFirst: isFirst,
                isLast: isLast,
                className: className
              }
            ]
          )
        })
      }

      setMessageValue('')
    }
  }

  function getMessageValue(event){
    const value = event.target.value
    if(value !== ''){
      socket.emit('typing', {chatId: chatId, username: user.firstname})
    } else {
      socket.emit('message_send', chatId)
    }

    setMessageValue(value)
  }

  return (
    <div className='container-fluid home-area'>
      <div className='row'>
        <SideNav username={user.username} />
          
          <div className='main-section scroll col-10 col-md-8 col-lg-6'>
            <div className='home-title'>
                <ArrowBackIcon onClick={()=> navigate('/inbox')} className='back-arrow'/>
                <h1>Chat</h1>
            </div>
            
            <div className='chatPageContainer'>
                <div className='chatTitleBarContainer'>
                {chat.map((prop,index)=>{
                    
                    return(
                        prop.isGroupChat ?
                        <div key={uuid()} className='chatImagesContainer'>
                        <img src={prop.users[0].profilePic} alt='User' />
                        <img className='secondImage' src={prop.users[1].profilePic} alt='User' />
                        </div> :
                        <div key={uuid()} className='chatImagesContainerSingle'>
                        <img src={prop.users[0].id != user.id ? prop.users[0].profilePic : prop.users[1].profilePic} alt='User' />
                        </div> 
                    )
                })}

                {chat.map((prop,index)=>{
                    const chatNamesArray = prop.users.map(element => element.firstname + ' ' + element.lastname)
                    const chatNames = chatNamesArray.join(', ')
                    
                    return(
                        <div key={uuid()}>
                            {prop.chatName ? <span data-bs-toggle='modal' data-bs-target='#chatNameModal' id='chatName'>{prop.chatName}</span> : <span data-bs-toggle='modal' data-bs-target='#chatNameModal' id='chatName'>{chatNames}</span>}
                        </div>
                    )
                })}

                <div className="modal fade" id="chatNameModal" tabIndex="-1" data-bs-backdrop="static" aria-labelledby="coverImageUploadModalLabel" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5">Change the chat name</h1>
                            <button type="button" onClick={()=>window.location.reload()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body chatModalBody">
                            <input onChange={getNewChatName} value={chatNameValue} className='chatNameChangeInput' type='text' placeholder='type the chat name...'/>
                          </div>
                          <div className="modal-footer">
                            <button onClick={()=>window.location.reload()} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={changeChatName} type="button" className="btn btn-primary">Save</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className='typingMessage'>{updateTyping ? userTypingName + ' is typing...' : null}</span>
                    
                </div>

                <div className='mainContentContainer'>
                    <div className='chatContainer'>
                        <div className='chatMessages'>
                            {messagesList.map((prop,index)=>{
                              return(
                                <div key={uuid()}>
                                <div className='messageMainContainer'>
                                  <div className={prop.isLast ? 'photoIsLast' : 'photoNotIsLast' } style={prop.isLast ? {display: 'block'} : {display: 'none'}}>
                                  <div className={prop[prop.senderId] ? 'userPhoto' : 'notUserPhoto'}>
                                    <img className={ prop.isFirst ? 'messagePhoto isFirst' : 'messagePhoto'} src={prop.profilePic}/>
                                  </div>
                                  </div>
                                  <li className={prop[prop.senderId] ? 'userMessage ' + prop.className : 'notUserMessage ' + prop.className}>
                                    <div style={prop.isFirst ? {display: 'block'} : {display: 'none'}}>
                                      <span className='messageUserName'>{prop.firstname + ' ' + prop.lastname}</span>
                                    </div>
                                    <div className='messageContainer'>
                                      <span className='messageBody'>{prop.content}</span>
                                    </div>
                                  </li>
                                  </div>
                                </div>
                              )
                            })}
                            <div ref={messagesEndRef}></div>

                        </div>
                        <div className='chatFooter'>
                            <TextareaAutosize onChange={getMessageValue} value={messageValue} onKeyDown={sendMessageByKey} maxRows={10} minRows={2} placeholder='type a message...'/>
                            <button onClick={sendMessageByButton} className='sendMessageButton'><SendIcon /></button>
                        </div>
                    </div>
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
