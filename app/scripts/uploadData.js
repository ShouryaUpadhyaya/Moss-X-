const { db } = require("../../firebase");
const { collection, setDoc, doc } = require("firebase/firestore");
const mossxJson = require("../../mossx_plant_dataset.json"); // Adjust path if needed

const uploadData = async () => {
  try {
    for (const product of mossxJson.product) {
      await setDoc(doc(db, "products", product.id), product);
    }

    for (const col of mossxJson.SeasonalCollection) {
      await setDoc(doc(db, "seasonalCollections", col.id), col);
    }

    for (const bundle of mossxJson.product_bundle) {
      await setDoc(doc(db, "productBundles", bundle.id), bundle);
    }

    console.log("✅ Upload complete.");
  } catch (e) {
    console.error("🔥 Upload failed:", e);
  }
};

uploadData();
