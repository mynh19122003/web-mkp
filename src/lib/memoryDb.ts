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