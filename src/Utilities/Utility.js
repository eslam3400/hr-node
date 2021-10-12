const { uploadPath } = require('../../uploadPath')
const uuid = require('uuid').v4

let uploadFiles = async (filesObj, formName) => {
  if (filesObj) {
    return new Promise((resolve, reject) => {
      let file = filesObj[formName]
      console.log(file)
      let fileExtention = file.mimetype
      fileExtention = fileExtention.slice(fileExtention.indexOf("/") + 1)
      file.name = 'report.csv'
      file.mv(uploadPath + file.name, err => {
        if (err) console.log(err)
        else resolve(file.name)
      })
    })
  }
  else return null
}

let generateID = () => uuid()

module.exports = { uploadFiles, generateID }