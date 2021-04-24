import React, { useState, useEffect } from 'react'
import URL from '../Util/API_BASE'
import Dark from '../Util/Dark'
import { Link } from 'react-router-dom'
import handleError from '../Util/HandleError'
import handleLogout from '../Util/Logout'
import '../Styles/Chats.css'
import socketClient from 'socket.io-client'

const Chats: React.FC = () => {
  const [all_chats, setChats] = useState([])
  const [chatMessageVal, setChatMessageVal] = useState('')

  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'

  var jwt_token = localStorage.getItem('jwt_token') || ''
  var refresh_token = localStorage.getItem('refresh_token') || ''
  var user_to = window.location.pathname.split('/')[2]
  const socket = socketClient(`${URL}/../`, {
    transports: ['websocket'],
    path: '/api/chats/socket.io'
  })

  useEffect(() => {
    let myName = ''
    document.title = `Chat with ${user_to} | Instagram Clone`
    Dark()
    async function getUserChats () {
      const userChatParams = new URLSearchParams()
      userChatParams.append('jwt_token', jwt_token)
      userChatParams.append('refresh_token', refresh_token)

      const fetchChats = await fetch(`${URL}/chats/${user_to}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: userChatParams,
        redirect: 'follow'
      })
      const chatsAll = await fetchChats.json()
      if (!chatsAll.success) {
        handleError(
          chatsAll.message,
          'Error!',
          false,
          () => (window.location.href = '../..')
        )
        return
      }
      if (chatsAll.needs_new_jwt === true)
        localStorage.setItem('jwt_token', chatsAll.jwt_token)

      setChats(chatsAll.all_chats)
      myName = chatsAll.user_name
    }
    getUserChats()

    socket.on('new_message', (data: any) => {
      if (
        (data.to === user_to && data.from === myName) ||
        (data.from === user_to && data.to === myName)
      ) {
        const newChats = all_chats
        setChats(prev => [
          ...prev,
          {
            author: data.author,
            content: data.content,
            timestamp: data.timestamp,
            pfp: data.pfp
          }
        ])
      }
    })
  }, [])

  // Send the chat
  const send = async () => {
    const content = chatMessageVal
    if (
      content === '' ||
      !content.replace(/\s/g, '').length ||
      content.length < 1
    ) {
      handleError(
        'The chat must have 1 or more characters.',
        'Invalid Message Length',
        false
      )
      return
    }

    if (content.length > 70) {
      handleError(
        'The chat must have less than 70 characters.',
        'Invalid Message Length',
        false
      )
      return
    }
    const userChatParams = new URLSearchParams()
    userChatParams.append('jwt_token', jwt_token)
    userChatParams.append('refresh_token', refresh_token)
    userChatParams.append('username', user_to)
    userChatParams.append('content', content)

    const sendChat = await fetch(`${URL}/send-chat/${user_to}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: userChatParams,
      redirect: 'follow'
    })
    const sendChatData = await sendChat.json()
    if (!sendChatData.success) {
      handleError(
        sendChatData.message,
        'Error!',
        false,
        () => (window.location.href = '../..')
      )
      return
    }
    if (sendChatData.needs_new_jwt === true)
      localStorage.setItem('jwt_token', sendChatData.jwt_token)

    setChatMessageVal('')
  }

  return (
    <>
      <div className='topnav theme-reverse topnav-shadow'>
        <span className='topnav-brand'>Instagram Clone</span>
        <span className='topnav-hamburger-menu' data-target='myTopnav'>
          &#x2630;
        </span>
        <div className='topnav-right' id='myTopnav'></div>
        <Link className='topnav-item' to='/'>
          Home
        </Link>
        <Link className='topnav-item' to='/upload-post'>
          Create Post
        </Link>
        <Link className='topnav-item' to='/search/users'>
          Search For Users
        </Link>
        <Link className='topnav-item' to='/feed'>
          My Feed
        </Link>
        <Link className='topnav-item' to='#' onClick={handleLogout}>
          Logout
        </Link>
      </div>
      {all_chats.map(chat => (
        <>
          <div className='followingInfo'>
            <img
              className='pfp user_pfp_chat'
              src={chat['pfp']}
              alt={chat['username']}
            ></img>
            <h2 className='followingName user_name_chat'> {chat['author']}</h2>
            <br />
            <span className='chat-content'>{chat['content']}</span>
          </div>
          <hr />
        </>
      ))}
      <input
        onChange={event => setChatMessageVal(event.target.value)}
        value={chatMessageVal}
        id='send-chat'
      ></input>
      <button onClick={send} className='btn btn-light send-chat-btn'>
        Send
      </button>
    </>
  )
}

export default Chats
