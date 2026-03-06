# ShopHub Product App

A React-based product browsing application built using **React, TypeScript, React Query, and TailwindCSS**.
Users can browse products, filter them, search for products from the navbar, and view detailed product pages.

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

or

```bash
yarn install
```

## 3. Run the development server

```bash
npm run dev
```

or

```bash
yarn dev
```

The app will run at:

```
http://localhost:5173
```

---

# Architectural Decisions

### 1. Logo Instead of Menu Icon

The original menu icon was replaced with a **ShopHub logo (ShoppingBag icon + text)** to make the navbar feel more like a real ecommerce product interface.

---

### 2. Navbar Search Feature

A search feature was added to the navbar:

- Users can search products directly from the navigation bar.
- The search calls the **DummyJSON search API**.
- Results appear in a dropdown sheet below the search bar.
- Clicking a product navigates directly to the **product detail page**.

---

### 3. Client-side Filtering & Pagination

Initially, backend pagination was considered. However, this created a limitation.

**Problem:**

- Brand filters depend on available product data.
- Backend pagination returns only **10 products per request**.
- This means brand options would be incomplete and filters could behave incorrectly.

Example:

If page 1 contains brands:

```
Apple, Samsung
```

But page 2 contains:

```
Sony, Dell
```

Then brand filters would be inaccurate.

**Solution:**

- Fetch **all products once** using:

```
limit=0
```

- Cache the response using **React Query with 1 hour stale time**.
- Perform **filtering and pagination on the client side**.

Benefits:

- Accurate brand filtering
- Faster UI interactions
- Reduced API requests

> **Note**
>
> Initially, API-based pagination (`limit` and `skip`) was considered. However, the assignment requires extracting **unique brands from the product data** to build the brand filter. With server-side pagination, each request returns only a **limited subset of products**, which means the extracted brands would be incomplete. This would cause filters like **brand and price range** to behave inconsistently.
>
> One possible approach was to dynamically update the brand list on every page change, but this would make filter options unstable and filtering would only apply to a small dataset.
>
> Since the DummyJSON dataset is **small and relatively static**, a better approach was to **fetch all products once**, cache them using React Query, and implement **filtering and pagination on the client side**. This ensures filters work on the **complete dataset** and provides faster UI interactions.

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

### 6. Filters Stored in URL

Applied filters are stored in the URL query parameters. This allows filters to persist when navigating between pages (for example, visiting a product detail page and returning back). It also enables accurate sharing of filtered product lists through URLs, ensuring that the same filtered state is restored when the link is opened.

---

### 7. Preserving Navigation History

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
