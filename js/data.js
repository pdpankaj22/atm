// Initial Seed Data from original SQLite Database
const SEED_DATA = {
  "users": [
    {
      "account_number": "989555",
      "name": "ketki gaikwad",
      "pin": "9988",
      "balance": 51900.0,
      "email": null,
      "phone": null
    },
    {
      "account_number": "989666",
      "name": "om nanaware",
      "pin": "9988",
      "balance": 50900.0,
      "email": null,
      "phone": null
    },
    {
      "account_number": "989777",
      "name": "raj jaiswar",
      "pin": "0707",
      "balance": 11500.0,
      "email": null,
      "phone": null
    },
    {
      "account_number": "989888",
      "name": "prachee wakode",
      "pin": "9988",
      "balance": 0.0,
      "email": null,
      "phone": null
    },
    {
      "account_number": "123456789",
      "name": "om nanaware",
      "pin": "9988",
      "balance": 8000.0,
      "email": null,
      "phone": null
    },
    {
      "account_number": "989000",
      "name": "aryan sawaisraje",
      "pin": "456",
      "balance": 11250.0,
      "email": null,
      "phone": null
    },
    {
      "account_number": "666666",
      "name": "om nanaware",
      "pin": "456",
      "balance": 1250.0,
      "email": null,
      "phone": null
    }
  ],
  "transactions": [
    {
      "id": 1,
      "account_number": "989555",
      "type": "Deposit",
      "amount": 100000.0,
      "balance_after": 100000.0,
      "date": "2025-03-04 17:43:27"
    },
    {
      "id": 2,
      "account_number": "989555",
      "type": "Withdraw",
      "amount": 100.0,
      "balance_after": 99900.0,
      "date": "2025-03-04 17:43:39"
    },
    {
      "id": 3,
      "account_number": "989666",
      "type": "Deposit",
      "amount": 1000.0,
      "balance_after": 1000.0,
      "date": "2025-03-04 17:44:47"
    },
    {
      "id": 4,
      "account_number": "989666",
      "type": "Transfer Sent",
      "amount": 1000.0,
      "balance_after": 0.0,
      "date": "2025-03-04 17:46:39"
    },
    {
      "id": 5,
      "account_number": "989555",
      "type": "Transfer Received",
      "amount": 1000.0,
      "balance_after": 100900.0,
      "date": "2025-03-04 17:46:39"
    },
    {
      "id": 6,
      "account_number": "989555",
      "type": "Transfer Sent",
      "amount": 50000.0,
      "balance_after": 50900.0,
      "date": "2025-03-04 17:47:29"
    },
    {
      "id": 7,
      "account_number": "989666",
      "type": "Transfer Received",
      "amount": 50000.0,
      "balance_after": 50000.0,
      "date": "2025-03-04 17:47:29"
    },
    {
      "id": 8,
      "account_number": "989666",
      "type": "Transfer Sent",
      "amount": 100.0,
      "balance_after": 49900.0,
      "date": "2025-03-04 17:55:29"
    },
    {
      "id": 9,
      "account_number": "989555",
      "type": "Transfer Received",
      "amount": 100.0,
      "balance_after": 51000.0,
      "date": "2025-03-04 17:55:29"
    },
    {
      "id": 10,
      "account_number": "989777",
      "type": "Deposit",
      "amount": 10000.0,
      "balance_after": 10000.0,
      "date": "2025-03-04 18:03:35"
    },
    {
      "id": 11,
      "account_number": "989555",
      "type": "Transfer Sent",
      "amount": 1000.0,
      "balance_after": 50000.0,
      "date": "2025-04-22 06:53:26"
    },
    {
      "id": 12,
      "account_number": "989666",
      "type": "Transfer Received",
      "amount": 1000.0,
      "balance_after": 50900.0,
      "date": "2025-04-22 06:53:26"
    },
    {
      "id": 13,
      "account_number": "989888",
      "type": "Deposit",
      "amount": 1000.0,
      "balance_after": 1000.0,
      "date": "2025-04-22 15:31:19"
    },
    {
      "id": 14,
      "account_number": "989888",
      "type": "Withdraw",
      "amount": 100.0,
      "balance_after": 900.0,
      "date": "2025-04-22 15:31:33"
    },
    {
      "id": 15,
      "account_number": "989888",
      "type": "Transfer Sent",
      "amount": 900.0,
      "balance_after": 0.0,
      "date": "2025-04-22 15:31:53"
    },
    {
      "id": 16,
      "account_number": "989555",
      "type": "Transfer Received",
      "amount": 900.0,
      "balance_after": 50900.0,
      "date": "2025-04-22 15:31:53"
    },
    {
      "id": 17,
      "account_number": "123456789",
      "type": "Deposit",
      "amount": 10000.0,
      "balance_after": 10000.0,
      "date": "2025-04-22 17:45:43"
    },
    {
      "id": 18,
      "account_number": "123456789",
      "type": "Withdraw",
      "amount": 1000.0,
      "balance_after": 9000.0,
      "date": "2025-04-22 17:45:53"
    },
    {
      "id": 19,
      "account_number": "123456789",
      "type": "Transfer Sent",
      "amount": 1000.0,
      "balance_after": 8000.0,
      "date": "2025-04-22 17:46:25"
    },
    {
      "id": 20,
      "account_number": "989555",
      "type": "Transfer Received",
      "amount": 1000.0,
      "balance_after": 51900.0,
      "date": "2025-04-22 17:46:25"
    },
    {
      "id": 21,
      "account_number": "989000",
      "type": "Deposit",
      "amount": 15000.0,
      "balance_after": 15000.0,
      "date": "2025-09-19 15:35:46"
    },
    {
      "id": 22,
      "account_number": "989000",
      "type": "Withdraw",
      "amount": 1000.0,
      "balance_after": 14000.0,
      "date": "2025-09-19 15:35:54"
    },
    {
      "id": 23,
      "account_number": "989000",
      "type": "Transfer Sent",
      "amount": 1500.0,
      "balance_after": 12500.0,
      "date": "2025-09-19 15:36:34"
    },
    {
      "id": 24,
      "account_number": "989777",
      "type": "Transfer Received",
      "amount": 1500.0,
      "balance_after": 11500.0,
      "date": "2025-09-19 15:36:34"
    },
    {
      "id": 25,
      "account_number": "989000",
      "type": "Deposit",
      "amount": 1000.0,
      "balance_after": 13500.0,
      "date": "2025-09-19 15:40:23"
    },
    {
      "id": 26,
      "account_number": "989000",
      "type": "Withdraw",
      "amount": 1000.0,
      "balance_after": 12500.0,
      "date": "2025-09-19 15:40:30"
    },
    {
      "id": 27,
      "account_number": "989000",
      "type": "Transfer Sent",
      "amount": 1250.0,
      "balance_after": 11250.0,
      "date": "2025-09-19 15:40:43"
    },
    {
      "id": 28,
      "account_number": "666666",
      "type": "Transfer Received",
      "amount": 1250.0,
      "balance_after": 1250.0,
      "date": "2025-09-19 15:40:43"
    }
  ]
};
