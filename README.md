# 🎬 RoPhim Clone - Netflix-Style Movie Streaming Website

A modern, responsive movie streaming website built with Next.js 15, featuring Netflix-style UI/UX and complete user authentication system.

## ✨ Features

### 🎨 **UI/UX Design**
- **Netflix-style dark theme** with modern glass morphism effects
- **Responsive design** optimized for mobile, tablet, and desktop
- **Horizontal scrolling movie rows** with smooth animations
- **Hero carousel** with auto-playing trailers
- **Advanced hover effects** and transitions
- **Custom scrollbars** and loading states

### 🎥 **Movie Features**
- **Movie browsing** by categories (New, Popular, Korean, Chinese, Western, Anime)
- **Advanced filtering** by rating and popularity
- **Movie details** with cast, director, genres, and descriptions
- **Trailer integration** with video player
- **Search functionality** across all movies
- **Optimized images** with WebP conversion and lazy loading

### 👤 **User System**
- **Complete authentication** with NextAuth.js
- **Registration/Login** with email and password
- **User profiles** with avatar and preferences
- **Watchlist functionality** - save/remove movies
- **MongoDB integration** for persistent data storage

### ⚡ **Performance**
- **API caching** with 5-minute TTL for faster loading
- **Image optimization** with Next.js Image component
- **Turbopack** for ultra-fast development builds
- **Database optimization** with proper indexing

## 🛠 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Authentication:** NextAuth.js
- **Database:** MongoDB with Mongoose
- **API:** PhimAPI.com integration
- **Deployment:** Vercel ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/web-rophim.git
cd web-rophim
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/web-rophim

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── movies/        # Movie data endpoints
│   │   └── watchlist/     # Watchlist management
│   ├── phim/              # Movie pages
│   ├── login/             # Authentication pages
│   └── watchlist/         # User watchlist page
├── components/            # React components
│   ├── MovieCard.tsx      # Movie display card
│   ├── HeroSection.tsx    # Homepage hero
│   ├── Header.tsx         # Navigation
│   └── WatchlistButton.tsx # Watchlist functionality
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── models/               # MongoDB models
├── services/             # External API integration
└── types/                # TypeScript type definitions
```

## 🎯 Key Components

### Movie Display
- **MovieCard**: Responsive movie cards with hover effects
- **MovieRowWithAPI**: Horizontal scrolling rows with API integration
- **HeroSection**: Featured movies carousel with autoplay

### User Features
- **WatchlistButton**: Add/remove movies from personal watchlist
- **Authentication**: Complete login/register system
- **UserProfile**: Profile management and preferences

### API Integration
- **PhimAPI Service**: External movie data integration
- **Caching System**: In-memory caching for performance
- **Error Handling**: Comprehensive error handling and fallbacks

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## 🌟 Demo

**Test Account:**
- Email: `demo@test.com`
- Password: `123456`

## 📱 Responsive Design

- **Mobile (320px+)**: Touch-optimized interface with stacked layouts
- **Tablet (768px+)**: Medium-sized cards with touch interactions
- **Desktop (1024px+)**: Full Netflix-like experience with hover effects
- **Large screens (1440px+)**: Maximum visual impact with larger elements

## 🔒 Security Features

- **Password hashing** with bcryptjs
- **CSRF protection** with NextAuth.js
- **Input validation** on all forms
- **Secure session management**
- **Environment variable protection**

## 🚀 Deployment

The project is ready for deployment on Vercel:

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables**
4. **Deploy automatically**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **PhimAPI.com** for movie data
- **Next.js team** for the amazing framework
- **Vercel** for hosting and deployment
- **Netflix** for UI/UX inspiration

---

**Built with ❤️ using modern web technologies**