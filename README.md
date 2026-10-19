# Passport Verification System

## About the Project

The Passport Verification System is a web-based application developed to manage passport details and document submissions. It provides a user-friendly interface for entering passport information and uses a backend server to process the data and store it in a MongoDB database.

The system helps organize passport records and maintain their verification status.

## Features

- Submit passport details through a web interface.
- Upload passport documents.
- Store passport information in MongoDB.
- Maintain passport verification status.
- Retrieve stored passport records.
- Connect the React frontend with the Express backend.

## Technologies Used

**Frontend**
- React.js
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- Multer

**Database**
- MongoDB
- Mongoose

**Other Tools**
- Visual Studio Code
- Git and GitHub
- MongoDB Compass

## Project Modules

1. **Passport Details Management** – Handles passport information submitted by the user.
2. **Document Upload** – Supports uploading passport documents.
3. **Passport Verification Status** – Maintains the status of submitted passport records.
4. **Database Management** – Stores and retrieves passport details using MongoDB.

## Prerequisites

Install the following software before running the project:

- Node.js and npm
- MongoDB
- Visual Studio Code (recommended)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gopika47/passport-verification.git
cd passport-verification
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/passport_verification
PORT=5000
```

Make sure MongoDB is running on your system.

### 4. Start the Backend Server

From the `backend` folder, run:

```bash
node server.js
```

The backend server runs on:

`http://localhost:5000`

### 5. Install Frontend Dependencies

Open a new terminal in the project folder and run:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

## Database

- **Database Name:** `passport_verification`
- **Database:** MongoDB
- **Model:** Passport

Passport records include details such as the applicant's name, passport number, date of birth, nationality, address, and verification status, depending on the fields implemented in the application.

## API Endpoints

The following endpoints apply if the backend uses the `/api/passports` and `/api/uploads` routes.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check whether the backend server is running |
| POST | `/api/passports` | Submit passport details |
| GET | `/api/passports` | Retrieve passport records |
| POST | `/api/uploads` | Upload a passport document |

## Future Enhancements

- Integrate OCR to extract passport details automatically.
- Add stronger document validation.
- Implement secure user authentication.
- Add an administrator dashboard for reviewing passport submissions.
- Improve verification tracking and reporting.

## Author

**Gopika Sasikumar**

GitHub: [gopika47](https://github.com/gopika47)

## Disclaimer

This project is intended for educational purposes. Use fictional passport details and sample documents during testing. Do not upload real passport information to an unsecured development environment.
