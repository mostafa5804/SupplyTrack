# SupplyTrack: Usage Tutorial

Welcome to the SupplyTrack tutorial! This guide walks you through the core workflow of requesting, approving, sourcing, and delivering items.

## 1. Creating a Request (Requester)
1. Log in using the username `reza` (password: `password`).
2. Navigate to **"درخواست‌های من"** (My Requests).
3. Click the **"ثبت درخواست جدید"** (New Request) button.
4. Fill in the item name, required quantity, and unit. You can add multiple items to a single request.
5. Submit the form. The request status will now be **"در انتظار تأیید سرپرست"** (Pending Supervisor Approval).

## 2. Supervisor Approval (Supervisor)
1. Log out and log in as `hasan` (password: `password`).
2. Navigate to **"تأییدات"** (Approvals).
3. You will see the request created by Reza.
4. You can edit the approved quantities if necessary. 
5. Click **"تأیید درخواست"** (Approve Request). The status changes to **"بررسی انبار"** (Warehouse Check).

## 3. Warehouse Check (Storekeeper)
1. Log out and log in as `maryam` (password: `password`).
2. Navigate to **"انبار"** (Warehouse).
3. Find the approved request. Here you must define how much of the requested quantity will be supplied from the current warehouse stock (**تامین از انبار**) and how much needs to be purchased (**نیاز به خرید**).
4. If there is a shortage, the system automatically sets the request status to **"در انتظار خرید"** (Pending Purchase).
5. **Inventory Tab:** While in the Warehouse, switch to the **"موجودی کالا"** (Inventory) tab to view real-time inventory. If any item falls below its minimum threshold, you will receive a toast notification alert.

## 4. Purchasing (Purchaser)
1. Log out and log in as `sina` (password: `password`).
2. Navigate to **"لیست خرید"** (Purchase List).
3. The system consolidates all shortages. You can input the exact amount you have purchased for each requested item.
4. Once you click **"ثبت مقادیر خریداری شده"** (Log Purchased Quantities), the system moves the request to the final delivery stage.

## 5. Final Delivery (Storekeeper)
1. Log back in as `maryam` (password: `password`) and go to the Warehouse.
2. The request is now in **"آماده تحویل"** (Ready for Delivery) state.
3. You will see both the items supplied from the warehouse and the items purchased by the procurement team.
4. Enter the final delivered quantity and click **"ثبت مقدار تحویلی"** (Log Delivered Quantity). 
5. If the entire request is fulfilled, the status turns green indicating **"تحویل شده"** (Completed).

Congratulations! You have successfully traced an item request through the complete supply chain lifecycle.
