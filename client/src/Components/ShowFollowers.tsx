import React, { useState, useEffect } from 'react'
import '../Styles/AccountPage.css'
import URL from '../Util/API_BASE'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Dark from '../Util/Dark'
import { Link } from 'react-router-dom'
import handleError from '../Util/HandleError'
import '../Styles/Followers.css'
import EditFavicon from '../Util/EditFavicon'

const ShowFollowers: React.FC = () => {
  const [name, changeName] = useState('')
  const [followers, setFollowers] = useState([])
  const [followerCount, setFollowerCount] = useState(0)

  document.title = "User's Followers | Instagram Clone"

  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'

  useEffect(() => {
    Dark()
    EditFavicon('/favicon.ico')
    async function getUserFollowers () {
      const fetchUserFollowers = await fetch(
        `${URL}/get-user-followers/${window.location.pathname.split('/')[2]}`
      )
      const userInfo = await fetchUserFollowers.json()
      if (!userInfo.success) {
        handleError(userInfo.message)
      }
      if (!userInfo.exists) {
        document.title = 'User Not Found | Instagram Clone'
        handleError(
          'The user does not exist',
          'Not Found',
          false,
          () => (window.location.href = '../..')
        )
        return
      }
      if (userInfo.needs_new_jwt === true)
        localStorage.setItem('jwt_token', userInfo.jwt_token)
      changeName(window.location.pathname.split('/')[2])
      setFollowers(userInfo.followers)
      setFollowerCount(userInfo.count)
    }
    getUserFollowers()
  }, [])
  document.title = `${name}'s ${
    followerCount !== 1 ? `${followerCount} followers` : '1 follower'
  } | Instagram Clone`
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
                <Link className='topnav-item' to='/feed'>
          My Feed
        </Link>
        <Link className='topnav-item' to={`/user/${name}`}>
          View {name}'s Profile
        </Link>
        <Link className='topnav-item' to='/search/users'>
          Search For Users
        </Link>
      </div>
      {followerCount === 0 ? (
        <>
          <br />
          <h3>
            {name} doesn't appear to have any followers yet :(.
            <Link to={`/user/${name}`}> Follow them now!</Link>
          </h3>
        </>
      ) : (
        <>
          <h1>
            {name}'s{' '}
            {followerCount !== 1 ? `${followerCount} followers` : '1 follower'}:
          </h1>
          <br />
        </>
      )}
      {followers.map(follower => (
        <>
          <div className='followerInfo'>
            <Link to={`/user/${follower['username']}`}>
              <img
                className='pfp'
                src={follower['pfp']}
                alt={follower['username']}
              ></img>
            </Link>

            <span className='followerName'>
              &nbsp;
              <Link to={`/user/${follower['username']}`}>
                {follower['username']}
              </Link>
            </span>
          </div>
          <hr />
        </>
      ))}
    </>
  )
}

export default ShowFollowers
