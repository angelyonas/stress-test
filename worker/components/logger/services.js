const fs = require('fs')

const logs = async ({ query }) => {
  const { file } = query
  if (file) {
    const data = await getLogFile(file)
    return data
  } else {
    const files = await listLogFiles()
    return files
  }
}
const listLogFiles = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir('logs', (err, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve(files)
    })
  })
}
const getLogFile = async (file) => {
  return new Promise((resolve, reject) => {
    file = file.replace(/[^-a-z0-9._(),]/gi, '')
    fs.readFile('logs/' + file, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

module.exports = {
  logs
}
