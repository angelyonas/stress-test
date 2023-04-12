const axios = require('axios')
const { rest } = require('../config')

const getInstanceVtexAPI = () => {
  const { URI_VTEX_API, API_KEY_VTEX, API_TOKEN_VTEX } = rest
  return axios.create({
    baseURL: URI_VTEX_API,
    headers: {
      'X-VTEX-API-AppKey': API_KEY_VTEX,
      'X-VTEX-API-AppToken': API_TOKEN_VTEX
    }
  })
}

module.exports = {
  getInstanceVtexAPI
}
