const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select user_id, email from users')

    return res.status(200).json({
      success: true,
      users: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await db.query('insert into users(email,password) values ($1 , $2)', [
      email,
      hashedPassword,
    ])

    return res.status(201).json({
      success: true,
      message: 'The registraion was succefull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}
let stat=0
exports.login = async (req, res) => {
  let user = req.user
  stat=user.stat
  let payload = {
    id: user.user_id,
    email: user.email,
  }
  try {
    const token = await sign(payload, SECRET)
    tmp=user.info
    if (stat==1)
    return res.status(202).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in as admin',
    })
    else return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in as user',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.protected = async (req, res) => {
  try {
    if (stat==1)
    return res.status(200).json({
      info: 'info for admins',
    })
    else   return res.status(200).json({
        info: 'info for users',
      })
  } catch (error) {
    console.log(error.message)
  }
}

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}
