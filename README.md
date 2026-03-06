# ShopHub Product App

A React-based product browsing application built using **React, TypeScript, React Query, and TailwindCSS**.  
Users can browse products, filter them, search for products from the navbar, and view detailed product pages.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-28a745?style=for-the-badge)](https://leegality-product-app.vercel.app/)

---

# Setup Instructions

## 1. Clone the repository

```bash
git clone https://github.com/jatinrathore/Leegality-Product-App.git
cd leegality-product-app
```

## 2. Install dependencies

```bash
npm install
```

## 3. Run the development server

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

# Architectural Decisions

### 1. Navbar Search Feature

A search feature was added to the navbar:

- Users can search products directly from the navigation bar.
- The search calls the **DummyJSON search API**.
- Results appear in a dropdown sheet below the search bar.
- Clicking a product navigates directly to the **product detail page**.

---

### 2. Client-side Filtering & Pagination

Initially, backend pagination was considered. However, this created a limitation.

**Problem**

- Brand filters depend on available product data.
- Backend pagination typically returns a **limited dataset per request (~10–20 products)**.
- Filters such as **brand and price range** rely on the complete dataset, so paginated responses can lead to incomplete filter options.

Example:

If page 1 contains brands:

```
Apple, Samsung
```

But page 2 contains:

```
Sony, Dell
```

Then brand filters derived only from page 1 would be inaccurate.

**Solution**

- Fetch **all products once** using:

```
limit=0
```

- Cache the response using **React Query (1 hour stale time)**.
- Perform **filtering and pagination on the client side**.

**Benefits**

- Accurate brand and price filtering
- Faster UI interactions
- Reduced API requests

> **Note**
>
> Client-side filtering is generally recommended only for **smaller datasets**. In real-world applications with large or frequently changing data, **backend-driven pagination, filtering, and search would typically be preferred**.
>
> In this case, the DummyJSON dataset is **small and relatively static**, and the API limitations make it difficult to derive accurate filters from paginated responses. Therefore, fetching the full dataset once and handling filtering and pagination on the client side provides a simpler and more reliable solution for this assignment.

---

### 3. Filters Stored in URL

Filter state is synchronized with **URL query parameters**, making the UI **URL-driven** instead of relying only on in-memory state.

Example:

/products?category=smartphones&brand=apple&minPrice=500&maxPrice=1000

This enables **state persistence, deep linking, and shareable filtered views**. If a user applies filters and shares the URL, another user opening that link will see the **same filtered product results**.

This follows a **configuration-driven UI pattern**, where the interface state is derived from URL parameters, improving reproducibility and navigation behavior.

---

### 4. Sliding Filter Sheet

A **side sliding filter panel** was implemented for product filtering.

Filters include:

- Search
- Categories
- Brands
- Price range

This keeps the main product grid clean while allowing easy access to filtering.

---

### 5. Applied Filter Chips

Since filters are inside a side panel, users need a quick way to see and remove applied filters.

To solve this:

- Applied filters are displayed as **chips above the product listing**.
- Each chip can be removed individually.
- A **Clear All** option removes all filters at once.

This improves visibility and usability.

---

### 6. Preserving Navigation History

Navigation was implemented in a way that preserves the user's browsing history. When a user searches for a product and navigates to its detail page, then searches for another product and navigates again, the browser history stack is maintained correctly. This allows users to use the browser's back button to step through previously visited product pages in the same order they were opened, creating a more natural and intuitive navigation experience.

---

# Improvements If Given More Time

### 1. Search Enhancements

Improve the navbar search with:

- keyboard navigation (↑ ↓ Enter)
- product thumbnails
- recent searches

### 2. UI Enhancements

- Better shimmer loading UI for images to prevent empty boxes and improve perceived loading experience.
- Smooth animations for filters
- Better mobile responsive layouts
- Add image gallery thumbnails and zoom support on the product detail page for a richer product viewing experience.

---

# Tech Stack

- React
- TypeScript
- React Query
- React Router
- TailwindCSS
- DummyJSON API

---

# Features

- Product listing
- Product detail page
- Client-side pagination
- Category filtering
- Brand filtering
- Price range filtering
- Applied filter chips
- Navbar search
- Image carousel on product page

---

# Author

Jatin Rathore
