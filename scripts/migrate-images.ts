import { createClient } from "@supabase/supabase-js";
import ImageKit from "imagekit";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

async function migrateUrl(url: string, name: string, folder: string): Promise<string | null> {
  if (!url || url.includes("imagekit.io")) return null; // already migrated or empty

  const response = await imagekit.upload({
    file: url,        // ImageKit fetches from this Supabase URL
    fileName: name,
    folder,
  });

  return response.url;
}

async function migrate() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, image_url, additional_images");

  if (error) {
    console.error("Failed to fetch products:", error);
    return;
  }

  if (!products || products.length === 0) {
    console.log("No products found.");
    return;
  }

  console.log(`Found ${products.length} products to migrate.\n`);

  let success = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const updateData: Record<string, any> = {};

      // --- Migrate main image ---
      if (product.image_url && !product.image_url.includes("imagekit.io")) {
        console.log(`  Migrating main image for product ${product.id}...`);
        const newUrl = await migrateUrl(
          product.image_url,
          `product-${product.id}`,
          "/products"
        );
        if (newUrl) updateData.image_url = newUrl;
      } else {
        console.log(`⏭️  Skipping main image for product ${product.id} — already migrated or empty`);
      }

      // --- Migrate additional images ---
      const additionalImages: string[] = product.additional_images || [];
      if (additionalImages.length > 0) {
        const migratedAdditional: string[] = [];

        for (let i = 0; i < additionalImages.length; i++) {
          const imgUrl = additionalImages[i];
          if (imgUrl.includes("imagekit.io")) {
            migratedAdditional.push(imgUrl); // already done
          } else {
            console.log(`  Migrating additional image ${i + 1} for product ${product.id}...`);
            const newUrl = await migrateUrl(
              imgUrl,
              `product-${product.id}-extra-${i + 1}`,
              "/products"
            );
            migratedAdditional.push(newUrl || imgUrl); // fallback to original if upload fails
          }
        }

        updateData.additional_images = migratedAdditional;
      }

      // --- Update DB if anything changed ---
      if (Object.keys(updateData).length === 0) {
        console.log(`⏭️  Nothing to migrate for product ${product.id}\n`);
        continue;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", product.id);

      if (updateError) {
        console.error(`❌ DB update failed for product ${product.id}:`, updateError);
        failed++;
        continue;
      }

      console.log(`✅ Migrated product ${product.id}\n`);
      success++;
    } catch (err) {
      console.error(`❌ Failed for product ${product.id}:`, err);
      failed++;
    }
  }

  console.log(`\n--- Migration Complete ---`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
}

migrate();