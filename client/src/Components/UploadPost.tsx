import React, { useState, useEffect } from 'react'
import '../Styles/HomePage.css'
import URL from '../Util/API_BASE'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Dark from '../Util/Dark'
import '../Styles/UploadPost.css'
import { Link } from 'react-router-dom'
import handleError from '../Util/HandleError'
import EditFavicon from '../Util/EditFavicon'

const UploadPost: React.FC = () => {
  const [current_title, setCurrentTitle] = useState('')
  const setTitle = (event: any) => setCurrentTitle(event.target.value)

  useEffect(() => {
    Dark()
    EditFavicon('/favicon.ico')
    document.title = 'Upload Post | Instagram Clone' // Stupid client side rendering doesn't let me use the <title> tag🙄
  }, [])

  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'

  var jwt_token = localStorage.getItem('jwt_token') || ''
  var refresh_token = localStorage.getItem('refresh_token') || ''
  const submitPost = async (event: any) => {
    event.preventDefault()

    const imageFile = event.target.post.files[0]
    const imageExtension = imageFile?.name?.split('.')
      ? imageFile?.name?.split('.')[1]
      : ''
    if (
      imageExtension?.toLowerCase() !== 'jpg' &&
      imageExtension !== 'png' &&
      imageExtension !== 'jpeg'
    ) {
      handleError('Only images are allowed', 'Invalid file', false)
      return
    }

    let upload_post_form = new FormData()
    upload_post_form.append('post', imageFile)

    const upload_new = await fetch(`${URL}/upload-post-image`, {
      method: 'POST',
      body: upload_post_form,
      redirect: 'follow'
    })
    const upload_parsed = await upload_new.json()
    if (!upload_parsed.success) {
      handleError(upload_parsed.message, 'Error', false)
      return
    }

    const post_image_uri = upload_parsed.uri
    let postparams = new URLSearchParams()
    postparams.append('jwt_token', jwt_token)
    postparams.append('refresh_token', refresh_token)
    postparams.append('img_url', post_image_uri)
    postparams.append('title', current_title)

    const new_post = await fetch(`${URL}/upload-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: postparams,
      redirect: 'follow'
    })
    const new_post_parsed = await new_post.json()

    if (!new_post_parsed.success) {
      handleError(new_post_parsed.message, 'Error', false)
      return
    }
    if (new_post_parsed.needs_new_jwt === true)
      localStorage.setItem('jwt_token', new_post_parsed.jwt_token)
    const new_post_id = new_post_parsed.id
    window.location.href = `../posts/${new_post_id}`
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
        <Link className='topnav-item' to='/feed'>
          My Feed
        </Link>
        <Link className='topnav-item' to='/search/users'>
          Search For Users
        </Link>
      </div>
      <div className='box box-shadow full-center'>
        <h1 id='upload-head' className='box-title'>
          Upload Post
        </h1>
        <form onSubmit={submitPost}>
          <div className='form-group'>
            <label htmlFor='ttlPost'>Enter Title Name:</label>
            <input
              className='form-control form-animate'
              type='text'
              name='ttlPost'
              placeholder='Title Name Here...'
              required={true}
              autoComplete='off'
              onChange={setTitle}
            ></input>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='post'>
              Upload Image:
            </label>
            <input
              className='form-control form-animate'
              type='file'
              name='post'
              id='post-file'
              accept='.png,.jpeg,.jpg'
              required={true}
            ></input>
          </div>
          <input
            type='submit'
            className='btn btn-success form-control form-animate'
            value='Post!'
            id='post-btn'
          ></input>
        </form>
      </div>
    </>
  )
}

export default UploadPost
