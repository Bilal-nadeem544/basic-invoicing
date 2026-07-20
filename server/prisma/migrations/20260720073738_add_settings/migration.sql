-- CreateTable
CREATE TABLE `Settings` (
    `id` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL DEFAULT '',
    `businessEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `businessAddress` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultTaxRate` DOUBLE NOT NULL DEFAULT 10,
    `invoicePrefix` VARCHAR(191) NOT NULL DEFAULT 'INV-',
    `defaultPaymentTerms` VARCHAR(191) NOT NULL DEFAULT 'Net 15',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
