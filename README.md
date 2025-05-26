# Ministério do Bloco

A comprehensive platform for discovering blocos, events, and connecting carnival enthusiasts in Brazil.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: For development
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

- **Database**: Supabase PostgreSQL with 1,802+ blocos and multilingual content
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Components**: shadcn/ui component library
- **Internationalization**: next-intl (pt, en, fr, es)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## 🎯 Features

- **Bloco Discovery**: Search and explore carnival blocos across Brazil
- **Event Management**: Find parades, rehearsals, parties, and workshops
- **Multilingual Support**: Portuguese, English, French, Spanish
- **Real-time Features**: Live location sharing and updates
- **Mobile-First**: Optimized for mobile carnival experience
- **SEO Optimized**: Enhanced event URLs and metadata

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Internationalization**: next-intl
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Maps**: React Leaflet
- **Deployment**: Vercel

## 📱 API Endpoints

- `GET /api/blocos` - List blocos with filtering and pagination
- `GET /api/cities` - List carnival cities
- `GET /api/events` - List events with filtering

## 🌍 Internationalization

The platform supports 4 languages:

- Portuguese (pt) - Default
- English (en)
- French (fr)
- Spanish (es)

URL structure:

- Portuguese: `/rio-de-janeiro/blocos`
- Other languages: `/en/rio-de-janeiro/blocos`

## 🎭 Carnival Platform Features

- **Enhanced Event URLs**: `/[city]/eventos/[date]/[event-type]/[bloco-slug]`
- **Multilingual Content**: Separate database columns for each language
- **Social Integration**: Facebook, Instagram, YouTube, Spotify links
- **Real-time Location**: Share location during carnival events
- **Mobile Optimization**: Touch-friendly interface for street use

## 📄 License

This project is licensed under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
