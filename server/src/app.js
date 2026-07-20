import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/invoicing/invoices", invoiceRoutes);
app.use("/api/invoicing/invoices", paymentRoutes);
app.use("/api/invoicing/customers", customerRoutes);
app.use("/api/invoicing/reports", reportRoutes);
app.use("/api/invoicing/settings", settingsRoutes);

app.use(errorHandler);

export default app;