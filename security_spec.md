# Security Specification & Payload-First TDD

## 1. Data Invariants
1. **Verified Identity Required for Writes & Private Reads**: No user can read orders, create orders, cancel orders, write reviews, or access admin routes unless `request.auth != null && request.auth.token.email_verified == true`.
2. **PII Isolation**: User email, phone number, and delivery address live in `/users/{userId}/private/info` and `/orders/{orderId}` and are strictly readable only by the owning user (`request.auth.uid == userId`) or a verified admin (`isAdmin()`).
3. **Order Lifecycle Integrity**:
   - New orders MUST be created with `status == 'wait_sending'`, `userId == request.auth.uid`, `userEmail == request.auth.token.email`, and server timestamps `createdAt == request.time && updatedAt == request.time`.
   - Order owners can ONLY transition an order from `'wait_sending'` to `'cancelled'`, updating ONLY `['status', 'updatedAt']`. Once an order reaches any non-pending state (`partial_sending`, `completed`, `refunded`, `cancelled`), owners cannot mutate it.
   - Only verified admins (`isAdmin()`) can transition orders to `'partial_sending'`, `'completed'`, `'refunded'`, or `'cancelled'` and manage `/admins`.
   - Orders cannot be deleted by clients.
4. **Admin Route & Role Integrity**:
   - Clients cannot self-assign admin roles (`/admins/{adminUid}` writes require `isAdmin()`).
   - Admin status is derived from `/admins/{request.auth.uid}` or the bootstrapped verified admin email `rexafrfr@gmail.com` (`email_verified == true`).
5. **Strict Schema & Boundary Enforcement**:
   - Every string has `.size()` bounds, every array has `.size()` bounds and first-element type validation, every ID matches `^[a-zA-Z0-9_\-]+$`, and every document rejects shadow/ghost fields via `keys().hasAll(...) && keys().hasOnly(...)`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unverified Email Order Create**: Authenticated user with `email_verified: false` attempts `create` on `/orders/order1` -> **PERMISSION_DENIED**.
2. **Order Status Forge on Create**: Verified user creates `/orders/order2` with `status: 'completed'` -> **PERMISSION_DENIED**.
3. **Identity Spoofing on Order Create**: Verified user A creates `/orders/order3` with `userId: 'userB'` -> **PERMISSION_DENIED**.
4. **Shadow Field Injection on Order Create**: Verified user creates `/orders/order4` with extra field `isPaid: true` -> **PERMISSION_DENIED**.
5. **Backdated Timestamp on Order Create**: Verified user creates `/orders/order5` with `createdAt: 1000` instead of `request.time` -> **PERMISSION_DENIED**.
6. **Non-Owner Order Read / List Scrape**: Verified user A attempts `get` or unfiltered `list` on `/orders` belonging to user B -> **PERMISSION_DENIED**.
7. **Terminal State Bypass on Order Update**: Verified owner attempts to update `/orders/order6` from `status: 'completed'` to `status: 'cancelled'` -> **PERMISSION_DENIED**.
8. **Total / Items Tampering on Order Update**: Verified owner attempts to update `total: 0.01` while cancelling `/orders/order7` -> **PERMISSION_DENIED**.
9. **Self-Assigned Admin Escalation**: Non-admin user attempts `create` on `/admins/{myUid}` -> **PERMISSION_DENIED**.
10. **Email Spoofing Admin Bypass**: User with `email: 'rexafrfr@gmail.com'` and `email_verified: false` attempts admin read on `/orders` -> **PERMISSION_DENIED**.
11. **PII Leak Attempt**: Verified user A attempts `get` on `/users/userB/private/info` -> **PERMISSION_DENIED**.
12. **ID Poisoning / Resource Exhaustion**: Verified user attempts `create` on `/reviews/<2000-char-id>` or comment > 2000 chars -> **PERMISSION_DENIED**.
