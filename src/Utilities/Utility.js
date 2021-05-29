const { uploadPath } = require('../../uploadPath')
const uuid = require('uuid').v4

let uploadFile = async file => {
  if (file) {
    let fileExtention = file.mimetype
    fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
    file.name = uuid() + '.' + fileExtention
    return new Promise((resolve, reject) => {
      file.mv(uploadPath + file.name, err => {
        if (err) resolve(null)
        else resolve(file.name)
      })
    })
  } else return null
}

let uploadFiles = async files => {
  if (files)
    return new Promise((resolve, reject) => {
      files.forEach(file => {
        let fileExtention = file.mimetype
        fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
        file.name = uuid() + '.' + fileExtention
        file.mv(uploadPath + file.name + file.name, err => {
          if (err) console.log(err)
          else console.log('done')
        })
      });
    })
  else return null
}

let generateID = () => uuid()

module.exports = { uploadFile, uploadFiles, generateID }