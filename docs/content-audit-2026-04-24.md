# Content Audit 2026-04-24

## Scope

- Compare current local data against:
  - `https://woodland.vn/tin-tuc`
  - `https://woodland.vn/tin-tuc?page=2`
  - `https://woodland.vn/san-pham`
  - `https://woodland.vn/san-pham?page=5`
- Review current local models and seeded data.

## Quantity Check

- News:
  - Old site archive shows `Page 1/2` and `Page 2/2`.
  - Archive listing shows `21` articles in total.
  - Local DB currently has `21` news articles.
  - Conclusion: current news quantity matches the crawled archive.

- Products:
  - Current seed context in `docs/woodland-old-site-context.md` contains `35` product detail pages and `8` product catalog pages.
  - Local DB currently has `35` products.
  - Conclusion: current product quantity matches the existing crawl dataset.

## Current Local Data Summary

- Products:
  - `35` total
  - `34` have more than one gallery image
  - `35` have specifications
  - `29` have certifications
  - `0` have application blocks

- News:
  - `21` total
  - `20` have tags
  - `21` have SEO fields
  - only `1` news category is currently stored

## Field Gap Check

### News

Old article pages currently expose more structure than the local model stores cleanly:

- breadcrumb context
- table of contents / heading structure
- inline body images
- related news block
- share block

Current local model `src/models/NewsArticle.ts` only stores:

- `title`
- `content`
- `excerpt`
- `image`
- `author`
- `publishDate`
- `slug`
- `category`
- `tags`
- `seo`

Missing model candidates if we want closer parity with the old site:

- `galleryImages: string[]`
- `contentBlocks` or `sections`
- `toc: Array<{ id, title, level }>`
- `relatedSlugs: string[]`
- `sourceUrl`

### Products

Old product pages currently expose richer presentation blocks than the local model fully preserves:

- large gallery set
- contact / price block (`Liên hệ`)
- tab structure (`Mô tả`, `Đánh giá (0)`)
- richer long-form sections in body content
- some pages include extra visual blocks beyond the current normalized fields

Current local model `src/models/Product.ts` already stores a good base:

- cover image
- gallery images
- specifications
- certifications
- dimensions
- thickness
- material / bonding / grade

Still missing if we want closer parity with old product detail pages:

- `contactLabel` or `priceLabel`
- `reviewCount`
- `contentBlocks` / long-form section structure
- `downloads` / certificates / files if needed later
- `sourceUrl`

## R2 Status

- Main seeded cover images are already being rehosted to R2 by `src/scripts/seedWoodlandCrawl.ts`.
- Missing parity is mostly in extra body media and extra structured fields, not just cover media.
- If we crawl again for full parity, extra inline images and optional media should also be rehosted to R2 instead of being linked from `woodland.vn`.

## Recommended Next Step

1. Extend product and news models with the missing fields above.
2. Add a dedicated recrawl script for:
   - inline news images
   - related article references
   - richer product body sections
   - optional review/contact metadata
3. Rehost every newly discovered media asset to R2.
4. Reseed Mongo after field mapping is finalized.
