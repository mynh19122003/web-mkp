import { MongoClient } from 'mongodb'

let client: MongoClient | null = null

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient('mongodb://localhost:27017')
    await client.connect()
  }
  return client
}

export async function getUserByEmail(email: string) {
  try {
    const client = await getMongoClient()
    const db = client.db('watchlistdb')
    const user = await db.collection('users').findOne({ email })
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const client = await getMongoClient()
    const db = client.db('watchlistdb')
    const { ObjectId } = require('mongodb')
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) })
    return user
  } catch (error) {
    console.error('Error getting user by id:', error)
    return null
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password?: string
  image?: string
  provider?: string
  phone?: string
}) {
  try {
    const client = await getMongoClient()
    const db = client.db('watchlistdb')
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: userData.email })
    if (existingUser) {
      return existingUser
    }

    const newUser = {
      ...userData,
      watchlist: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('users').insertOne(newUser)
    return { ...newUser, _id: result.insertedId }
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function updateUserWatchlist(email: string, watchlist: string[]) {
  try {
    const client = await getMongoClient()
    const db = client.db('watchlistdb')
    await db.collection('users').updateOne(
      { email },
      { $set: { watchlist } }
    )
    return true
  } catch (error) {
    console.error('Error updating watchlist:', error)
    return false
  }
}