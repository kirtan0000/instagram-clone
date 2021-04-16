import React, { useState, useEffect } from 'react'
import URL from '../Util/API_BASE'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Dark from '../Util/Dark'
import { Link } from 'react-router-dom'
import handleError from '../Util/HandleError'
import '../Styles/Post.css'
import EditFavicon from '../Util/EditFavicon'
import not_liked from '../Images/like.png'
import liked from '../Images/filled-like.png'
import comment from '../Images/comment.png'

const Post: React.FC = () => {
  const [title, changeTitle] = useState('')
  const [imageUrl, changeImageUrl] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorPfp, setAuthorPfp] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [likeAmount, setLikeAmount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [comments, setComments] = useState([])
  const [commentAmount, setCommentAmount] = useState(0)

  var id = window.location.href.split('/')[4]
  var jwt_token = localStorage.getItem('jwt_token') || ''
  var refresh_token = localStorage.getItem('refresh_token') || ''

  const updateCommentInput = (event: any) => setCommentInput(event.target.value)

  useEffect(() => {
    document.title = 'Post | Instagram Clone'

    Dark()
    async function getPostData () {
      const get_post_options = new URLSearchParams()
      get_post_options.append('jwt_token', jwt_token)
      get_post_options.append('refresh_token', refresh_token)
      const post_data_raw = await fetch(`${URL}/get-post/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: get_post_options,
        redirect: 'follow'
      })
      const post_data = await post_data_raw.json()

      if (!post_data.exists) {
        if (post_data.message === 'User Not Found!') {
          window.location.href = '/login'
          return
        }
        handleError(post_data.message, 'Not Found', false, () => {
          window.location.href = '/'
          return
        })
      } else {
        if (post_data.needs_new_jwt === true)
          localStorage.setItem('jwt_token', post_data.jwt_token)
        changeTitle(post_data.data.title)
        changeImageUrl(post_data.data.image_url)
        EditFavicon(post_data.data.image_url)
        setAuthorName(post_data.data.author)
        setAuthorPfp(post_data.data.pfp)
        setTimestamp(post_data.data.timestamp)
        setLikeAmount(post_data.data.likes)
        setHasLiked(post_data.hasUserLiked)
        setComments(post_data.data.comments)
        setCommentAmount(post_data.data.comment_count)
        document.title = `${post_data.data.title} | Instagram Clone`
      }
    }
    getPostData()
  }, [])

  const handleLikeClick = async () => {
    if (hasLiked) {
      const unlike_options = new URLSearchParams()
      unlike_options.append('jwt_token', jwt_token)
      unlike_options.append('refresh_token', refresh_token)
      const unparsed_unlike = await fetch(`${URL}/unlike/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: unlike_options,
        redirect: 'follow'
      })
      const unlike_parsed = await unparsed_unlike.json()
      if (!unlike_parsed.success) {
        handleError(unlike_parsed.message, 'Error', false)
        return
      }
      if (unlike_parsed.needs_new_jwt === true)
        localStorage.setItem('jwt_token', unlike_parsed.jwt_token)
      setHasLiked(false)
      setLikeAmount(count => count - 1)
    } else {
      const like_options = new URLSearchParams()
      like_options.append('jwt_token', jwt_token)
      like_options.append('refresh_token', refresh_token)
      const unparsed_like = await fetch(`${URL}/like/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: like_options,
        redirect: 'follow'
      })
      const like_parsed = await unparsed_like.json()
      if (!like_parsed.success) {
        handleError(like_parsed.message, 'Error', false)
        return
      }
      if (like_parsed.needs_new_jwt === true)
        localStorage.setItem('jwt_token', like_parsed.jwt_token)

      setHasLiked(true)
      setLikeAmount(count => count + 1)
    }
    document
      .querySelector<HTMLElement>('#like_post_img')
      .classList.add('pop_img')

    setTimeout(() => {
      try {
        document
          .querySelector<HTMLElement>('#like_post_img')
          .classList.remove('pop_img')
      } catch (error) {}
    }, 600)
  }

  const handleCommentClick = () =>
    document.getElementsByClassName('comments')[0].scrollIntoView()

  const submitNewComment = async () => {
    if (
      commentInput === '' ||
      !commentInput.replace(/\s/g, '').length ||
      commentInput.length < 1
    ) {
      handleError(
        'The comment must have 1 or more characters.',
        'Invalid Comment',
        false
      )
      return
    }
    if (commentInput.length > 70) {
      handleError(
        'The comment must have less than 70 characters.',
        'Invalid Comment',
        false
      )
      return
    }
    const comment_options = new URLSearchParams()
    comment_options.append('jwt_token', jwt_token)
    comment_options.append('refresh_token', refresh_token)
    comment_options.append('content', commentInput)
    const comment_data_raw = await fetch(`${URL}/comment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: comment_options,
      redirect: 'follow'
    })
    const comment_parsed = await comment_data_raw.json()
    if (!comment_parsed.success) {
      handleError(comment_parsed.message, 'Error', false)
      return
    }
    if (comment_parsed.needs_new_jwt === true)
      localStorage.setItem('jwt_token', comment_parsed.jwt_token)

    let new_comment_section = comments
    new_comment_section.unshift(comment_parsed.data)
    setComments(new_comment_section)
    setCommentAmount(count => count + 1)
    setCommentInput('')
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
        <div className='topnav-right' id='myTopnav'></div>
        <Link className='topnav-item' to={`/user/${authorName}`}>
          View {authorName}'s profile
        </Link>
        <Link className='topnav-item' to='/upload-post'>
          Create Post
        </Link>
        <Link className='topnav-item' to='/search/users'>
          Search For Users
        </Link>
      </div>
      <div className='container'>
        <div className='contents'>
          <div className='row'>
            <div className='col-3'>
              <div data-theme='dark' className='card card_post_page'>
                <div className='author-info'>
                  <Link to={`../user/${authorName}`}>
                    <img
                      src={authorPfp}
                      alt='Author Pfp Not Found'
                      id='authorPostPfp'
                      style={{ float: 'left' }}
                    />
                    <h3 style={{ marginTop: 20 }}>{authorName}</h3>
                  </Link>
                </div>
                <h1 className='card-title title-single-post'>{title}</h1>
                <hr id='sep-img-to-title' />
                <br />
                <img
                  id='post_img_single'
                  src={imageUrl}
                  alt='Post Image Not Found'
                />
                <br />
                <img
                  id='like_post_img'
                  src={hasLiked ? liked : not_liked}
                  onClick={handleLikeClick}
                  alt='Like'
                ></img>
                <img
                  id='comment_img'
                  src={comment}
                  onClick={handleCommentClick}
                  alt='Comments'
                ></img>
                <div id='info_post_single'>
                  <h3 className='bold-text'>
                    {likeAmount === 1
                      ? `${likeAmount} like`
                      : `${likeAmount} likes`}
                  </h3>
                  <h3 className='bold-text'>
                    {commentAmount === 1
                      ? `${commentAmount} comment`
                      : `${commentAmount} comments`}
                  </h3>
                </div>
                <div style={{ paddingTop: 40 }} className='time-info-all'>
                  <hr id='sep-time-to-img' style={{ paddingBottom: 0 }} />
                  <span>Posted on {timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <textarea
        id='comment-inp'
        placeholder='Say Something Nice!'
        onChange={updateCommentInput}
        value={commentInput}
      ></textarea>
      <button onClick={submitNewComment} id='submit-comment-post'>
        Comment
      </button>
      <div className='comments'>
        {commentAmount === 0 ? (
          <h2>No Comments Yet...</h2>
        ) : (
          <>
            {comments.map(comment => (
              <>
                <br />

                <div className='comment-full-all'>
                  <div className='commentAuthor'>
                    <Link to={`/user/${comment['author']}`}>
                      <img
                        className='pfp'
                        src={comment['pfp']}
                        alt={comment['username']}
                      ></img>
                      <h3 className='authorNameComment'>{comment['author']}</h3>
                    </Link>
                    <br />
                  </div>
                  <h4 className='comment-data'>{comment['content']}</h4>
                  <span className='comment-data-info'>
                    Commented on {comment['date']}
                  </span>
                  <hr className='comment-seperator' />
                </div>
              </>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Post
