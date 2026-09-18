# Pugazhmani K — Portfolio

A modern, responsive portfolio website showcasing cybersecurity and AI engineering projects, built with React, TypeScript, and Firebase.

![Portfolio Preview](public/profile.jpeg)

## Features

- **Hero Section** — Animated intro with profile photo, stats, and social links
- **About Me** — Background, education, and quick facts
- **Skills** — Categorized skill levels with visual indicators
- **Experience** — Professional timeline with roles and achievements
- **Projects** — Filterable project grid with GitHub links and tech tags
- **Achievements** — Hackathon wins, conferences, and leadership roles
- **Blog** — Markdown-style blog posts with rich content
- **Learning Resources** — Upload and view PDF study materials with inline PDF viewer
- **Contact** — Direct contact form and social links
- **Admin Panel** — Manage blog posts, learning topics, and portfolio data

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | CSS3, Framer Motion |
| Backend | Firebase (Firestore, Auth) |
| PDF Viewer | pdf.js (pdfjs-dist) |
| Icons | Lucide React |
| Routing | React Router DOM |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for backend features)

### Installation

```bash
# Clone the repository
git clone https://github.com/pugazh342/pugazhmani-portfolio.git

# Navigate to project directory
cd pugazhmani-portfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
pugazhmani-portfolio/
├── public/                 # Static assets
│   ├── favicon.png         # Browser tab icon
│   ├── profile.jpeg        # Hero section photo
│   ├── about.jpeg          # About section photo
│   └── *.pdf              # Resume files
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Hero.tsx        # Landing section
│   │   ├── About.tsx       # About me section
│   │   ├── Projects.tsx    # Project showcase
│   │   ├── Learning.tsx    # PDF learning resources
│   │   └── ...
│   ├── pages/              # Route-level components
│   │   ├── Portfolio.tsx   # Main portfolio page
│   │   ├── Blog.tsx        # Blog listing
│   │   └── LearningPage.tsx
│   ├── services/           # Firebase & API services
│   │   ├── blogService.ts  # Blog CRUD operations
│   │   ├── learningService.ts
│   │   └── storageService.ts
│   ├── data/               # Static data & configuration
│   │   └── portfolioData.ts
│   ├── types/              # TypeScript interfaces
│   ├── firebase/           # Firebase configuration
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context providers
│   └── styles/             # Global styles & CSS variables
├── firestore.rules         # Firestore security rules
├── firebase.json           # Firebase configuration
└── package.json
```

## Key Features

### PDF Learning Resources

Upload and view PDF study materials directly in the browser using pdf.js for inline rendering.

### Admin Panel

Manage content without code changes:
- Add/edit blog posts
- Upload learning materials
- Update portfolio data

### Responsive Design

Fully responsive across all devices with mobile-first approach.

### Animations

Smooth page transitions and scroll animations powered by Framer Motion.

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (optional)
4. Update security rules in `firestore.rules`
5. Deploy rules: `firebase deploy --only firestore:rules`

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Firebase Hosting

```bash
firebase deploy --only hosting
```

### Netlify

Connect your GitHub repository for automatic deployments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

**Pugazhmani K**
- Email: kpugazhmani21@gmail.com
- GitHub: [pugazh342](https://github.com/pugazh342)
- LinkedIn: [pugazhmani](https://linkedin.com/in/pugazhmani)

Project Link: [https://github.com/pugazh342/pugazhmani-portfolio](https://github.com/pugazh342/pugazhmani-portfolio)
