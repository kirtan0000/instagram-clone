import React, { useState } from 'react'
import '../Styles/Account.css'
import URL from '../Util/API_BASE'
import Dark from '../Util/Dark'
import EditFavicon from '../Util/EditFavicon'

const SignUp: React.FC = () => {
  Dark()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [errorMessage, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  EditFavicon('/favicon.ico')

  const onEmailChange = (event: any) => setEmail(event.target.value)
  const onPasswordChange = (event: any) => setPassword(event.target.value)
  const onUsernameChange = (event: any) => setUsername(event.target.value)
  const onConfirmPasswordChange = (event: any) =>
    setConfirmPassword(event.target.value)

  const setChecked = () => {
    if (!showPass) setShowPass(true)
    else setShowPass(false)
  }

  document.title = 'Sign Up | Instagram Clone'
  if (
    localStorage.getItem('jwt_token') &&
    localStorage.getItem('refresh_token')
  )
    window.location.href = '..'

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (confirmPassword !== password) {
      setError('The passwords do not match.')
      return
    }
    const urlencoded = new URLSearchParams()
    urlencoded.append('email', email)
    urlencoded.append('password', password)
    urlencoded.append('username', username)

    const signUpUser = await fetch(`${URL}/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: urlencoded,
      redirect: 'follow'
    })
    const signUpData = await signUpUser.json()

    if (!signUpData.success) {
      setError(signUpData.message)
    } else {
      localStorage.setItem('jwt_token', signUpData.data.jwt_token)
      localStorage.setItem('refresh_token', signUpData.data.refresh_token)
      window.location.href = '..'
    }
  }

  return (
    <>
      {' '}
      <div className='topnav theme-reverse topnav-shadow'>
        <span className='topnav-brand'>Instagram Clone</span>
        <span className='topnav-hamburger-menu' data-target='myTopnav'>
          ☰
        </span>
        <div className='topnav-right' id='myTopnav'></div>
      </div>
      <div id='form'>
        <div className='centeredForm'>
          <h1 id='heading-acc-manage' className='celestial-gradient-text'>
            Sign Up to Instagram Clone
          </h1>
          <div className='box theme-reverse'>
            <div className='box'>
              <div className='tab' data-tab='formTab'></div>
              <div className='tab-contents' id='formTab'>
                <div id='login' className='tab-content tab-content-active'>
                  <form onSubmit={handleSubmit}>
                    <div className='form-group form-animate'>
                      <label
                        htmlFor='login-username'
                        className='form-label endless-river-gradient-text'
                      >
                        Username
                      </label>
                      <input
                        className='input-animate'
                        id='login-username'
                        placeholder='SomeNameHere'
                        required={true}
                        onChange={onUsernameChange}
                      />
                    </div>
                    <div className='form-group form-animate'>
                      <label
                        htmlFor='login-username'
                        className='form-label endless-river-gradient-text'
                      >
                        Email
                      </label>
                      <input
                        type='email'
                        className='input-animate'
                        id='login-email'
                        placeholder='test@example.com'
                        required={true}
                        onChange={onEmailChange}
                      />
                    </div>
                    <div className='form-group form-animate'>
                      <label
                        htmlFor='login-password'
                        className='form-label endless-river-gradient-text'
                      >
                        Password
                      </label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className='input-animate emerald-gradient-text'
                        id='login-password'
                        placeholder='SuperSecretPassword'
                        onChange={onPasswordChange}
                        required={true}
                      />
                    </div>
                    <div className='form-group form-animate'>
                      <label
                        htmlFor='login-password'
                        className='form-label endless-river-gradient-text'
                      >
                        Confirm Password
                      </label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className='input-animate emerald-gradient-text'
                        id='login-password'
                        placeholder='SuperSecretPassword'
                        onChange={onConfirmPasswordChange}
                        required={true}
                      />
                    </div>
                    <h2
                      className='royal-gradient-text'
                      style={{ marginLeft: 20 }}
                    >
                      Show Password
                    </h2>
                    <input
                      type='checkbox'
                      name='showPassword'
                      checked={showPass}
                      onChange={setChecked}
                      id='showPass'
                    />
                    <h3 style={{ marginLeft: 20 }}>
                      Already have an account?
                      <a href='../login'>
                        <h4
                          style={{
                            display: 'inline-block',
                            marginLeft: 5,
                            fontSize: 25
                          }}
                        >
                          Login Here!
                        </h4>
                      </a>
                    </h3>
                    <div className='form-group'>
                      <button
                        type='submit'
                        className='btn form-control theme-adjust'
                      >
                        Login
                      </button>
                      <br />
                      <span id='err'>{errorMessage}</span>
                    </div>
                  </form>
                </div>
                <div id='register' className='tab-content'>
                  <div
                    id='helloWorld'
                    className='tab-content tab-content-active'
                  >
                    <form onSubmit={handleSubmit}>
                      <div className='form-group form-animate'>
                        <label htmlFor='reg-username' className='form-label'>
                          Username
                        </label>
                        <input
                          type='text'
                          className='input-animate'
                          id='reg-username'
                          required={true}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mb-5'></div>
        </div>
      </div>
      <p id='message-fire-ui'>
        <b>
          Website designed with{' '}
          <a href='https://fire-ui.netlify.app/'>Fire UI</a>
        </b>
      </p>
    </>
  )
}

export default SignUp
