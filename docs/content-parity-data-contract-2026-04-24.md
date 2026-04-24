# Content parity data contract 2026-04-24

## Muc tieu

Theo `docs/content-audit-2026-04-24.md`, dot nay bo sung cac field de giu parity tot hon voi site cu `woodland.vn` cho news va product detail.

## NewsArticle fields moi

- `galleryImages: string[]`
- `contentBlocks: Array<{ type, order, title: { en, vi }, body: { en, vi }, image }>`
- `toc: Array<{ id, title, level }>`
- `relatedSlugs: string[]`
- `sourceUrl: string`
- `faqItems: Array<{ order, question: { en, vi }, answer: { en, vi } }>`

Ghi chu media:

- `news.image`, `news.galleryImages`, `news.content` img va `news.contentBlocks[].image/body` se duoc re-host ve R2 khi luu qua admin API.
- `toc` va `relatedSlugs` co the lay tu script recrawl, nhung nen review truoc khi apply vao DB that.

## Product fields moi

- `contactLabel: { en, vi }`
- `priceLabel: { en, vi }`
- `reviewCount: number`
- `contentBlocks: Array<{ type, order, title: { en, vi }, body: { en, vi }, image }>`
- `downloads: Array<{ label: { en, vi }, url }>`
- `sourceUrl: string`
- `faqItems: Array<{ order, question: { en, vi }, answer: { en, vi } }>`

Ghi chu media:

- `products.galleryImages`, `products.description` img, `products.applications[].image`, va `products.contentBlocks[].image/body` se duoc re-host ve R2 khi luu qua admin API.
- `downloads[].url` chua bi re-host vi audit chi de mo nhu optional certificates/files sau nay.

## Script recrawl parity

Lenh:

```bash
npm run recrawl:woodland-parity
```

Output mac dinh:

- `docs/content-parity-recrawl-output.json`

Script doc URL tu `docs/woodland-old-site-context.md`, crawl lai cac page `news-pages` va `product-detail-pages`, sau do xuat:

- inline/gallery images
- TOC tu `h2/h3`
- related slugs trong news
- product contact/price/review metadata co the doc duoc tu HTML
- `sourceUrl`

Output nay la staging artifact de Backend/Dev review mapping truoc khi reseed Mongo hoac viet job apply vao DB.

## Trang thai DB hien tai sau khi them schema

Kiem tra local DB ngay sau thay doi code:

- News: `21`
- Products: `35`
- News categories hien tai trong DB: `1`
- Product categories hien tai trong DB: `6`
- News dang nam toan bo o `tin-tuc`: `21`
- Product co SEO title/description: `35/35`
- News co SEO title/description: `21/21`
- Product/News co FAQ that trong DB: `0`
- Product/News co `sourceUrl` that trong DB: `0`
- Product/News co `contentBlocks` that trong DB: `0`

Ket luan:

- Schema da san sang nhan du lieu parity/FAQ.
- DB hien tai chua du parity vi chua chay recrawl/apply vao Mongo.
- Seed moi da chia news category theo rule noi dung, nhung DB hien tai van can reseed hoac migration rieng de cap nhat.
