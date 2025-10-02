// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "police_reports_preset");
  formData.append("folder", "police_reports");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  console.log("response", response);
  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};

// export const uploadImage = async (filePath: string) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: "police_reports",
//     });
//     return result.secure_url;
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     throw error;
//   }
// };

// export const deleteImage = async (publicId: string) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//     throw error;
//   }
// };

// Example usage:
// (async () => {
//   const imageUrl = await uploadImage("path/to/your/image.jpg");
//   console.log("Uploaded image URL:", imageUrl);
// })();

// (async () => {
//   const deleteResult = await deleteImage("police_reports/your_image_public_id");
//   console.log("Delete result:", deleteResult);
// })();
// import { v2 as cloudinary } from "cloudinary";
// import { UploadApiResponse } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
