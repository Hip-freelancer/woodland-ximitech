import "server-only";

import { rehostLegacyWoodlandImage, rehostLegacyWoodlandImagesInHtml } from "@/lib/legacyImageRehost";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

async function rehostImageField(
  value: unknown,
  prefix: string,
  cache: Map<string, string>
) {
  const imageUrl = asString(value).trim();

  if (!imageUrl) {
    return "";
  }

  return rehostLegacyWoodlandImage(imageUrl, prefix, cache);
}

async function rehostImageList(
  value: unknown,
  prefix: string,
  cache: Map<string, string>
) {
  const imageList = Array.isArray(value) ? value : [];

  return Promise.all(
    imageList.map((item) => rehostImageField(item, prefix, cache))
  );
}

async function rehostLocalizedHtml(
  value: unknown,
  prefix: string,
  cache: Map<string, string>
) {
  const input = asRecord(value);

  return {
    en: await rehostLegacyWoodlandImagesInHtml(asString(input.en), prefix, cache),
    vi: await rehostLegacyWoodlandImagesInHtml(asString(input.vi), prefix, cache),
  };
}

async function rehostContentBlocks(
  value: unknown,
  prefix: string,
  cache: Map<string, string>
) {
  return Promise.all(
    (Array.isArray(value) ? value : []).map(async (block, index) => {
      const nextBlock = asRecord(block);

      return {
        ...nextBlock,
        body: await rehostLocalizedHtml(
          nextBlock.body,
          `${prefix}-body-${index + 1}`,
          cache
        ),
        image: await rehostImageField(
          nextBlock.image,
          `${prefix}-image-${index + 1}`,
          cache
        ),
      };
    })
  );
}

export async function resolveAdminEntityRemoteMedia(
  entity: string,
  payload: unknown
) {
  const cache = new Map<string, string>();
  const normalizedEntity = entity.trim().toLowerCase();
  const input = asRecord(payload);

  switch (normalizedEntity) {
    case "categories":
      return {
        ...input,
        image: await rehostImageField(input.image, "categories", cache),
      };

    case "team":
      return {
        ...input,
        image: await rehostImageField(input.image, "team", cache),
      };

    case "news":
      return {
        ...input,
        contentBlocks: await rehostContentBlocks(
          input.contentBlocks,
          "news-content-block",
          cache
        ),
        content: await rehostLocalizedHtml(input.content, "news-content", cache),
        galleryImages: await rehostImageList(
          input.galleryImages,
          "news-gallery",
          cache
        ),
        image: await rehostImageField(input.image, "news-cover", cache),
      };

    case "products":
      return {
        ...input,
        applications: await Promise.all(
          (Array.isArray(input.applications) ? input.applications : []).map(
            async (application, index) => {
              const nextApplication = asRecord(application);

              return {
                ...nextApplication,
                image: await rehostImageField(
                  nextApplication.image,
                  `products-application-${index + 1}`,
                  cache
                ),
              };
            }
          )
        ),
        contentBlocks: await rehostContentBlocks(
          input.contentBlocks,
          "products-content-block",
          cache
        ),
        description: await rehostLocalizedHtml(
          input.description,
          "products-description",
          cache
        ),
        galleryImages: await rehostImageList(
          input.galleryImages,
          "products-gallery",
          cache
        ),
        image: await rehostImageField(input.image, "products-cover", cache),
      };

    case "home-settings":
      return {
        ...input,
        heroSlides: await Promise.all(
          (Array.isArray(input.heroSlides) ? input.heroSlides : []).map(
            async (slide, index) => {
              const nextSlide = asRecord(slide);
              const mediaType = asString(nextSlide.mediaType);
              const mediaUrl =
                mediaType === "image"
                  ? await rehostImageField(
                      nextSlide.mediaUrl,
                      `home-slide-${index + 1}`,
                      cache
                    )
                  : asString(nextSlide.mediaUrl);

              return {
                ...nextSlide,
                mediaUrl,
                posterUrl: await rehostImageField(
                  nextSlide.posterUrl,
                  `home-slide-poster-${index + 1}`,
                  cache
                ),
              };
            }
          )
        ),
      };

    default:
      return payload;
  }
}
