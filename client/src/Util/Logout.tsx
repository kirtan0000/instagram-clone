import React from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

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

export default handleLogout
