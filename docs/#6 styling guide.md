# **Styling Guide Document**

## **Ministério do Bloco - Visual Design System**

---

## **1. Brand Identity & Visual Foundation**

### **🎨 Color Palette**

#### **Primary Colors (From Your Current Design)**

```css
/* Primary Green (Header & CTA) */
--primary-green: #2d7e32; /* Your main green */
--primary-green-dark: #1b5e20; /* Darker variant */
--primary-green-light: #4caf50; /* Lighter variant */

/* Accent Colors */
--accent-green: #00c853; /* Bright green for highlights */
--success-green: #4caf50; /* Success states */
--carnival-gold: #ffb300; /* Carnival accent color */

/* Background Colors */
--background-white: #ffffff; /* Main background */
--background-gray: #f5f5f5; /* Secondary background */
--card-background: #ffffff; /* Card backgrounds */
--overlay-dark: rgba(45, 126, 50, 0.9); /* Green overlay for hero sections */
```

#### **Neutral Colors**

```css
/* Text Colors */
--text-primary: #212121; /* Main text */
--text-secondary: #757575; /* Secondary text */
--text-light: #9e9e9e; /* Light text/placeholders */
--text-white: #ffffff; /* White text on dark backgrounds */

/* Border & Divider Colors */
--border-light: #e0e0e0; /* Light borders */
--border-medium: #bdbdbd; /* Medium borders */
--divider: #eeeeee; /* Dividers */
```

#### **Semantic Colors**

```css
/* Status Colors */
--error-red: #f44336; /* Error states */
--warning-orange: #ff9800; /* Warning states */
--info-blue: #2196f3; /* Info states */
--draft-gray: #9e9e9e; /* Draft content */

/* Event Type Colors */
--parade-purple: #9c27b0; /* Parade events */
--rehearsal-blue: #3f51b5; /* Rehearsal events */
--party-pink: #e91e63; /* Party events */
--workshop-orange: #ff5722; /* Workshop events */
```

---

## **2. Typography System**

### **🔤 Font Hierarchy (Based on Your Current Design)**

#### **Font Families**

```css
/* Primary Font (Clean, Modern) */
--font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Secondary Font (For Headings) */
--font-heading: "Poppins", "Inter", sans-serif;

/* Monospace (For Codes/Data) */
--font-mono: "JetBrains Mono", "Courier New", monospace;
```

#### **Font Sizes & Weights**

```css
/* Headings */
--text-4xl: 2.25rem; /* 36px - Main page titles */
--text-3xl: 1.875rem; /* 30px - Section titles */
--text-2xl: 1.5rem; /* 24px - Card titles */
--text-xl: 1.25rem; /* 20px - Subtitles */
--text-lg: 1.125rem; /* 18px - Large body text */

/* Body Text */
--text-base: 1rem; /* 16px - Base body text */
--text-sm: 0.875rem; /* 14px - Small text */
--text-xs: 0.75rem; /* 12px - Very small text */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## **3. Component Design System**

### **🏷️ Card Components (Matching Your Current Style)**

#### **Bloco Cards**

```css
.bloco-card {
  background: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.2s ease;
  border: 1px solid var(--border-light);
}

.bloco-card:hover {
  box-shadow: 0 4px 12px rgba(45, 126, 50, 0.15);
  transform: translateY(-2px);
}

.bloco-card-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.bloco-card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.bloco-card-location {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.bloco-card-genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}
```

#### **Event Cards**

```css
.event-card {
  background: var(--card-background);
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid var(--primary-green);
  margin-bottom: 1rem;
}

.event-date-badge {
  background: var(--primary-green);
  color: var(--text-white);
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  min-width: 60px;
  font-weight: var(--font-semibold);
}

