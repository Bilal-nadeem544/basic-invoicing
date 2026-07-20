import express from "express";
import { createCustomer, getCustomers } from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getCustomers);
router.post("/", createCustomer);

export default router;