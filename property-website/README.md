# Property Manager Website

A clean ReactJS website for property management with user signup and property upload functionality.

## Features

- **User Signup**: Create accounts with different user types (Agent, Owner, EndUser, Investor)
- **Property Upload**: Upload property listings with detailed information and images
- **Responsive Design**: Mobile and desktop friendly interface
- **Modern UI**: Built with TailwindCSS for a clean, professional look

## Pages

### 1. Signup Page (`/signup`)
- Full Name input
- Email input
- Mobile Number input
- User Type selection (Agent, Owner, EndUser, Investor)
- Password input
- Form validation and error handling
- Redirects to Property Upload page on successful signup

### 2. Property Upload Page (`/upload-property`)
- Property Title
- Description
- Category (Residential/Commercial)
- SubCategory (dynamic based on category)
- Price
- Carpet Area
- Number of Bathrooms
- Number of Rooms
- Address
- Image Upload (multiple images)
- Success/error messaging

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Backend API

The frontend expects a backend API running on `http://localhost:3001` with the following endpoints:

#### Signup Endpoint
- **URL**: `POST /api/auth/signup`
- **Body**: 
  ```json
  {
    "fullName": "string",
    "email": "string",
    "mobileNumber": "string",
    "userType": "Agent|Owner|EndUser|Investor",
    "password": "string"
  }
  ```

#### Property Upload Endpoint
- **URL**: `POST /api/properties`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with property details and images

## Project Structure

```
src/
├── components/
│   ├── SignupPage.tsx      # User registration form
│   └── PropertyUploadPage.tsx  # Property upload form
├── App.tsx                 # Main app component with routing
├── index.tsx              # App entry point
└── index.css              # Global styles with TailwindCSS
```

## API Integration

The application is configured to work with a backend API that matches the entity structures from your TypeORM entities:

- **UserAuth Entity**: Matches the signup form fields
- **Property Entity**: Matches the property upload form fields

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
REACT_APP_API_URL=http://localhost:3001
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
