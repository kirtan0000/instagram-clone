import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../Styles/NotFound.css'
import Dark from '../Util/Dark'
import EditFavicon from '../Util/EditFavicon'
import handleLogout from '../Util/Logout'

const NotFound: React.FC = () => {
  const [not_found_path, set_path] = useState('/')
  useEffect(() => {
    Dark()
    set_path(window.location.pathname)
    EditFavicon('/favicon.ico')
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
        <Link className='topnav-item' to='/feed'>
          My Feed
        </Link>
        <Link className='topnav-item' to='/upload-post'>
          Create Post
        </Link>
        <Link className='topnav-item' to='/search/users'>
          Search For Users
        </Link>
        <Link className='topnav-item' to='/chat'>
          Chat
        </Link>
        <Link className='topnav-item' to='#' onClick={handleLogout}>
          Logout
        </Link>
      </div>
      <div className='not_found'>
        <h1> 404 Not Found </h1>
        <div>
          <span>
            The Requested Path <b>'{not_found_path}'</b> Was Not Found On The
            Server!
          </span>
          <br />
          <br />
          <Link to='/'>Go Home!</Link>
        </div>
      </div>
    </>
  )
}

export default NotFound
