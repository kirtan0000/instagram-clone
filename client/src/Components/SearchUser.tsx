import React, { useState, useEffect } from 'react'
import '../Styles/AccountPage.css'
import URL from '../Util/API_BASE'
import Dark from '../Util/Dark'
import { Link } from 'react-router-dom'
import '../Styles/SearchUser.css'
import handleError from '../Util/HandleError'
import EditFavicon from '../Util/EditFavicon'

const SearchUser: React.FC = () => {
  const [searchVal, setSearchVal] = useState('')
  const [results, setResults] = useState([])
  const [resultsAmount, setResultsAmount] = useState('')
  EditFavicon('/favicon.ico')

  if (
    localStorage.getItem('jwt_token') === null ||
    localStorage.getItem('refresh_token') === null
  )
    window.location.href = '../login'
  const search = async () => {
    if (searchVal === '' || !searchVal.replace(/\s/g, '').length) {
      handleError('Please enter a valid username.', 'Invalid Username', false)
      return
    }
    const resultsUnparsed = await fetch(`${URL}/search-user/${searchVal}`)
    const resultsParsed = await resultsUnparsed.json()
    if (!resultsParsed.success) {
      handleError(resultsParsed.message, 'Error', false)
      return
    }
    setResults(resultsParsed.results)
    setResultsAmount(`Total Results: ${resultsParsed.amount}`)
  }
  const handleInputChange = (event: any) => {
    setSearchVal(event.target.value)
  }
  useEffect(() => {
    Dark()
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
      </div>
      <input
        onChange={handleInputChange}
        id='search_user'
        placeholder='Search For Username...'
      ></input>
      <button
        id='search-user-btn'
        className='btn btn-success btn-hover'
        onClick={search}
      >
        Search Name
      </button>
      {parseInt(resultsAmount.split(' ')[2]) === 0 ? (
        <>
          <h3 id='results-not-found-search'>
            No users were found with that specific query. Please check your
            spelling and try again.
          </h3>
        </>
      ) : (
        <>
          <h2>{resultsAmount}</h2>
          {results.map(result => (
            <>
              <div className='user-search-inf-result'>
                <Link to={`/user/${result['username']}`}>
                  <img className='pfp' src={result['pfp']} alt=''></img>
                </Link>

                <span className='user_name_search'>
                  {' '}
                  <Link to={`/user/${result['username']}`}>
                    {result['username']}
                  </Link>
                </span>
              </div>
              <hr />
            </>
          ))}
        </>
      )}
    </>
  )
}

export default SearchUser
