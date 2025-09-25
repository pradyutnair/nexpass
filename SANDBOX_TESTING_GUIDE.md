# 🧪 GoCardless Sandbox Testing Guide

## Overview
This guide shows how to test your bank connection flow using GoCardless Sandbox Finance without consuming live API connections.

## Sandbox Institution Details
- **Institution ID**: `SANDBOXFINANCE_SFIN0000`
- **Name**: Sandbox Finance (Test Bank)
- **BIC**: `SFIN0000`
- **Available in**: All countries
- **Transaction History**: 730 days
- **Access Valid**: 90 days

## How to Test

### 1. **Select Sandbox Finance**
- Go to `/dashboard/banks`
- Look for "🧪 Sandbox Finance (Test Bank)" at the top of the institution list
- Click to select it

### 2. **Authentication Flow**
When redirected to the Sandbox Finance login page:
- **User ID**: Enter any value (e.g., `testuser123`)
- **Code Generator**: Enter any value (e.g., `123456`)
- **Any other fields**: Use any test values

### 3. **Expected Results**
After successful authentication, you should:
- Be redirected back to your callback URL
- See "Bank connected successfully!" message
- Have test data stored in your Appwrite collections:
  - Requisitions
  - Bank connections
  - Bank accounts
  - Account balances
  - Transaction history

### 4. **Test Data Available**
The sandbox provides:
- ✅ **Mock account details** (IBAN, name, currency)
- ✅ **Sample balances** (various balance types)
- ✅ **Transaction history** (up to 730 days of test transactions)
- ✅ **All API responses** similar to real bank connections

## Environment Variables
```env
# Enable sandbox mode for testing
GOCARDLESS_SANDBOX_MODE=true
```

## Verification Steps
1. Check Appwrite Console for new documents in:
   - `requisitions` collection
   - `bank_connections` collection  
   - `bank_accounts` collection
   - `balances` collection
   - `transactions` collection

2. Verify data structure matches your schema
3. Test dashboard display of connected accounts
4. Verify transaction history and balances

## Benefits of Sandbox Testing
- ✅ **No API quota consumption**
- ✅ **Predictable test data**
- ✅ **Fast iteration cycles**
- ✅ **No real bank credentials needed**
- ✅ **Safe for development/staging**

## Production Readiness
Once sandbox testing is complete:
1. Set `GOCARDLESS_SANDBOX_MODE=false`
2. Remove sandbox institution from UI (optional)
3. Test with real institutions in production environment

## Troubleshooting
- **Requisition not found**: Check if using correct requisition ID from callback
- **Data not storing**: Verify Appwrite collections exist with correct schema
- **Authentication errors**: Check API keys and environment variables
- **Callback issues**: Ensure redirect URL matches exactly

## Next Steps
1. Test complete user flow with sandbox
2. Verify all data is stored correctly
3. Test dashboard display of connected accounts
4. Move to production testing with real institutions
