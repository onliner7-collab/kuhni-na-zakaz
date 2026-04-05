# Модели данных

## Kitchen

```typescript
interface Kitchen {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: "uglovye" | "pryamye" | "p-obraznye" | "ostrov" | "malenkie" | "do-potolka" | "bez-ruchek";
  style: string;
  material: string;
  priceFrom: number;
  priceTo?: number;
  features: string[];
  images: string[];
  mainImage: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## PortfolioCase

```typescript
interface PortfolioCase {
  id: number;
  title: string;
  slug: string;
  city: string;
  area: number;
  style: string;
  material: string;
  priceFrom: number;
  priceTo: number;
  days: number;
  description: string;
  task: string;
  solution: string;
  images: string[];
  mainImage: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Review

```typescript
interface Review {
  id: number;
  name: string;
  city: string;
  phone: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  status: "new" | "pending" | "published" | "rejected" | "deleted";
  moderatedBy?: number;
  moderatedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
}
```

## BlogPost

```typescript
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## LocationPage

```typescript
interface LocationPage {
  id: number;
  city: string;
  slug: string;
  title: string;
  h1: string;
  description: string;
  content: string;
  areas: string[];
  deliveryCost: string;
  phone?: string;
  address?: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
}
```

## FAQItem

```typescript
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  page: string;
  order: number;
}
```

## User

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: "super_admin" | "manager";
  passwordHash: string;
  createdAt: Date;
  lastLoginAt?: Date;
}
```

## GuestAccess

```typescript
interface GuestAccess {
  id: number;
  createdBy: number;
  allowedSections: string[];
  allowedActions: ("view" | "edit" | "moderate")[];
  expiresAt: Date;
  revokedAt?: Date;
  loginLink?: string;
  loginCredentials?: { login: string; passwordHash: string };
  createdAt: Date;
}
```

## ActivityLog

```typescript
interface ActivityLog {
  id: number;
  userId?: number;
  guestAccessId?: number;
  action: string;
  entity: string;
  entityId?: number;
  details: Record<string, unknown>;
  ip: string;
  userAgent: string;
  createdAt: Date;
}
```
