import prisma from "../config/db.js";

// Settings is a single-row table — always fetch or create the one record
export async function getSettings(req, res) {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateSettings(req, res) {
  try {
    const {
      businessName,
      businessEmail,
      businessAddress,
      defaultTaxRate,
      invoicePrefix,
      defaultPaymentTerms,
    } = req.body;

    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }

    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        businessName,
        businessEmail,
        businessAddress,
        defaultTaxRate,
        invoicePrefix,
        defaultPaymentTerms,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}