.event-type-badge {
  background: var(--background-gray);
  color: var(--primary-green);
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}
```

### **🎛️ Navigation Components**

#### **Header Navigation (Matching Your Design)**

```css
.main-header {
  background: var(--primary-green);
  color: var(--text-white);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  color: var(--text-white);
  text-decoration: none;
  font-weight: var(--font-medium);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
}
```

#### **City Selector**

```css
.city-selector {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--text-white);
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.city-selector:hover {
  background: rgba(255, 255, 255, 0.15);
}
```

### **🗺️ Map Integration Styles**

#### **Map Container**

```css
.map-container {
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-marker {
  background: var(--primary-green);
  border: 3px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.map-marker.event-marker {
  background: var(--carnival-gold);
}

.map-popup {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 300px;
}
```

---

## **4. Interactive Elements**

### **🔘 Buttons & Controls**

#### **Primary Buttons**

```css
.btn-primary {
  background: var(--primary-green);
  color: var(--text-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-green-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(45, 126, 50, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--primary-green);
  color: var(--text-white);
}
```

#### **Follow Button (Heart Style)**

```css
.follow-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--text-light);
  transition: all 0.2s ease;
}

.follow-button.following {
  color: var(--error-red);
}

.follow-button:hover {
  transform: scale(1.1);
}
```

### **📝 Form Elements**

#### **Input Fields**

```css
.form-input {
  background: var(--card-background);
  border: 2px solid var(--border-light);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  transition: border-color 0.2s ease;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(45, 126, 50, 0.1);
}

.search-input {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-size: var(--text-base);
  width: 100%;
}

.search-input::placeholder {
  color: var(--text-light);
}
```

#### **Filter Controls**

```css
.filter-toggle {
  background: var(--background-gray);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-toggle.active {
  background: var(--primary-green);
  color: var(--text-white);
  border-color: var(--primary-green);
}

.alphabet-filter {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.alphabet-letter {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.alphabet-letter:hover {
  background: var(--background-gray);
}

.alphabet-letter.active {
  background: var(--primary-green);
  color: var(--text-white);
}
```

---

## **5. Layout & Spacing System**

### **📐 Spacing Scale**

```css
/* Spacing Variables */
--space-xs: 0.25rem; /* 4px */
--space-sm: 0.5rem; /* 8px */
--space-md: 1rem; /* 16px */
--space-lg: 1.5rem; /* 24px */
--space-xl: 2rem; /* 32px */
--space-2xl: 3rem; /* 48px */
--space-3xl: 4rem; /* 64px */

/* Container Sizes */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### **🏗️ Layout Patterns**

#### **Grid Systems**

```css
.grid-blocos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.grid-events {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .grid-events {
    grid-template-columns: 1fr;
  }
}
```

#### **Hero Sections**

```css
.hero-section {
  background: linear-gradient(
    135deg,
    var(--primary-green) 0%,
    var(--primary-green-dark) 100%
  );
  color: var(--text-white);
  padding: var(--space-3xl) 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-lg);
}

.hero-subtitle {
  font-size: var(--text-xl);
  opacity: 0.9;
  margin-bottom: var(--space-2xl);
}
```

---

## **6. Mobile-First Responsive Design**

### **📱 Breakpoints**

```css
/* Mobile First Approach */
:root {
  /* Base styles for mobile */
}

/* Tablet */
@media (min-width: 768px) {
  .nav-menu {
    display: flex;
  }

  .grid-blocos {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid-blocos {
    grid-template-columns: repeat(3, 1fr);
  }

  .map-container {
    height: 600px;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .grid-blocos {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### **📲 Mobile-Specific Components**

```css
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--primary-green);
}

.mobile-menu-toggle {
  display: block;
  background: none;
  border: none;
  color: var(--text-white);
  font-size: 1.5rem;
  cursor: pointer;
}

@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none;
  }
}

.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--border-light);
  padding: var(--space-sm) 0;
  display: flex;
  justify-content: space-around;
  z-index: 100;
}

@media (min-width: 768px) {
  .bottom-navigation {
    display: none;
  }
}
```

---

## **7. Animation & Transitions**

### **🎬 Animation System**

```css
/* Base Transitions */
.transition-smooth {
  transition: all 0.2s ease;
}

.transition-slow {
  transition: all 0.3s ease;
}

/* Hover Effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Loading Animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 2s infinite;
}

/* Page Transitions */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

---

## **8. Accessibility & Inclusive Design**

### **♿ Accessibility Features**

```css
/* Focus Indicators */
.focus-visible {
  outline: 3px solid var(--accent-green);
  outline-offset: 2px;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  :root {
    --primary-green: #1b5e20;
    --text-primary: #000000;
    --border-light: #000000;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Large Text Support */
.text-large {
  font-size: 1.2em;
  line-height: 1.6;
}
```

---

## **9. Dark Mode Support (Future)**

### **🌙 Dark Theme Variables**

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background-white: #121212;
    --background-gray: #1e1e1e;
    --card-background: #2c2c2c;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --border-light: #404040;
    --primary-green: #4caf50; /* Lighter for better contrast */
  }
}
```

---

## **10. Brand Implementation Examples**

### **🎨 Real-World Usage**

#### **Event Type Indicators**

```css
.event-type-parade {
  border-left-color: var(--parade-purple);
}
.event-type-rehearsal {
  border-left-color: var(--rehearsal-blue);
}
.event-type-party {
  border-left-color: var(--party-pink);
}
.event-type-workshop {
  border-left-color: var(--workshop-orange);
}
```

#### **Status Indicators**

```css
.status-confirmed {
  color: var(--success-green);
}
.status-cancelled {
  color: var(--error-red);
}
.status-postponed {
  color: var(--warning-orange);
}
.status-draft {
  color: var(--draft-gray);
}
```
