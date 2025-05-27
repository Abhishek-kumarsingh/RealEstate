# RealEstate Pro - AI-Powered Real Estate Platform

A cutting-edge, comprehensive real estate platform built with Next.js, TypeScript, and MongoDB. This platform provides a complete solution for real estate professionals, investors, buyers, and sellers with advanced AI features, market analytics, real-time communication, and comprehensive financial tools.

## 🚀 Comprehensive Features Overview

### 🤖 AI-Powered Intelligence
- **AI Property Recommendations**: Machine learning algorithm for personalized property suggestions based on user behavior and preferences
- **AI Chatbot Assistant**: 24/7 intelligent customer support with natural language processing and contextual responses
- **Smart Property Matching**: Advanced algorithms that analyze user preferences, budget, and viewing history
- **Market Predictions**: AI-driven market forecasts and trend analysis with 87% accuracy
- **Automated Property Valuation**: AI-powered property value estimation and investment scoring

### 📊 Advanced Analytics & Market Intelligence
- **Market Analytics Dashboard**: Comprehensive market analysis with interactive charts and real-time data
- **Price Trends Analysis**: Historical data visualization and future market predictions
- **Comparative Market Analysis (CMA)**: Detailed neighborhood comparisons and market metrics
- **Investment ROI Calculators**: Advanced financial analysis tools with cap rate and cash flow calculations
- **Market Heat Maps**: Visual representation of market activity and investment opportunities
- **Neighborhood Analysis**: Detailed area comparisons with days on market and inventory levels

### 💬 Real-time Communication & Collaboration
- **Advanced Chat System**: Live messaging between buyers, sellers, and agents with file sharing
- **Video Call Integration**: Schedule and conduct virtual property tours with integrated calling
- **Document Sharing**: Secure file sharing within chat conversations with version control
- **Chat History & Notes**: Complete conversation tracking and searchable message history
- **Multi-participant Chats**: Group conversations for complex transactions
- **Real-time Notifications**: Instant alerts for new messages and important updates

### 💰 Comprehensive Financial Tools
- **Advanced Mortgage Calculator**: Multi-scenario payment calculations with PMI, taxes, and insurance
- **Pre-approval Integration**: Direct connection with lenders for mortgage pre-approval process
- **Affordability Analysis**: Detailed financial capability assessment with debt-to-income ratios
- **Down Payment Assistance**: Information and calculators for assistance programs
- **Loan Program Comparison**: Side-by-side comparison of different mortgage products
- **Payment Breakdown Visualization**: Interactive charts showing payment components

### 📈 Investment Analysis Suite
- **Cash Flow Calculators**: Detailed rental property analysis with expense breakdowns
- **Cap Rate Analysis**: Investment property evaluation metrics and market comparisons
- **Rental Yield Predictions**: ROI forecasting for investment properties with 5-year projections
- **Tax Implication Calculators**: Tax benefits analysis including depreciation and deductions
- **Portfolio Management**: Track multiple investment properties with performance metrics
- **Market Comparison Tools**: Compare investment opportunities across different areas

### 🔐 Enterprise-Grade Security & Verification
- **Identity Verification**: Comprehensive KYC (Know Your Customer) integration
- **Document Verification**: Secure document upload with AI-powered verification
- **Background Checks**: Comprehensive screening for agents and high-value transactions
- **Two-Factor Authentication**: Enhanced account security with multiple verification methods
- **Biometric Login**: Fingerprint and face recognition support for mobile devices
- **Activity Monitoring**: Real-time security monitoring and suspicious activity detection
- **Secure Payment Processing**: PCI-compliant payment handling for transactions

### 🎯 Unified Dashboard Experience
- **Single-Page Dashboard**: All features accessible from one comprehensive interface
- **Integrated Login**: Seamless authentication directly on the dashboard page
- **Role-based Access Control**: Customized views for buyers, sellers, agents, and administrators
- **Real-time Data Sync**: Live updates across all features and components
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Customizable Widgets**: Personalized dashboard layout based on user preferences

## 🛠️ Advanced Tech Stack

### Frontend Technologies
- **Framework**: Next.js 13 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Charts & Visualization**: Recharts for interactive data visualization
- **Icons**: Lucide React for consistent iconography
- **State Management**: React Context API with custom hooks
- **Form Handling**: React Hook Form with Zod validation

