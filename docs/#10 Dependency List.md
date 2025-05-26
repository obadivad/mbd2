# **Dependency List Document (Updated)**

## **Ministério do Bloco - Complete Development Dependencies**

---

## **1. Core Dependencies (package.json)**

### **📦 Production Dependencies**

```json
{
  "name": "ministeriodobloco",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate-types": "supabase gen types typescript --project-id $NEXT_PUBLIC_SUPABASE_PROJECT_ID > src/types/database.ts",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@supabase/supabase-js": "^2.39.3",
    "@tanstack/react-query": "^5.17.15",

    // 🎨 Radix UI primitives (installed automatically by shadcn/ui components)
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",

    // 🎨 shadcn/ui utility dependencies
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^0.2.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",

    // 📅 Date & Time
    "date-fns": "^3.3.1",
    "react-day-picker": "^8.10.0",

    // 🎨 Animation & UI
    "framer-motion": "^11.0.5",
    "lucide-react": "^0.323.0",
    "sonner": "^1.4.0",
    "vaul": "^0.9.0",

    // 🗺️ Maps
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",

    // ⚛️ Core Framework
    "next": "15.1.3",
    "next-intl": "^3.9.0",
    "next-themes": "^0.2.1",
    "react": "19.0.0",
    "react-dom": "19.0.0",

    // 📝 Forms & Validation
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",

    // 🔧 Utilities
    "react-use": "^17.4.3",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8",
    "@types/node": "^20.11.16",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "15.1.3",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "prettier": "^3.2.5",
    "prettier-plugin-tailwindcss": "^0.5.11",
    "supabase": "^1.142.2",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.2",
    "@vitest/coverage-v8": "^1.2.2",
    "playwright": "^1.41.2",
    "@playwright/test": "^1.41.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

---

## **2. UI Component Setup (shadcn/ui)**

### **🎨 shadcn/ui Installation Process**

```bash
# 1. Initialize shadcn/ui in your project
npx shadcn-ui@latest init

# This will:
# - Create components.json config file
# - Setup your src/components/ui directory
# - Install necessary dependencies
# - Configure Tailwind CSS

# 2. Add components as needed for carnival platform
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch

# Each component gets copied to src/components/ui/
# and installs its required @radix-ui dependencies automatically
```

### **🔧 components.json Configuration**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## **3. Development Setup (Updated)**

### **🚀 Complete Setup Commands**

```bash
# 1. Clone and setup project
git clone https://github.com/your-username/ministeriodobloco.git
cd ministeriodobloco

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Initialize shadcn/ui
npx shadcn-ui@latest init
# Follow prompts to configure

# 5. Add essential UI components
npx shadcn-ui@latest add button card dialog input select avatar badge

# 6. Setup Supabase (if not already done)
npm install -g supabase
supabase login
supabase init

# 7. Generate database types
npm run db:generate-types

# 8. Start development server
npm run dev
```

---

## **4. Why This shadcn/ui + Radix UI Approach**

### **🎯 Benefits for Carnival Platform**

```typescript
// ✅ Own the components - they live in your codebase
// src/components/ui/button.tsx - you can customize this!

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // 🎭 Add carnival-specific variants
        carnival: "bg-carnival-gold text-white hover:bg-carnival-gold/90",
        bloco: "bg-primary-green text-white hover:bg-primary-green/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ✅ Full TypeScript support
// ✅ Customizable for carnival theme
// ✅ Accessible by default (Radix UI)
// ✅ Beautiful styling (Tailwind)
```

### **📦 What Gets Installed Automatically**

```bash
# When you run: npx shadcn-ui@latest add button
# It automatically:

1. Copies button.tsx to src/components/ui/
2. Installs @radix-ui/react-slot (if button needs it)
3. Updates your package.json dependencies
4. Ensures class-variance-authority is installed
5. Sets up proper TypeScript types

# You don't need to manually install @radix-ui packages!
# shadcn handles all the dependency management
```

---

## **5. Carnival Platform Specific Components**

### **🎭 Custom Components Built on shadcn**

```bash
# After setting up shadcn, create carnival-specific components:

src/components/
├── ui/                    # shadcn components (owned by you)
│   ├── button.tsx         # Customized with carnival variants
│   ├── card.tsx          # Enhanced for bloco cards
│   ├── badge.tsx         # Event type badges
│   └── ...
├── blocos/               # Built using shadcn components
│   ├── bloco-card.tsx    # Uses ui/card, ui/button, ui/badge
│   ├── follow-button.tsx # Uses ui/button with carnival variant
│   └── ...
├── events/               # Built using shadcn components
│   ├── event-card.tsx    # Uses ui/card, ui/badge
│   └── ...
```

### **🎨 Example: Carnival-themed Button**

```typescript
// src/components/ui/button.tsx (customized shadcn component)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // 🎭 Carnival-specific variants
        carnival: "bg-carnival-gold text-white hover:bg-carnival-gold/90",
        bloco: "bg-primary-green text-white hover:bg-primary-green/90",
        follow: "bg-transparent border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white",
        event: "bg-purple-600 text-white hover:bg-purple-700",
      }
    }
  }
)

// Usage in carnival components:
Descobrir Blocos
Seguir Bloco
Salvar Evento
```

---

## **6. Updated Critical Dependencies Explained**

### **🔧 The Complete Picture**

```typescript
// Why this approach is perfect for carnival platform:

shadcn/ui:
// ✅ Copy components to your codebase (full ownership)
// ✅ Built on Radix UI (accessibility)
// ✅ Styled with Tailwind (customizable)
// ✅ TypeScript native
// ✅ Perfect for carnival theming

@radix-ui/* packages:
// ✅ Automatically installed by shadcn
// ✅ Unstyled, accessible primitives
// ✅ Handle complex interactions (dropdowns, dialogs)
// ✅ Perfect for mobile carnival users

Tailwind CSS:
// ✅ Mobile-first responsive design
// ✅ Custom carnival color palette
// ✅ Fast development
// ✅ Perfect for carnival season traffic
```

---

## **✅ Final Setup Verification**

### **🎯 What You Should See After Setup**

```bash
# Project structure after shadcn setup:
src/
├── components/
│   └── ui/                    # ✅ shadcn components here
│       ├── button.tsx         # ✅ Customizable carnival button
│       ├── card.tsx          # ✅ Perfect for bloco cards
│       └── ...
├── lib/
│   └── utils.ts              # ✅ cn() utility function
└── ...

# Dependencies automatically added:
# ✅ @radix-ui/react-* (only what you need)
# ✅ class-variance-authority
# ✅ clsx
# ✅ tailwind-merge

# Ready to build carnival components!
```

**Perfect!** Now you have the correct understanding: We use **shadcn/ui** (which uses **Radix UI** underneath) for our carnival platform's component system! 🎭🇧🇷

---

Answer from Perplexity: pplx.ai/share
