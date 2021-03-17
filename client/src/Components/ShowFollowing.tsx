import React, { useState, useEffect } from 'react'
import '../Styles/AccountPage.css'
import URL from '../Util/API_BASE'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Dark from '../Util/Dark'
import { Link } from 'react-router-dom'
import handleError from '../Util/HandleError'
import '../Styles/Followers.css'
import EditFavicon from '../Util/EditFavicon'

const ShowFollowing: React.FC = () => {
  const [name, changeName] = useState('')
  const [following, setFollowing] = useState([])
  const [followingCount, setFollowingCount] = useState(0)
  EditFavicon('/favicon.ico')

  document.title = "User's Following | Instagram Clone"

  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'

  useEffect(() => {
    Dark()
    async function getUserFollowing () {
      const fetchUserFollowing = await fetch(
        `${URL}/get-user-following/${window.location.pathname.split('/')[2]}`
      )
      const userInfo = await fetchUserFollowing.json()
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
      setFollowing(userInfo.following)
      setFollowingCount(userInfo.count)
    }
    getUserFollowing()
  }, [])
  document.title = `${name} is following ${
    followingCount !== 1 ? `${followingCount} people` : '1 person'
  }| Instagram Clone`
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
      {followingCount === 0 ? (
        <>
          <br />
          <h3>{name} doesn't appear to follow anyone yet :(.</h3>
        </>
      ) : (
        <>
          <h1>
            {name} is following{' '}
            {followingCount !== 1 ? `${followingCount} people` : '1 person'}:
          </h1>
          <br />
        </>
      )}
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
              <Link to={`/user/${following['username']}`}>
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

export default ShowFollowing
