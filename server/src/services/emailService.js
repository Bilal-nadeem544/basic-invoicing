import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sends the invoice PDF to the customer's email
export async function sendInvoiceEmail({ toEmail, invoiceNumber, pdfBuffer }) {
  await transporter.sendMail({
    from: `"Basic Invoicing Co." <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Invoice ${invoiceNumber}`,
    text: `Please find attached invoice ${invoiceNumber}.`,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}