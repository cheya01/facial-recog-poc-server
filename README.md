# Facial Recognition Visitor Management System - Server

A Node.js Express server for managing visitor registration and facial recognition verification.

## Features

- **Visitor Registration**: Register visitors with personal details and face photo
- **Face Verification**: Verify visitor identity by comparing live face capture with pre-registered photo
- **Date-based Queries**: Retrieve visitors scheduled for specific dates
- **AWS S3 Integration**: Store visitor photos securely in S3
- **MongoDB Integration**: Store visitor data in MongoDB
- **Python Microservice Integration**: Use Python service for face comparison

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **AWS S3** for image storage
- **Multer** for file upload handling
- **Axios** for HTTP requests to Python microservice
- **Python Microservice** for facial recognition (separate service)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- AWS Account with S3 access
- Python microservice running on port 5001 (for face comparison)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fr-poc-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - Set your MongoDB connection string
   - Add AWS S3 credentials and bucket details
   - Configure Python service URL

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### 1. Register Visitor
**POST** `/api/visitors`

Registers a new visitor with their details and face photo.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `fullName`: String
  - `email`: String
  - `phoneNumber`: String
  - `scheduledAt`: Date (ISO format)
  - `image`: File (face photo)

**Response:**
```json
{
  "_id": "visitor-id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "scheduledAt": "2025-11-13T00:00:00.000Z",
  "imageUrl": "https://bucket.s3.region.amazonaws.com/image.jpg",
  "registeredAt": "2025-11-06T10:30:00.000Z"
}
```

### 2. Get Visitor by ID
**GET** `/api/visitors/:id`

Retrieves a specific visitor by their MongoDB ObjectId.

**Response:**
```json
{
  "_id": "visitor-id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "scheduledAt": "2025-11-13T00:00:00.000Z",
  "imageUrl": "https://bucket.s3.region.amazonaws.com/image.jpg",
  "registeredAt": "2025-11-06T10:30:00.000Z"
}
```

### 3. Get Visitors by Date
**GET** `/api/visitors?date=YYYY-MM-DD`

Retrieves all visitors scheduled for a specific date.

**Example:** `/api/visitors?date=2025-11-13`

**Response:**
```json
[
  {
    "_id": "visitor-id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "scheduledAt": "2025-11-13T10:00:00.000Z",
    ...
  }
]
```

### 4. Verify Visitor
**POST** `/api/visitors/verify`

Verifies a visitor's identity by comparing their live face capture with pre-registered photo.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `id`: String (MongoDB ObjectId of the visitor)
  - `image`: File (live face capture)

**Response:**
```json
{
  "match": true,
  "confidence": 0.95,
  "visitorId": "visitor-id",
  "visitorName": "John Doe"
}
```

## Project Structure

```
fr-poc-server/
├── src/
│   ├── config/
│   │   └── multer.config.js      # Multer configuration for file uploads
│   ├── controllers/
│   │   └── visitor.controller.js # Business logic for visitor operations
│   ├── models/
│   │   └── visitor.model.js      # Mongoose schema for visitors
│   ├── routes/
│   │   └── visitor.routes.js     # API route definitions
│   ├── utils/
│   │   └── streamToBuffer.js     # Helper to convert streams to buffers
│   └── index.js                  # Application entry point
├── .env                          # Environment variables (not in repo)
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies
└── README.md                     # Project documentation
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `MONGO_URI` | MongoDB connection string |
| `BUCKET_NAME` | AWS S3 bucket name |
| `BUCKET_REGION` | AWS S3 bucket region |
| `ACCESS_KEY` | AWS access key ID |
| `SECRET_KEY` | AWS secret access key |
| `PYTHON_SERVICE_URL` | URL of Python face comparison service |

## Security Notes

⚠️ **Important**: 
- Never commit your `.env` file to version control
- Keep your AWS credentials and MongoDB connection string secure
- Use IAM roles with minimal required permissions for AWS
- Implement rate limiting and authentication in production
- Validate and sanitize all user inputs

## Dependencies

### Production
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `@aws-sdk/client-s3`: AWS S3 client
- `multer`: File upload middleware
- `axios`: HTTP client
- `dotenv`: Environment variable management
- `cors`: Cross-origin resource sharing
- `morgan`: HTTP request logger

### Development
- `nodemon`: Auto-restart server on file changes

## Future Enhancements

- [ ] Add authentication and authorization
- [ ] Implement rate limiting
- [ ] Add input validation middleware
- [ ] Create comprehensive test suite
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement logging system
- [ ] Add visitor check-in/check-out tracking
- [ ] Support multiple face enrollment per visitor

## License

ISC

## Author

[Your Name]
