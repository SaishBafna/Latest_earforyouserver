import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Decode the base64-encoded service account key
const serviceAccountKey = Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
const key = JSON.parse(serviceAccountKey);
// console.log(key);
// Initialize Google Cloud Storage using the parsed key JSON
const storage = new Storage({
  credentials: key, 
  projectId: process.env.GCP_PROJECT_ID, 
});

const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export { bucket };
