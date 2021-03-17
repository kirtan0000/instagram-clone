const PORT = window.location.href.split('/')[2].split(':')[1]
const isDev = PORT !== undefined
const URL = `${
  window.location.href.split('/')[0].split(':')[0]
}://${window.location.href
  .split('/')[2]
  .split(':')[0]
  .toLowerCase()}${isDev ? `:3034` : ''}${isDev ? '' : '/api'}`

export default URL
