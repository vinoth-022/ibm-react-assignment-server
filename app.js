import express, { json } from 'express'
import { readFileSync, writeFile } from 'fs'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(json())

const USERS_FILE = './users.json'

// Load users from JSON file
let users = []
try {
  const data = readFileSync(USERS_FILE, 'utf8')
  users = JSON.parse(data)
} catch (err) {
  console.error("Error reading users file", err)
}


app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Find user by username
  const user = users.find(u => u.username === username)

  if (user && user.password === password) {
    // Successful login
    res.status(200).json({ message: `Welcome ${username}! You've logged in successfully!` })
  } else {
    // Invalid credentials
    res.status(401).json({ message: 'Invalid credentials' })
  }
})


// Register endpoint
app.post('/register', (req, res) => {
  console.log("Ran post")
  const { username, password, email } = req.body

  // Add new user
  users.push({ username, password, email })

  // Write users back to file
  writeFile(USERS_FILE, JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing users file", err)
      res.status(500).send('Error registering user')
    } else {
      console.log('User registered successfully')
      res.sendStatus(200)
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
