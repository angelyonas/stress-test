const { readFile, readdir, writeFile } = require('fs').promises

const resolvePath = file => `logs/${file.replace(/[^-a-z0-9._(),]/gi, '')}`

const listLogFiles = async () => {
  try {
    return await readdir('logs')
  } catch (err) {
    throw new Error(err)
  }
}

const getLogFile = async file => {
  try {
    const pathFile = resolvePath(file)
    return await readFile(pathFile, 'utf8')
  } catch (err) {
    throw new Error(err)
  }
}

const cleanLogFile = async file => {
  try {
    const pathFile = resolvePath(file)
    return await writeFile(pathFile, '')
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  listLogFiles,
  getLogFile,
  cleanLogFile
}
