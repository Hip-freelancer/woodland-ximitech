# FAQ and News Category Sync - 2026-04-24

## Scope

This update adds visible FAQ sections and fixes existing news category distribution for the Woodland content audit.

## Homepage FAQ

- Homepage now renders a visible FAQ section after the news section.
- Homepage FAQ also outputs FAQ JSON-LD for SEO.
- Current homepage FAQ content is static in `src/lib/faqContent.ts`.
- Backend can later expose a homepage settings model with `faqItems` if admin-managed homepage FAQ is required.

Recommended backend shape:

```ts
faqItems: Array<{
  question: { vi: string; en: string };
  answer: { vi: string; en: string };
}>
```

## Product Detail FAQ

- Product detail pages now render visible FAQ.
- If `product.faqItems` exists, the page uses admin data.
- If `product.faqItems` is empty, the page generates fallback FAQ from product name, category, thickness, certifications, and contact labels.
- Product FAQ also outputs FAQ JSON-LD for SEO.
- The product page does not expose internal fallback/admin notes to customers.
- FAQ accordion uses a client-side animated expand/collapse interaction.

Admin already supports JSON input for `faqItems` on products.

## News Listing Pagination

- The news listing now reads `category`, `q`, and `page` from URL search params.
- News data is fetched through a paginated MongoDB query with `countDocuments`, `skip`, and `limit`.
- Each page shows one featured article plus 6 smaller article cards.
- Category filters and pagination render as real links such as `/news?category=ung-dung-noi-that&page=2`.

## Product Listing Pagination

- The product listing now reads `category`, `thickness`, `q`, and `page` from URL search params.
- Product data is fetched through a paginated MongoDB query with `countDocuments`, `skip`, and `limit`.
- Each page loads 9 products instead of sending the full catalog to the browser.
- Pagination renders as real links such as `/products?page=2`.

## Database Indexes

- `Product` now has compound indexes for visible catalog sort, category filters, and thickness filters.
- `NewsArticle` now has compound indexes for visible news sort and category filters.
- These indexes keep listing pages viable when the dataset grows beyond the current seed volume.

## News Categories

Existing 21 news articles were migrated out of the single `tin-tuc` group into topic groups:

- `ung-dung-noi-that`: 6 articles
- `kien-thuc-san-pham`: 5 articles
- `thi-truong-huong-dan-mua-plywood`: 5 articles
- `tu-van-plywood-chong-nuoc`: 3 articles
- `xu-huong-vat-lieu-xanh`: 2 articles

The legacy empty `tin-tuc` category is hidden by the migration script to avoid showing an empty menu/filter item.

Run migration:

```bash
npm run categorize:news
```

## Admin Notes

- Product FAQ should be filled per SKU in admin when real sales/technical FAQ is available.
- News category is now selected from real news categories in admin.
- Homepage FAQ is not admin-managed yet; add it to a homepage settings model if content editors need to change it without deploy.
