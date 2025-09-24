export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { getRequisition, getAccounts, getBalances, getTransactions, HttpError } from "@/lib/gocardless";
import { Databases, ID } from "appwrite";
import { createAppwriteClient } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: requisitionId } = await params;

    // Get requisition status from GoCardless
    const requisition = await getRequisition(requisitionId);
    
    if (!requisition) {
      return NextResponse.json({ ok: false, error: "Requisition not found" }, { status: 404 });
    }

    // Extract user ID from reference (format: user_[userId]_[timestamp])
    const userIdMatch = requisition.reference?.match(/user_([^_]+)_/);
    if (!userIdMatch) {
      return NextResponse.json({ ok: false, error: "Invalid reference format" }, { status: 400 });
    }
    const userId = userIdMatch[1];

    // If requisition is linked, process the accounts
    if (requisition.status === 'LINKED' && requisition.accounts && requisition.accounts.length > 0) {
      const client = createAppwriteClient();
      const databases = new Databases(client);

      try {
        // Store requisition in database - use requisition.id as document ID
        try {
          await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID as string,
            'requisitions', // Collection ID
            requisition.id, // Use GoCardless requisition ID as document ID
            {
              userId: userId,
              requisitionId: requisition.id,
              institutionId: requisition.institution_id,
              institutionName: requisition.institution_name || 'Unknown Bank',
              status: requisition.status,
              reference: requisition.reference,
            }
          );
        } catch (error) {
          console.error('Error storing requisition:', error);
        }

        // Process each account
        for (const accountId of requisition.accounts) {
          try {
            // Get account details
            const accountDetails = await getAccounts(accountId);
            
            // Store bank account in database - use GoCardless accountId as document ID
            try {
              const accountDoc = await databases.createDocument(
                process.env.APPWRITE_DATABASE_ID as string,
                'bank_accounts', // Collection ID
                accountId, // Use GoCardless account ID as document ID
                {
                  userId: userId,
                  accountId: accountId,
                  institutionId: requisition.institution_id,
                  institutionName: requisition.institution_name || 'Unknown Bank',
                  iban: accountDetails.iban || null,
                  accountName: accountDetails.name || null,
                  currency: accountDetails.currency || 'EUR',
                  status: 'active',
                  raw: JSON.stringify(accountDetails),
                }
              );

              // Get and store balances
              try {
                const balancesResponse = await getBalances(accountId);
                const balances = balancesResponse?.balances || [];
                if (balances && balances.length > 0) {
                  for (const balance of balances) {
                    try {
                      // Create unique balance ID: accountId_balanceType_referenceDate
                      const balanceId = `${accountId}_${balance.balanceType || 'closingBooked'}_${balance.referenceDate || new Date().toISOString().split('T')[0]}`;
                      await databases.createDocument(
                        process.env.APPWRITE_DATABASE_ID as string,
                        'balances', // Collection ID
                        balanceId, // Use composite ID as document ID
                        {
                          userId: userId,
                          accountId: accountId,
                          balanceAmount: balance.balanceAmount?.amount || '0',
                          currency: balance.balanceAmount?.currency || 'EUR',
                          balanceType: balance.balanceType || 'closingBooked',
                          referenceDate: balance.referenceDate || new Date().toISOString().split('T')[0],
                        }
                      );
                    } catch (error) {
                      console.error('Error storing balance:', error);
                    }
                  }
                }
              } catch (balanceError) {
                console.error(`Error fetching balances for account ${accountId}:`, balanceError);
              }

              // Get and store recent transactions
              try {
                const transactionsResponse = await getTransactions(accountId);
                const transactions = transactionsResponse?.transactions?.booked || [];
                if (transactions && transactions.length > 0) {
                  for (const transaction of transactions.slice(0, 100)) { // Limit to 100 most recent
                    try {
                      // Use GoCardless transaction ID as document ID, fallback to composite ID
                      const transactionDocId = transaction.transactionId || 
                                              transaction.internalTransactionId || 
                                              `${accountId}_${transaction.bookingDate || new Date().toISOString().split('T')[0]}_${Date.now()}`;
                      
                      await databases.createDocument(
                        process.env.APPWRITE_DATABASE_ID as string,
                        'transactions', // Collection ID
                        transactionDocId, // Use transaction ID as document ID
                        {
                          userId: userId,
                          accountId: accountId,
                          transactionId: transaction.transactionId || transaction.internalTransactionId || transactionDocId,
                          amount: transaction.transactionAmount?.amount || '0',
                          currency: transaction.transactionAmount?.currency || 'EUR',
                          bookingDate: transaction.bookingDate || null,
                          bookingDateTime: transaction.bookingDateTime || null,
                          valueDate: transaction.valueDate || null,
                          description: transaction.remittanceInformationUnstructured || transaction.additionalInformation || '',
                          counterparty: transaction.creditorName || transaction.debtorName || '',
                          raw: JSON.stringify(transaction),
                        }
                      );
                    } catch (error) {
                      console.error('Error storing transaction:', error);
                    }
                  }
                }
              } catch (transactionError) {
                console.error(`Error fetching transactions for account ${accountId}:`, transactionError);
              }
            } catch (error) {
              console.error('Error storing bank account:', error);
            }
          } catch (accountError) {
            console.error(`Error processing account ${accountId}:`, accountError);
          }
        }

        // Create bank connection record - use composite ID: userId_institutionId
        try {
          const connectionId = `${userId}_${requisition.institution_id}`;
          await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID as string,
            'bank_connections', // Collection ID
            connectionId, // Use composite ID as document ID
            {
              userId: userId,
              institutionId: requisition.institution_id,
              institutionName: requisition.institution_name || 'Unknown Bank',
              status: 'active',
              requisitionId: requisition.id,
            }
          );
        } catch (error) {
          console.error('Error storing bank connection:', error);
        }
      } catch (dbError) {
        console.error("Error storing data in database:", dbError);
        // Still return success if GoCardless connection worked
      }
    }

    return NextResponse.json({
      ok: true,
      status: requisition.status,
      institutionName: requisition.institution_name,
      accountCount: requisition.accounts?.length || 0,
      requisition
    });

  } catch (err: any) {
    console.error("Error processing requisition callback:", err);
    if (err instanceof HttpError) {
      return NextResponse.json({ ok: false, error: err.message, details: err.details }, { status: err.status });
    }
    const status = err?.status || 500;
    const message = err?.message || "Internal Server Error";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}