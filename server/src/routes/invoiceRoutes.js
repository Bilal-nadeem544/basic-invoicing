import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  cancelInvoice,
  downloadInvoicePDF,
  emailInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/", getInvoices);
router.post("/", createInvoice);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoice);
router.delete("/:id", cancelInvoice);
router.post("/:id/send", emailInvoice);
router.get("/:id/pdf", downloadInvoicePDF);

export default router;