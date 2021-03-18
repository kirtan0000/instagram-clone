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
import '../Styles/MyFeed.css'

const MyFeed: React.FC = () => {
  const [allPosts, setAllPosts] = useState([])

  var jwt_token = localStorage.getItem('jwt_token') || ''
  var refresh_token = localStorage.getItem('refresh_token') || ''
  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'
  useEffect(() => {
    Dark()
    document.title = 'My Feed | Instagram Clone'
    EditFavicon('/favicon.ico')
    async function get_all_data () {
      const feedInfoParams = new URLSearchParams()
      feedInfoParams.append('jwt_token', jwt_token)
      feedInfoParams.append('refresh_token', refresh_token)

      const myFeedUnparsed = await fetch(`${URL}/get-my-feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: feedInfoParams,
        redirect: 'follow'
      })
      const myFeed = await myFeedUnparsed.json()
      if (!myFeed.success) {
        handleError(myFeed.message, 'Error', false)
      }
      if (myFeed.needs_new_jwt === true)
        localStorage.setItem('jwt_token', myFeed.jwt_token)
      setAllPosts(myFeed.data)
    }
    get_all_data()
  }, [])
  const handleLikeClick = async (index: number, id: string) => {
    let new_data = allPosts

    for (let i = 0; i < new_data.length; i++) {
      if (new_data[i]['id'] === id) {
        if (!new_data[i]['hadLiked']) {
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
          new_data[i]['hadLiked'] = true
          new_data[i]['like_count']++
        } else {
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
          new_data[i]['hadLiked'] = false
          new_data[i]['like_count']--
        }
      }
    }
    // This works
    setAllPosts([])
    setAllPosts(prevPosts => [...prevPosts, ...new_data]) // idk why it works

    document.getElementsByClassName('like_type')[index].classList.add('pop_img')

    setTimeout(function () {
      try {
        document
          .getElementsByClassName('like_type')
          [index].classList.remove('pop_img')
      } catch (error) {}
    }, 600)
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
      </div>
      {allPosts.map((post, index) => (
        <>
          <div className='container'>
            <div className='contents'>
              <div className='row'>
                <div className='col-3'>
                  <div
                    data-theme='dark'
                    className='card card_post_page card_all'
                  >
                    <div className='author-info'>
                      <Link to={`../user/${post.author}`}>
                        <img
                          src={post.pfp}
                          alt='Author Pfp Not Found'
                          id='authorPostPfp'
                          style={{ float: 'left' }}
                        />
                        <h3 style={{ marginTop: 20 }}>{post.author}</h3>
                      </Link>
                    </div>
                    <h1 className='card-title title-single-post'>
                      {post.title}
                    </h1>
                    <hr id='sep-img-to-title' />
                    <br />
                    <img
                      id='post_img_single'
                      src={post.image_id}
                      alt='Post Image Not Found'
                    />
                    <br />
                    <img
                      id='like_post_img_all'
                      className='like_post_in like_type'
                      src={post.hadLiked ? liked : not_liked}
                      onClick={() => handleLikeClick(index, post.id)}
                      alt='Like'
                      key={index}
                    ></img>
                    <Link to={`/posts/${post.id}`}>
                      <img
                        id='comment_img_all'
                        src={comment}
                        alt='Comments'
                      ></img>
                    </Link>
                    <div id='info_post_single'>
                      <h3 className='bold-text inf-all-post'>
                        {post.like_count === 1
                          ? `${post.like_count} like`
                          : `${post.like_count} likes`}
                      </h3>
                      <h3 className='bold-text inf-all-post'>
                        {post.comment_count === 1
                          ? `${post.comment_count} comment`
                          : `${post.comment_count} comments`}
                      </h3>
                    </div>
                    <br />
                    <span className='time-info-all'>Posted on {post.date}</span>
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  )
}

export default MyFeed
