import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import '../Styles/AccountPage.css'
import URL from '../Util/API_BASE'
import Dark from '../Util/Dark'
import { Link } from 'react-router-dom'
import handleError from '../Util/HandleError'
import EditFavicon from '../Util/EditFavicon'
import handleLogout from '../Util/Logout'

const Account: React.FC = () => {
  const [name, changeName] = useState('')
  const [userPfpUrl, setPfpUrl] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSelf, setIsSelf] = useState(false)
  const [followersCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [userExists, setUserExists] = useState(false)
  const [postsCount, setPostsCount] = useState(0)

  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'

  var jwt_token = localStorage.getItem('jwt_token') || ''
  var refresh_token = localStorage.getItem('refresh_token') || ''

  // Run only once
  useEffect(() => {
    Dark()
    async function getUserInfo () {
      let get_user_params = new URLSearchParams()
      get_user_params.append('jwt_token', jwt_token)
      get_user_params.append('refresh_token', refresh_token)
      const fetchUser = await fetch(
        `${URL}/get-account/${window.location.pathname.split('/')[2]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: get_user_params,
          redirect: 'follow'
        }
      )
      const userInfo = await fetchUser.json()
      if (!userInfo.success) {
        handleError(userInfo.message)
      }
      if (!userInfo.exists) {
        document.title = 'User Not Found | Instagram Clone'
        setUserExists(false)
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
      changeName(userInfo.user_name)
      setPfpUrl(userInfo.user_pfp)
      EditFavicon(userInfo.user_pfp)
      setIsFollowing(userInfo.isFollowing)
      setFollowerCount(userInfo.totalFollowersCount)
      setFollowingCount(userInfo.totalFollowingCount)
      setIsSelf(userInfo.isSelf)
      setPosts(userInfo.user_posts)
      setPostsCount(userInfo.user_posts_length)
      setUserExists(true)
      document.title = `${userInfo.user_name} | Instagram Clone`
    }
    getUserInfo()
  }, [])

  const follow = async () => {
    if (!isFollowing) {
      let follow_user_params = new URLSearchParams()
      follow_user_params.append('jwt_token', jwt_token)
      follow_user_params.append('refresh_token', refresh_token)
      const followUser = await fetch(
        `${URL}/follow/${window.location.pathname.split('/')[2]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: follow_user_params,
          redirect: 'follow'
        }
      )
      const userFollowed = await followUser.json()
      if (!userFollowed.success) {
        handleError(userFollowed.message)
      }
      if (userFollowed.needs_new_jwt === true)
        localStorage.setItem('jwt_token', userFollowed.jwt_token)
      setIsFollowing(true)
      setFollowerCount(count => count + 1)
    } else {
      let unfollow_user_params = new URLSearchParams()
      unfollow_user_params.append('jwt_token', jwt_token)
      unfollow_user_params.append('refresh_token', refresh_token)
      const unfollowUser = await fetch(
        `${URL}/unfollow/${window.location.pathname.split('/')[2]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: unfollow_user_params,
          redirect: 'follow' // Ironic😉
        }
      )
      const userunFollowed = await unfollowUser.json()
      if (!userunFollowed.success) {
        handleError(userunFollowed.message)
        return
      }
      if (userunFollowed.needs_new_jwt === true)
        localStorage.setItem('jwt_token', userunFollowed.jwt_token)
      setIsFollowing(false)
      setFollowerCount(count => count - 1)
    }
  }
  return (
    <>
      <div className='view-account'>
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
          <Link
            className='topnav-item'
            to={isSelf || !isFollowing ? '/chat' : `/chats/${name}`}
          >
            {!isSelf && isFollowing ? `Chat with ${name}` : 'View Chats'}
          </Link>
          <Link className='topnav-item' to='#' onClick={handleLogout}>
            Logout
          </Link>
        </div>
        <div className='head_user'>
          <h2 id='user-name-inf_'> {isSelf ? `${name}(Me)` : name} </h2>
          <Image
            id='user_pfp_other'
            onError={() => setPfpUrl(`${URL}/pfps/default.jpg`)}
            src={userPfpUrl}
          />
          {/* React is weird... */}
          {!isSelf ? (
            <>
              <button onClick={follow} id='follow-user'>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <div className='infoFol'>
                <Link style={{ color: 'white' }} to={`/followers/${name}`}>
                  <h3>
                    <b>{followersCount}</b>
                  </h3>
                  <h4>Followers </h4>
                </Link>
              </div>
              <div className='infoPosts'>
                <h3>
                  <b>{postsCount}</b>
                </h3>
                <h4>Posts</h4>
              </div>
              <div className='infoFolw'>
                <Link style={{ color: 'white' }} to={`/following/${name}`}>
                  <h3>
                    <b style={{ marginLeft: 10, position: 'relative', top: 7 }}>
                      {followingCount}
                    </b>
                  </h3>
                  <h4>Following</h4>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className='infoFol'>
                <Link style={{ color: 'white' }} to={`/followers/${name}`}>
                  <h3 className='followers-count-self'>
                    <b>{followersCount}</b>
                    <h4>Followers </h4>
                  </h3>
                </Link>
                <div className='infoPosts'>
                  <h3>
                    <b>{postsCount}</b>
                  </h3>
                  <h4>Posts</h4>
                </div>
              </div>
              <div className='infoFolw'>
                <Link style={{ color: 'white' }} to={`/following/${name}`}>
                  <h3>
                    <b style={{ marginLeft: 10, position: 'relative', top: 7 }}>
                      {followingCount}
                    </b>
                  </h3>
                  <h4>Following</h4>
                </Link>
              </div>
            </>
          )}
        </div>
        <hr />
        {userExists ? (
          <>
            {postsCount === 0 ? (
              <h3>{name} doesn't have any posts yet...</h3>
            ) : (
              <>
                {posts.map((post, postKey) => (
                  <>
                    <Link to={`/posts/${post.id}`}>
                      <img
                        className='user_post'
                        src={post.image_id}
                        alt='Post not found'
                      />
                    </Link>
                  </>
                ))}
              </>
            )}
          </>
        ) : (
          <h3>User Not Found :(</h3>
        )}
      </div>
    </>
  )
}

export default Account
