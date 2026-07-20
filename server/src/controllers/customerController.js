import prisma from "../config/db.js";

export async function createCustomer(req, res) {
  try {
    const { name, email, phone, address } = req.body;
    const customer = await prisma.customer.create({
      data: { name, email, phone, address },
    });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCustomers(req, res) {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}