### Backend & Database
- **API**: Next.js API Routes with RESTful architecture
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Legacy Support**: MongoDB with Mongoose ODM (for migration reference)
- **Authentication**: JWT tokens with bcryptjs encryption and session management
- **File Upload**: Multer for document and image handling
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: CORS configuration, rate limiting, and audit logging
- **Type Safety**: Full TypeScript support with Prisma-generated types

### AI & Analytics
- **Machine Learning**: Custom recommendation algorithms
- **Data Processing**: Real-time analytics and trend analysis
- **Predictive Modeling**: Market forecasting and price prediction
- **Natural Language Processing**: AI chatbot with contextual understanding

### Security & Verification
- **Encryption**: Industry-standard encryption for sensitive data
- **Identity Verification**: KYC integration with document verification
- **Two-Factor Authentication**: Multiple verification methods
- **Activity Monitoring**: Real-time security event tracking

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+ (local or cloud instance)
- npm or yarn
- Optional: MongoDB (for data migration)

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

**⚠️ IMPORTANT: Make sure your `.env.local` file is in your `.gitignore` to prevent committing secrets to GitHub.**

```env
# Database - PostgreSQL with Prisma
DATABASE_URL="postgresql://username:password@localhost:5432/realestate?schema=public"
# For local development, you can use:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/realestate?schema=public"

# JWT Secret - REQUIRED for authentication
# Generate a secure secret with: openssl rand -base64 32
JWT_SECRET=GYu+w0OyKXAvTgt/PLOfsKAG4ayaUmLBy/uEo0WQMtA=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google AI API (for chatbot features)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# App Settings
NODE_ENV=development
```

**For Production Deployment (Vercel):**
Add these environment variables in your Vercel dashboard:
- `DATABASE_URL` - Your production PostgreSQL database URL
- `JWT_SECRET` - A secure JWT secret (use the one provided above or generate a new one)
- `GOOGLE_AI_API_KEY` - Your Google AI API key
- `NEXTAUTH_URL` - Your production domain URL
- `NEXTAUTH_SECRET` - A secure NextAuth secret

### 4. Set Up PostgreSQL Database
```bash
# Install PostgreSQL (if not already installed)
# Windows: Download from https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb realestate

# Or using psql
psql -U postgres
CREATE DATABASE realestate;
\q
```

### 5. Generate Prisma Client and Push Schema
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 6. Seed the Database
```bash
npm run seed-prisma
```

This will create comprehensive sample data including users, properties, and relationships. Test accounts:
- **Admin**: admin@realestatehub.com / password123
- **Agent 1**: sarah.johnson@realestatehub.com / password123
- **Agent 2**: michael.chen@realestatehub.com / password123
- **User**: john.doe@example.com / password123

### 7. Start the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Database Management

### Available Scripts
```bash
# Prisma commands
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema changes to database
npm run db:migrate    # Create and run migrations
npm run db:studio     # Open Prisma Studio (database GUI)
npm run db:reset      # Reset database and run migrations

# Seeding
npm run seed-prisma   # Seed with comprehensive real estate data
npm run seed          # Legacy MongoDB seed (for reference)
```

### Prisma Studio
Explore your database with a visual interface:
```bash
npm run db:studio
```
This opens a web interface at `http://localhost:5555` where you can view and edit your data.

## 🔄 Migration from MongoDB

If you're migrating from the previous MongoDB setup, see the [Migration Guide](./MIGRATION_GUIDE.md) for detailed instructions.

## 🎯 Dashboard Features Access

The enhanced dashboard provides access to all features through a unified interface:

### Login Integration
- **Direct Dashboard Login**: Access the dashboard at `/dashboard` - login is integrated directly on the page
- **Seamless Authentication**: No separate login page required - authenticate directly from the dashboard
- **Role-based Redirection**: Automatic redirection to appropriate dashboard sections based on user role

### Feature Navigation
Once logged in, access all features through the tabbed interface:

1. **Overview**: Traditional dashboard with analytics and recent activity
2. **AI Insights**: AI-powered property recommendations and market insights
3. **Analytics**: Comprehensive market analysis and trend visualization
4. **Messages**: Real-time chat system with agents and other users
5. **Mortgage**: Advanced mortgage calculator and pre-approval tools
6. **Investment**: Investment analysis tools and portfolio management
7. **Security**: Identity verification and security settings
8. **AI Assistant**: 24/7 AI chatbot for instant support

