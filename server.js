import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

//Routes imports
import adminAuthRoutes from "./routers/auth/admin.js";
import clientAuthRoutes from "./routers/auth/client.js";
import customerAuthRoutes from "./routers/auth/customer.js";
import turfRoutes from "./routers/turfs.js";
import customerRoutes from "./routers/customers.js";
import bookingRoutes from "./routers/bookings.js";
import reviewsRoutes from "./routers/reviews.js";
import customerBookingRoute from "./routers/bookingCustomer.js";
import paymentRoute from "./routers/payment.js";
import uploadRoute from "./upload.js";
import multer from "multer";
import cloudinary from "./cloudinaryConfig.js";
//Creating express app
const app = express();

//Middlewares
app.use(express.urlencoded({ extended: false }));
dotenv.config();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.ADMIN_URL,
      process.env.CLIENT_URL,
      process.env.USER_URL,
    ],
    credentials: true,
  })
);
app.use(express.json());

//Route middlewares
app.get("/", (req, res) => {
  res.sendFile(path.resolve("views/index.html"));
});
app.use("/admin/auth", adminAuthRoutes);
app.use("/client/auth", clientAuthRoutes);
app.use("/customer/auth", customerAuthRoutes);
app.use("/turfs", turfRoutes);
app.use("/bookings", bookingRoutes);
app.use("/customers", customerRoutes);
app.use("/book", customerBookingRoute);
app.use("/reviews", reviewsRoutes);
app.use("/payment", paymentRoute);

// Setup multer storage (temporary file storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where the file will be temporarily stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

// Define a POST route for uploading an image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Log the file details for debugging
  console.log("Uploaded file:", req.file);

  // Upload file to Cloudinary
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to upload image to Cloudinary", details: err });
    }
  
    console.log('Cloudinary upload result:', result);  // Log the result
    res.json({ imageUrl: result.secure_url });
  });
});

//App listener
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Api started 🤍 at ${process.env.BASE_URL + ":" + port}`);
});