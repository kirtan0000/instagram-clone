import React from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

const handleError = (
  err: string,
  title: string = 'Error!',
  redirect: boolean = true,
  onC: any = () => {
    if (redirect) {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('refresh_token')
      window.location.href = `${window.location.protocol}//${window.location.host}/login`
    }
  }
) => {
  confirmAlert({
    title: title,
    message: err,
    buttons: [
      {
        label: 'Ok',
        onClick: onC
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

export default handleError
