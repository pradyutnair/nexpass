# Nexpass - Personal Finance Dashboard

A modern personal finance dashboard with glassmorphism design, integrated with Appwrite for authentication and GoCardless for bank data.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Appwrite project setup
- Google OAuth credentials
- GoCardless Bank Account Data API access

### Environment Setup
Create a `.env` file in the root directory with the following variables:

#### **Minimal Setup (Authentication Only):**
```env
# Appwrite Configuration (Required)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# Database and Collection IDs (Required for user management)
NEXT_PUBLIC_APPWRITE_DATABASE_ID=finance
NEXT_PUBLIC_APPWRITE_USERS_PRIVATE_COLLECTION_ID=users_private

# Google OAuth Configuration (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
```

#### **Complete Setup (With Banking Integration):**
```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# Database and Collection IDs (Public - needed for client-side operations)
NEXT_PUBLIC_APPWRITE_DATABASE_ID=finance
NEXT_PUBLIC_APPWRITE_USERS_PRIVATE_COLLECTION_ID=users_private

# Server-side Collection IDs (for Banking Functions)
APPWRITE_REQUISITIONS_COLLECTION_ID=requisitions
APPWRITE_BANK_CONNECTIONS_COLLECTION_ID=bank_connections
APPWRITE_BANK_ACCOUNTS_COLLECTION_ID=bank_accounts
APPWRITE_BALANCES_COLLECTION_ID=balances
APPWRITE_TRANSACTIONS_COLLECTION_ID=transactions
APPWRITE_AUDIT_LOGS_COLLECTION_ID=audit_logs

# Server API Key (for Functions)
APPWRITE_API_KEY=your_server_api_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# GoCardless Configuration (for Banking Integration)
GC_BAD_BASE_URL=https://bankaccountdata.gocardless.com/api
GC_BAD_ACCESS_TOKEN=your_gocardless_token
GC_REDIRECT_URI=https://yourdomain.com/api/gocardless/callback

# Encryption Key for tokens (32 characters)
ENCRYPTION_KEY=your_32_character_encryption_key
```

## 🛠️ Development Guide

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Appwrite Database**
   - Create database named `finance`
   - Create collections as specified in the environment variables
   - Enable document security with user-based permissions

3. **Setup Google OAuth**
   - Configure Google OAuth in Appwrite Console
   - Add your domain to authorized redirect URIs

4. **Run the application**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Features

- **Email/Password authentication** with signup and signin
- **Google OAuth integration** via Appwrite
- **Protected routes** with automatic redirects
- **User session management** with logout functionality
- **Beautiful glassmorphism UI** with monochrome design

## 🏦 Banking Integration

- **GoCardless Bank Account Data API** integration
- **Secure token encryption** for stored credentials
- **Transaction synchronization** and categorization
- **Multi-bank account support**

## 💡 Additional Notes

- This project uses **Appwrite** for backend services and authentication
- **GoCardless** provides secure bank data access via PSD2
- All sensitive data is encrypted and stored securely
- Refer to the [Appwrite documentation](https://appwrite.io/docs) for detailed integration guidance