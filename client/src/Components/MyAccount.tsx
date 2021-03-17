import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import '../Styles/HomePage.css'
import URL from '../Util/API_BASE'
import { confirmAlert } from 'react-confirm-alert'
import Dark from '../Util/Dark'
import handleError from '../Util/HandleError'
import { Link } from 'react-router-dom'
import EditFavicon from '../Util/EditFavicon'

const MyAccount: React.FC = () => {
  const [name, changeName] = useState('')
  const [userPfpUrl, setPfpUrl] = useState('')
  const [posts, setPosts] = useState([])
  const [postsCount, setPostsCount] = useState(0)
  const [followersCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  document.title = 'My Account | Instagram Clone'
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

      changeName(userInfo.user_name)
      setPfpUrl(userInfo.user_pfp)
      EditFavicon(userInfo.user_pfp)
      setPosts(userInfo.user_posts)
      setPostsCount(userInfo.user_posts_length)
      setFollowerCount(userInfo.totalFollowersCount)
      setFollowingCount(userInfo.totalFollowingCount)
    }
    getUserInfo()
  }, [])

  const changePfpButton = () => {
    const realPfpUpload = document.querySelector<HTMLElement>('#upload_new_pfp')
    if (realPfpUpload !== null) realPfpUpload.click() // TypeScript forces you to check for null HTMLElements...
  }

  const newPfpUpload = async (event: any) => {
    const pfpFile = event.target.files[0]
    const extPfp = pfpFile?.name?.split('.') ? pfpFile?.name?.split('.')[1] : ''

    if (
      extPfp?.toLowerCase() !== 'jpg' &&
      extPfp !== 'png' &&
      extPfp !== 'jpeg'
    ) {
      handleError('Only images are allowed', 'Invalid file', false)
      return
    }

    let pfpFormdata = new FormData()
    pfpFormdata.append('pfp', pfpFile)

    const upload_pfp = await fetch(`${URL}/upload-pfp`, {
      method: 'POST',
      body: pfpFormdata,
      redirect: 'follow'
    })
    const done_upload = await upload_pfp.json()
    if (!done_upload.success) {
      handleError(done_upload.message, 'Error', false)
      return
    }
    const pfp_id = done_upload.id
    let change_pfp_params = new URLSearchParams()
    change_pfp_params.append('id', pfp_id)
    change_pfp_params.append('jwt_token', jwt_token)
    change_pfp_params.append('refresh_token', refresh_token)
    const change_pfp = await fetch(`${URL}/change-pfp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: change_pfp_params,
      redirect: 'follow'
    })
    const change_pfp_data = await change_pfp.json()

    if (!change_pfp_data.success) {
      handleError(change_pfp_data.message, 'Error', false)
      return
    }
    if (change_pfp_data.needs_new_jwt === true)
      localStorage.setItem('jwt_token', change_pfp_data.jwt_token)
    setPfpUrl(change_pfp_data.url)
  }
  const handleLogout = () => {
    confirmAlert({
      title: 'Are you sure?',
      message: 'Are you sure that you want to logout?',
      buttons: [
        {
          label: 'No',
          onClick: () => {}
        },
        {
          label: 'Yes',
          onClick: () => {
            localStorage.removeItem('jwt_token')
            localStorage.removeItem('refresh_token')
            window.location.href = `../login`
          }
        }
      ],
      childrenElement: () => <div />,
      closeOnEscape: false,
      closeOnClickOutside: false,
      willUnmount: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      overlayClassName: 'overlay-custom-class-name'
    })
  }
  return (
    <>
      <div className='topnav theme-reverse topnav-shadow'>
        <span className='topnav-brand'>Instagram Clone</span>
        <span className='topnav-hamburger-menu' data-target='myTopnav'>
          &#x2630;
        </span>
        <div className='topnav-right' id='myTopnav'></div>
        <Link className='topnav-item' to='/feed'>
          My Feed
        </Link>
        <Link className='topnav-item' to='/upload-post'>
          Create Post
        </Link>
        <Link className='topnav-item' to='/search/users'>
          Search For Users
        </Link>
        <Link className='topnav-item' to='#' onClick={handleLogout}>
          Logout
        </Link>
      </div>

      <div className='head'>
        <h2 id='user-head-name-me'> {name} </h2>
        <Image
          id='user_pfp'
          onError={() => setPfpUrl(`${URL}/pfps/default.jpg`)}
          src={userPfpUrl}
        />
      </div>
      <button id='showPfpModal' onClick={changePfpButton}>
        Change Profile Picture
      </button>
      <div className='infoFolMe'>
        <Link style={{ color: 'white' }} to={`/followers/${name}`}>
          <h3 className='followers-count-self'>
            <b style={{ marginLeft: 50 }}>{followersCount}</b>
            <h4>Followers</h4>
          </h3>
        </Link>
      </div>
      <div className='infoPostsMe'>
        <h3>
          <b style={{ marginLeft: 20, position: 'relative', top: 7 }}>
            {postsCount}
          </b>
        </h3>
        <h4>Posts</h4>
      </div>
      <div className='infoFolwMe'>
        <Link style={{ color: 'white' }} to={`/following/${name}`}>
          <h3>
            <b style={{ marginLeft: 46, position: 'relative', top: 7 }}>
              {followingCount}
            </b>
          </h3>
          <h4>Following</h4>
        </Link>
      </div>
      <input
        style={{ display: 'none' }}
        type='file'
        name='pfp'
        id='upload_new_pfp'
        accept='.png,.jpeg,.jpg'
        onChange={newPfpUpload}
      ></input>
      <hr />
      {postsCount === 0 ? (
        <h3>
          You don't have any posts yet...
          <br />
          <Link to='/upload-post'>Create One Now!</Link>
        </h3>
      ) : (
        <>
          {posts.map((post, postKey) => (
            <>
              <Link to={`/posts/${post.id}`}>
                <img
                  className='user_post_p'
                  src={post.image_id}
                  alt='Image not found'
                />
              </Link>
            </>
          ))}
        </>
      )}
    </>
  )
}

export default MyAccount
