# 🧪 Quick Sandbox Testing Guide

## ✅ Fixed Issues
- ❌ **Syntax Error**: Duplicate `const data` declaration → **FIXED**
- ✅ **Server Running**: Development server on http://localhost:3000
- ✅ **Sandbox Institution**: Added to UI (not API response - this is correct)
- ✅ **Requisition Creation**: Working with `SANDBOXFINANCE_SFIN0000`

## 🚀 How to Test Right Now

### Method 1: Use the UI
1. Go to http://localhost:3000/dashboard/banks
2. Look for the **yellow sandbox testing card** at the top
3. Click "Test with Sandbox Finance" button
4. Or scroll down and select "🧪 Sandbox Finance (Test Bank)" from the institution list

### Method 2: Direct Link Test
```bash
# Test requisition creation
curl -X POST "http://localhost:3000/api/gocardless/requisitions" \
  -H "Content-Type: application/json" \
  -d '{
    "institutionId": "SANDBOXFINANCE_SFIN0000",
    "redirect": "http://localhost:3000/dashboard/banks/callback",
    "reference": "sandbox_test_123"
  }'
```

## 🎯 What to Expect

### Sandbox Login Page
- **User ID**: Enter any value (e.g., `testuser123`)
- **Code Generator**: Enter any value (e.g., `123456`)
- Click through the authentication flow

### After Authentication
- Redirected to your callback URL
- Should see "Bank connected successfully!" 
- Test data stored in Appwrite collections
- Can view connected account in dashboard

## 📊 Benefits
- ✅ No API quota consumption
- ✅ Unlimited testing
- ✅ Predictable test data
- ✅ Safe for development

## 🔧 Production Switch
When ready for production:
```env
GOCARDLESS_SANDBOX_MODE=false
```

Your sandbox integration is ready for testing! 🎉
