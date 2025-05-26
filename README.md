# RealEstate Hub - Full-Stack Real Estate Platform

A modern, full-stack real estate platform built with Next.js, MongoDB, and JWT authentication. Features property listings, user management, favorites, inquiries, and role-based access control.

## 🚀 Features

### Frontend
- **Modern UI**: Built with Next.js 13, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful components
- **Dark/Light Mode**: Theme switching with next-themes
- **Property Search**: Advanced filtering and search functionality
- **User Authentication**: Login/Register with JWT tokens
- **Role-based Dashboard**: Different interfaces for users, agents, and admins

### Backend
- **RESTful API**: Built with Next.js API routes
- **MongoDB Database**: Mongoose ODM for data modeling
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, Agent, and User roles
- **File Upload**: Support for property images
- **Data Validation**: Comprehensive input validation

### User Roles
- **Users**: Browse properties, save favorites, send inquiries
- **Agents**: Manage their property listings, respond to inquiries
- **Admins**: Full system access, user management, all properties

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **UI Components**: shadcn/ui, Lucide React icons
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd RealEstate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/realestate

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# App Settings
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env.local with your Atlas connection string
```

### 5. Seed the Database
```bash
npm run seed
```

This will create sample users and properties. Test accounts:
- **Admin**: admin@realestatehub.com / admin123
- **Agent 1**: sarah.johnson@realestatehub.com / agent123  
- **Agent 2**: michael.chen@realestatehub.com / agent123
- **User**: john.doe@example.com / user123

### 6. Start the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── properties/    # Property CRUD operations
│   │   ├── favorites/     # User favorites
│   │   └── inquiries/     # Property inquiries
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── properties/       # Property listing pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   ├── home/             # Homepage components
│   └── properties/       # Property-related components
├── lib/                  # Utility libraries
│   ├── models/           # MongoDB/Mongoose models
│   ├── contexts/         # React contexts
│   ├── middleware/       # API middleware
│   └── utils/            # Helper functions
└── scripts/              # Database scripts
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Properties
- `GET /api/properties` - Get all properties (with filtering)
- `POST /api/properties` - Create property (agents/admins only)
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property (owner/admin only)
- `DELETE /api/properties/[id]` - Delete property (owner/admin only)

### Favorites
- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites` - Add to favorites (protected)
- `DELETE /api/favorites/[propertyId]` - Remove from favorites (protected)

### Inquiries
- `GET /api/inquiries` - Get inquiries (role-based access)
- `POST /api/inquiries` - Create inquiry (protected)
- `PUT /api/inquiries/[id]` - Update inquiry (agents/admins only)

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components with:
- Consistent design system
- Dark/light mode support
- Accessible components
- Customizable themes

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- Protected API routes
- CORS configuration

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation
- Adaptive layouts
- Touch-friendly interfaces

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Node.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@realestatehub.com or create an issue in the repository.
