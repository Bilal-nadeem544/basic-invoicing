import express from "express";
import { recordPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/:id/payments", recordPayment);

export default router;