# Streamline News

## Modernized Architecture (2024)

This project now uses **Next.js server actions** for all backend logic, with **Drizzle ORM** and **PostgreSQL** for data storage. All previous Laravel API dependencies have been removed.

---

## Folder Structure

- `/app` - Next.js app directory (routes, pages, layouts)
- `/components` - UI and reusable components
- `/actions` - Next.js server actions (all data mutations/fetching)
- `/db` - Drizzle ORM schema, migrations, and config
- `/services` - Business logic (to be migrated to server actions)
- `/lib` - Utilities and helpers
- `/types` - TypeScript types

---

## Migration Note

>  postgres: All API logic is being migrated from Laravel to Next.js server actions and Drizzle ORM. See `/actions` and `/db` for new logic.

---

## Setup

1. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```
2. Set up your PostgreSQL database and configure environment variables:
   - `DATABASE_URL=postgres://user:password@localhost:5432/yourdb`
3. Run Drizzle migrations:
   ```bash
   npx drizzle-kit push:pg
   ```
4. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

---

## Server Actions & Drizzle ORM

- All data fetching and mutations are handled via server actions in `/actions`.
- Database schema and queries are managed with Drizzle ORM in `/db`.

---

## Clean Architecture

- UI, business logic, and data access are separated for maintainability.
- No external API dependencies; all logic is handled in-app.

---

## Contributors
-  postgres (migration lead)

# Advanced News Platform

A cutting-edge, production-ready news platform built with Next.js 15+, TypeScript, and modern web technologies. Features comprehensive SEO optimization, multilingual support, advanced analytics, and enterprise-grade performance.

## 🚀 Features

### Core Architecture
- **Next.js 15+** with App Router and advanced optimizations
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** with custom design system
- **shadcn/ui** components with accessibility compliance
- **Hybrid rendering** (SSR, SSG, ISR) for optimal performance

### Advanced Features
- **Multilingual Support** (12 languages) with next-i18next
- **SEO Optimization** with dynamic meta tags and OpenGraph
- **Social Media Integration** with react-share and custom cards
- **Infinite Scroll** with react-infinite-scroll-component
- **Advanced Analytics** with GA4 and GTM integration
- **PWA Support** with offline capabilities
- **Advertisement System** with Google AdSense integration

### Performance & Security
- **Bundle Analysis** with @next/bundle-analyzer
- **Security Headers** and CSRF protection
- **Image Optimization** with Next.js Image component
- **Font Optimization** with BBC-inspired typography
- **Accessibility** (WCAG 2.1 AA) with axe-core testing
- **Performance Monitoring** with Lighthouse integration

### Development & Testing
- **Jest** for unit testing with 70% coverage threshold
- **Playwright** for E2E testing across browsers
- **ESLint & Prettier** for code quality
- **Husky** for pre-commit hooks
- **Docker** support for containerization
- **Vercel** deployment configuration

## 📁 Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── [locale]/          # Internationalized routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── globals.css        # Global styles with BBC-inspired fonts
├── components/            # Reusable components
│   ├── ads/              # Advertisement components
│   ├── infinite-scroll/  # Infinite scroll components
│   ├── seo/              # SEO and OpenGraph components
│   ├── social/           # Social sharing components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
├── providers/            # Context providers
├── public/               # Static assets
│   ├── locales/          # Translation files
│   └── fonts/            # Custom fonts
├── services/             # API services
├── tests/                # Test files
│   ├── e2e/              # Playwright E2E tests
│   └── unit/             # Jest unit tests
├── types/                # TypeScript definitions
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker build configuration
└── vercel.json          # Vercel deployment config
```

## 🛠 Tech Stack

### Frontend
- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Server state management

### UI Components
- **shadcn/ui** - Accessible component library
- **Radix UI** - Primitive components
- **Lucide React** - Icon library
- **React Hook Form** - Form handling

### Analytics & SEO
- **Google Analytics 4** - Advanced analytics
- **Google Tag Manager** - Tag management
- **next-sitemap** - Dynamic sitemap generation
- **OpenGraph** - Social media optimization

### Internationalization
- **next-i18next** - Internationalization framework
- **12 Languages** - English, Spanish, French, German, Hindi, Arabic, Chinese, Japanese, Korean, Portuguese, Russian, Italian

### Testing & Quality
- **Jest** - Unit testing framework
- **Playwright** - E2E testing
- **axe-core** - Accessibility testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Deployment & DevOps
- **Vercel** - Deployment platform
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Lighthouse** - Performance monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/advanced-news-platform.git
   cd advanced-news-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run E2E tests
- `npm run test:accessibility` - Run accessibility tests

### Analysis & Optimization
- `npm run analyze` - Analyze bundle size
- `npm run lighthouse` - Run Lighthouse audit
- `npm run wcag:test` - Test WCAG compliance
- `npm run security:audit` - Security audit

### Docker
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:compose` - Run with Docker Compose

## 🌍 Internationalization

The platform supports 12 languages:
- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)
- Arabic (ar)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Portuguese (pt)
- Russian (ru)
- Italian (it)

### Adding New Languages

1. Add locale to `next-i18next.config.js`
2. Create translation files in `public/locales/[locale]/`
3. Update language selector component

## 📊 SEO & Analytics

### SEO Features
- Dynamic meta tags for each page
- OpenGraph tags for social media
- Twitter Card optimization
- Structured data (JSON-LD)
- Dynamic sitemap generation
- Robots.txt optimization

### Analytics Integration
- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Custom event tracking
- Performance monitoring
- User behavior analysis

## 🎨 Design System

### Typography
- **Headlines**: Playfair Display (serif)
- **Body**: Source Sans Pro (sans-serif)
- **UI**: Inter (sans-serif)
- **Brand**: BBC Reith Sans (custom)

### Color Palette
- **Primary**: BBC-inspired red (#bb1919)
- **Secondary**: Modern blue (#0066cc)
- **Accent**: Orange (#ff6600)
- **Neutral**: Comprehensive gray scale

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px, 1536px
- Container queries for advanced layouts
- Fluid typography with clamp()

## 🔒 Security

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restricted permissions
- Strict-Transport-Security: HSTS enabled

### Content Security
- CSRF protection
- XSS prevention
- Input validation with Zod
- Secure cookie handling

## 📱 PWA Features

- Offline support
- App-like experience
- Push notifications (configurable)
- Install prompts
- Background sync
- Caching strategies

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Docker
```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use Docker Compose
npm run docker:compose
```

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing Strategy

### Unit Tests (Jest)
- Component testing with React Testing Library
- Utility function testing
- Service layer testing
- 70% coverage threshold

### E2E Tests (Playwright)
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile device testing
- User journey testing
- Visual regression testing

### Accessibility Tests
- axe-core integration
- WCAG 2.1 AA compliance
- Keyboard navigation testing
- Screen reader compatibility

## 📈 Performance Optimization

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Techniques
- Image optimization with Next.js Image
- Font optimization with font-display: swap
- Code splitting and lazy loading
- Bundle analysis and tree shaking
- Service worker caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure accessibility compliance
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [BBC Design System](https://www.bbc.co.uk/gel) - Design inspiration
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For support, email alpha@newsplatform.com or join our Slack channel.

---

**Built with ❤️ by the Alpha Team**