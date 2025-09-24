# Appwrite Collections Setup for GoCardless Integration

## Required Collections in Appwrite Console

Go to your Appwrite Console and create these collections in the `finance` database:

### 1. users_private
**Collection ID:** `users_private`

**Attributes:**
- `userId` (String, Required, Size: 255) - equals Account.$id
- `role` (String, Size: 50, Default: "user")
- `email` (String, Size: 255)
- `name` (String, Size: 255)

**Indexes:**
- `idx_users_private_userId` on `userId` (Unique: true)

**Permissions:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

### 2. requisitions
**Collection ID:** `requisitions`

**Attributes:**
- `userId` (String, Required, Size: 255)
- `requisitionId` (String, Required, Size: 255)
- `institutionId` (String, Required, Size: 255)
- `institutionName` (String, Size: 255)
- `status` (String, Required, Size: 50)
- `reference` (String, Size: 255)

**Indexes:**
- `idx_reqs_user` on `userId`
- `uniq_requisitionId` on `requisitionId` (Unique: true)

**Permissions:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

### 3. bank_connections
**Collection ID:** `bank_connections`

**Attributes:**
- `userId` (String, Required, Size: 255)
- `institutionId` (String, Required, Size: 255)
- `institutionName` (String, Size: 255)
- `status` (String, Required, Size: 50)
- `requisitionId` (String, Size: 255)

**Indexes:**
- `idx_conn_user` on `userId`
- `idx_conn_status` on `status`

**Permissions:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

### 4. bank_accounts
**Collection ID:** `bank_accounts`

**Attributes:**
- `userId` (String, Required, Size: 255)
- `accountId` (String, Required, Size: 255)
- `institutionId` (String, Required, Size: 255)
- `institutionName` (String, Size: 255)
- `iban` (String, Size: 50)
- `accountName` (String, Size: 255)
- `currency` (String, Required, Size: 3)
- `status` (String, Required, Size: 50)
- `raw` (String, Size: 10000)

**Indexes:**
- `idx_accts_user` on `userId`
- `uniq_acct_id` on `accountId` (Unique: true)

**Permissions:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

### 5. balances
**Collection ID:** `balances`

**Attributes:**
- `userId` (String, Required, Size: 255)
- `accountId` (String, Required, Size: 255)
- `balanceAmount` (String, Required, Size: 50)
- `currency` (String, Required, Size: 3)
- `balanceType` (String, Required, Size: 50)
- `referenceDate` (String, Required, Size: 10)

**Indexes:**
- `idx_balances_user` on `userId`
- `idx_balances_account` on `accountId`

**Permissions:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

### 6. transactions
**Collection ID:** `transactions`

**Attributes:**
- `userId` (String, Required, Size: 255)
- `accountId` (String, Required, Size: 255)
- `transactionId` (String, Required, Size: 255)
- `amount` (String, Required, Size: 50)
- `currency` (String, Required, Size: 3)
- `bookingDate` (String, Size: 10)
- `bookingDateTime` (String, Size: 25)
- `valueDate` (String, Size: 10)
- `description` (String, Size: 500)
- `counterparty` (String, Size: 255)
- `raw` (String, Size: 10000)

**Indexes:**
- `idx_txn_user` on `userId`
- `idx_txn_account` on `accountId`
- `uniq_txn_id` on `transactionId` (Unique: true)

**Permissions:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

## Environment Variables to Add

Add these to your `.env` file:

```env
# Banking Collections (Server-side)
APPWRITE_REQUISITIONS_COLLECTION_ID=requisitions
APPWRITE_BANK_CONNECTIONS_COLLECTION_ID=bank_connections
APPWRITE_BANK_ACCOUNTS_COLLECTION_ID=bank_accounts
APPWRITE_BALANCES_COLLECTION_ID=balances
APPWRITE_TRANSACTIONS_COLLECTION_ID=transactions
```

## Setup Steps

1. Create each collection with the exact Collection ID specified
2. Add all attributes with the exact types and sizes
3. Create the indexes as specified
4. Set permissions to allow `users` for all operations
5. Add the environment variables to your `.env` file
6. Restart your development server

Once complete, the bank connection flow will work end-to-end!
