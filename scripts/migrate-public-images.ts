import ImageKit from "imagekit";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

const PUBLIC_DIR = path.resolve(__dirname, "../public");

async function migratePublicImages() {
  const files = fs.readdirSync(PUBLIC_DIR).filter((f) =>
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f)
  );

  console.log(`Found ${files.length} images in /public\n`);

  const urlMap: Record<string, string> = {};
  let success = 0;
  let failed = 0;

  for (const fileName of files) {
    try {
      const filePath = path.join(PUBLIC_DIR, fileName);
      const fileBuffer = fs.readFileSync(filePath);

      console.log(`Uploading: ${fileName}...`);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: "/static",
      });

      urlMap[`/${fileName}`] = response.url;
      console.log(`✅ ${fileName} → ${response.url}`);
      success++;
    } catch (err) {
      console.error(`❌ Failed: ${fileName}`, err);
      failed++;
    }
  }

  console.log(`\n--- Upload Complete ---`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\n--- URL Mapping ---`);
  console.log(JSON.stringify(urlMap, null, 2));

  // Save mapping to a file for easy reference
  fs.writeFileSync(
    path.resolve(__dirname, "public-image-urls.json"),
    JSON.stringify(urlMap, null, 2)
  );
  console.log(`\nSaved URL mapping to scripts/public-image-urls.json`);
}

migratePublicImages();