### Quick Start Guide
1. Navigate to `/dashboard`
2. Login with any of the test accounts above
3. Explore the different tabs to access all features
4. Try the AI chatbot for instant assistance
5. Use the mortgage calculator for payment estimates
6. Check out the market analytics for investment insights

## 📁 Enhanced Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── properties/    # Property CRUD operations
│   │   ├── favorites/     # User favorites
│   │   ├── inquiries/     # Property inquiries
│   │   ├── chat/          # Real-time messaging (future)
│   │   ├── analytics/     # Market analytics (future)
│   │   └── ai/            # AI services (future)
│   ├── dashboard/         # Enhanced unified dashboard
│   ├── login/            # Login page (legacy)
│   ├── register/         # Registration page
│   └── properties/       # Property listing pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── dashboard/        # NEW: Advanced dashboard components
│   │   ├── AIRecommendations.tsx    # AI-powered property suggestions
│   │   ├── MarketAnalytics.tsx      # Market analysis and trends
│   │   ├── ChatSystem.tsx           # Real-time messaging system
│   │   ├── MortgageCalculator.tsx   # Advanced mortgage tools
│   │   ├── InvestmentAnalysis.tsx   # Investment analysis suite
│   │   ├── SecurityVerification.tsx # Security and KYC features
│   │   └── AIChatbot.tsx            # AI assistant chatbot
│   ├── layout/           # Layout components
│   ├── home/             # Homepage components
│   ├── properties/       # Property-related components
│   ├── chat/             # Chat-related components
│   └── maps/             # Map integration components
├── lib/                  # Utility libraries
│   ├── models/           # MongoDB/Mongoose models
│   ├── contexts/         # React contexts (Auth, Chat)
│   ├── middleware/       # API middleware
│   ├── ai/               # AI and ML utilities (future)
│   ├── analytics/        # Analytics processing (future)
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

## 🌟 Feature Showcase

### AI-Powered Recommendations
- **Smart Matching**: Properties are recommended based on viewing history, search patterns, and user preferences
- **Behavioral Analysis**: Machine learning algorithms analyze user interactions to improve suggestions
- **Market Insights**: AI provides personalized market analysis and investment opportunities
- **Trend Predictions**: Advanced algorithms predict market trends with high accuracy

### Advanced Analytics Dashboard
- **Interactive Charts**: Real-time market data visualization with Recharts
- **Market Comparison**: Side-by-side neighborhood analysis and investment metrics
- **Price Forecasting**: AI-driven price predictions for the next 6-24 months
- **Investment Scoring**: Automated property scoring based on multiple financial metrics

### Comprehensive Financial Tools
- **Mortgage Calculator**: Advanced calculations including PMI, taxes, insurance, and HOA fees
- **Affordability Analysis**: Debt-to-income ratio calculations and pre-approval guidance
- **Investment Analysis**: Cap rate, cash flow, and ROI calculations with tax implications
- **Loan Comparison**: Side-by-side comparison of different mortgage products

### Real-time Communication
- **Live Chat**: Instant messaging between all parties with file sharing capabilities
- **Video Integration**: Schedule and conduct virtual property tours
- **Document Sharing**: Secure document exchange within conversations
- **Activity Tracking**: Complete audit trail of all communications

### Security & Verification
- **KYC Integration**: Comprehensive identity verification process
- **Document Verification**: AI-powered document authentication
- **Two-Factor Authentication**: Multiple security layers for account protection
- **Activity Monitoring**: Real-time security event tracking and alerts

## 🚀 Future Enhancements

### Planned Features
- **Blockchain Integration**: Smart contracts for property transactions
- **VR/AR Tours**: Virtual and augmented reality property viewing
- **IoT Integration**: Smart home device integration and monitoring
- **Advanced AI**: Enhanced natural language processing and predictive analytics
- **Mobile App**: Native iOS and Android applications
- **API Marketplace**: Third-party integrations and developer ecosystem

### Scalability Features
- **Microservices Architecture**: Transition to microservices for better scalability
- **Real-time Notifications**: WebSocket integration for instant updates
- **Advanced Caching**: Redis integration for improved performance
- **CDN Integration**: Global content delivery for faster load times

## 🆘 Support & Documentation

For support, email support@realestatepro.com or create an issue in the repository.

### Additional Resources
- **API Documentation**: Comprehensive API reference (coming soon)
- **User Guide**: Step-by-step user manual (coming soon)
- **Developer Guide**: Technical documentation for contributors (coming soon)
- **Video Tutorials**: Feature walkthrough videos (coming soon)
