import React, { useState, useEffect } from 'react'
import URL from '../Util/API_BASE'
import Dark from '../Util/Dark'
import { Link } from 'react-router-dom'
import handleError from '../Util/HandleError'
import handleLogout from '../Util/Logout'

const Chat: React.FC = () => {
  const [following, setFollowing] = useState([])
  const [followingCount, setFollowingCount] = useState(0)

  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'

  var jwt_token = localStorage.getItem('jwt_token') || ''
  var refresh_token = localStorage.getItem('refresh_token') || ''

  useEffect(() => {
    document.title = 'Chat | Instagram Clone'
    Dark()
    async function getUserFollowing () {
      const userInfoParams = new URLSearchParams()
      userInfoParams.append('jwt_token', jwt_token)
      userInfoParams.append('refresh_token', refresh_token)

      const fetchUser = await fetch(`${URL}/get-my-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: userInfoParams,
        redirect: 'follow'
      })
      const userInfo = await fetchUser.json()
      if (!userInfo.success) {
        handleError(userInfo.message)
        return
      }
      if (userInfo.needs_new_jwt === true)
        localStorage.setItem('jwt_token', userInfo.jwt_token)

      const fetchUserFollowing = await fetch(
        `${URL}/get-user-following/${userInfo.user_name}`
      )
      const userInfoFol = await fetchUserFollowing.json()
      if (!userInfoFol.success) {
        handleError(userInfoFol.message)
      }
      if (!userInfoFol.exists) {
        document.title = 'User Not Found | Instagram Clone'
        handleError(
          'The user does not exist',
          'Not Found',
          false,
          () => (window.location.href = '../..')
        )
        return
      }

      setFollowing(userInfoFol.following)
      setFollowingCount(userInfoFol.count)
    }
    getUserFollowing()
  }, [])
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
      <h1>
        Total: {followingCount} {followingCount === 1 ? 'chat' : 'chats'}
      </h1>
      <br />
      {following.map(following => (
        <>
          <div className='followingInfo'>
            <Link to={`/user/${following['username']}`}>
              <img
                className='pfp'
                src={following['pfp']}
                alt={following['username']}
              ></img>
            </Link>

            <span className='followingName'>
              &nbsp;
              <Link to={`/chats/${following['username']}`}>
                {following['username']}
              </Link>
            </span>
          </div>
          <hr />
        </>
      ))}
    </>
  )
}

export default Chat
