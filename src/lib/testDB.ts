// In-memory database cho testing
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

let mongoServer: MongoMemoryServer
let mongoClient: MongoClient

export async function startTestDB() {
  try {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    
    mongoClient = new MongoClient(mongoUri)
    await mongoClient.connect()
    
    console.log('🚀 In-memory MongoDB started:', mongoUri)
    return mongoUri
  } catch (error) {
    console.error('❌ Failed to start test DB:', error)
    throw error
  }
}

export async function stopTestDB() {
  if (mongoClient) {
    await mongoClient.close()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
}

export { mongoClient }