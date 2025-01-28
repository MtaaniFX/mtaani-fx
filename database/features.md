**I. Administrator Dashboard**

This dashboard provides a comprehensive overview of the application's financial status and user activity.

*   **Section 1: Financial Overview**
    *   **Total Principal Deposited:** The sum of all verified deposits across all accounts.
    *   **Total Interest Earned (Cumulative):** The total interest earned by all accounts to date.
    *   **Total Interest Paid:** The total amount of interest that has been paid out to users.
    *   **Pending Interest:** The total amount of interest earned but not yet paid out.
    *   **Total Principal Withdrawn:** The total amount of principal withdrawn by users.
    *   **Total Referral Bonuses Paid:** The sum of all referral bonuses awarded.
    *   **Net Position:** A calculated value representing the overall financial position (e.g., Total Principal Deposited - Total Principal Withdrawn - Total Interest Paid - Total Referral Bonuses Paid).
    *   **Visualizations:** Charts (e.g., line graphs, bar charts) showing trends for deposits, interest, withdrawals, and net position over time.

*   **Section 2: User Activity and Management**
    *   **New User Registrations:** Number of new user registrations within a selected time period (e.g., daily, weekly, monthly).
    *   **User Verification Queue:** A list of users pending verification, with options to approve or reject verifications.
    *   **Active Users:** Number of users who have logged in or performed actions within a given time period.
    *   **User Search/Filter:** A component to search for users by name, email, phone number, or referral code and filter by account type, verification status, etc.
    *   **User List:** A table displaying a list of all users with their key information (name, email, account type, referral code, total deposited, etc.) and links to individual user profiles.

*   **Section 3: Group Activity and Management**
    *   **New Group Registrations:** Number of new group registrations within a selected time period.
    *   **Group Verification Queue:** A list of groups pending verification, with options to approve or reject verifications.
    *   **Active Groups:** Number of groups that have had activity (deposits, member additions, etc.) within a given time period.
    *   **Group Search/Filter:** A component to search for groups by name or referral code and filter by verification status, etc.
    *   **Group List:** A table displaying all groups with key information (name, owner, number of members, total deposited, etc.) and links to individual group profiles.

*   **Section 4: Withdrawal Requests**
    *   **Pending Withdrawal Requests:** A list of all pending withdrawal requests, including the user/group, amount, request date, and account type.
    *   **Locked Account Withdrawal Authorization:** A section specifically for authorizing withdrawals from locked individual accounts, with details of the request and options for Leone or Nick to approve or reject.
    *   **Group Account Withdrawal Authorization:** A similar section for authorizing withdrawals from group accounts, requiring confirmation from all group members before Leone or Nick can approve.
    *   **Withdrawal History:** A table showing the history of all processed withdrawals (approved and rejected).

*   **Section 5: Notifications**
    *   **Notification Center:** A component to create and send notifications to individual users or groups.
    *   **Notification History:** A log of all sent notifications.

**II. Staff Dashboard**

The Staff dashboard will be similar to the Admin dashboard but with restricted access to certain functionalities.

*   **Section 1: Financial Overview**
    *   Same as Admin, but may have read-only access to some metrics.

*   **Section 2: User Activity and Management**
    *   Same as Admin, but without the ability to modify user roles or sensitive data.
    *   Can likely view the User Verification Queue but might not have authorization to approve/reject.

*   **Section 3: Group Activity and Management**
    *   Same as Admin, but with similar restrictions as for User Activity.

*   **Section 4: Withdrawal Requests**
    *   Can view Pending Withdrawal Requests but cannot approve or reject them.
    *   Cannot access the Locked Account or Group Account Withdrawal Authorization sections.
    *   Can view Withdrawal History.

*   **Section 5: Notifications**
    *   Can likely view the Notification History but might not have permission to create new notifications.

**III. User Dashboard (Individual - Normal Account)**

*   **Section 1: Account Summary**
    *   **Total Principal Deposited:** The total amount deposited by the user.
    *   **Interest Earned (This Month):** Interest earned for the current month.
    *   **Interest Paid (Cumulative):** Total interest paid to the user to date.
    *   **Available Balance:** Calculated as (Total Principal Deposited + Interest Earned This Month) - (Any pending withdrawals for this month).
    *   **Interest Payment Confirmation:** A prominent button/message on the 1st of the month for the user to confirm they want to receive their interest payment.

*   **Section 2: Deposit Management**
    *   **Deposit History:** A table showing the user's deposit history with dates, amounts, and verification status.
    *   **New Deposit:** A button/form to initiate a new deposit (only visible between the 1st and 10th of the month).
    *   **Deposit Guidelines:** Clear information about deposit restrictions (dates, amounts, waiting periods).

*   **Section 3: Withdrawal Management**
    *   **Withdrawal History:** A table showing the user's withdrawal history with dates, amounts, and status.
    *   **New Withdrawal Request:** A button/form to initiate a new withdrawal request (only visible between the 25th and the end of the month).
    *   **Withdrawal Guidelines:** Clear information about withdrawal restrictions (dates, forfeiture of interest for early withdrawals).

*   **Section 4: Referral**
    *   **Referral Code:** Display the user's unique referral code.
    *   **Referral Bonus Earned:** The total referral bonus amount earned by the user.
    *   **Referral Link/Sharing Options:** Options to easily share the referral code.

*   **Section 5: Notifications**
    *   **Notification Center:** A list of notifications relevant to the user (e.g., deposit confirmations, withdrawal updates, referral bonuses, interest payments).

**IV. User Dashboard (Individual - Locked Account)**

*   **Section 1: Account Summary**
    *   **Total Principal Deposited:** The total amount deposited by the user.
    *   **Total Interest Earned (Cumulative):** The total interest earned by the user to date (since interest is not paid out monthly).
    *   **Available Balance:** Calculated as (Total Principal Deposited + Total Interest Earned (Cumulative)) - (Any pending withdrawals).

*   **Section 2: Deposit Management**
    *   Same as Normal Account.

*   **Section 3: Withdrawal Management**
    *   **Withdrawal History:** A table showing the user's withdrawal history with dates, amounts, and status.
    *   **New Withdrawal Request:** A button/form to initiate a new withdrawal request. This will trigger a notification to Leone or Nick for authorization.
    *   **Withdrawal Guidelines:** Clear information about the authorization process for withdrawals.

*   **Section 4: Referral**
    *   Same as Normal Account.

*   **Section 5: Notifications**
    *   Same as Normal Account.

**V. User Dashboard (Group Account - Admin/Owner)**

*   **Section 1: Account Summary**
    *   **Total Principal Deposited:** The total amount deposited by the group.
    *   **Total Interest Earned (Cumulative):** The total interest earned by the group to date.
    *   **Available Balance:** Calculated as (Total Principal Deposited + Total Interest Earned (Cumulative)) - (Any pending withdrawals).

*   **Section 2: Deposit Management**
    *   **Deposit History:** A table showing the group's deposit history with dates, amounts, and verification status.
    *   **New Deposit:** A button/form to initiate a new deposit for the group (only visible between the 1st and 10th of the month).
    *   **Deposit Guidelines:** Clear information about deposit restrictions.

*   **Section 3: Withdrawal Management**
    *   **Withdrawal History:** A table showing the group's withdrawal history with dates, amounts, and status.
    *   **New Withdrawal Request:** A button/form to initiate a new withdrawal request. This will trigger notifications to all group members for consent and then to Leone or Nick for authorization.
    *   **Withdrawal Guidelines:** Clear information about the authorization process for withdrawals.

*   **Section 4: Member Management**
    *   **Member List:** A table showing all group members, their roles (e.g., chairperson, treasurer), and contact information.
    *   **Add Member:** A form to add new members to the group (requires verification).
    *   **Manage Roles:** Functionality to assign or change roles of group members.

*   **Section 5: Referral**
    *   **Referral Code:** Display the group's unique referral code.
    *   **Referral Bonus Earned:** The total referral bonus amount earned by the group.
    *   **Referral Link/Sharing Options:** Options to easily share the referral code.

*   **Section 6: Notifications**
    *   **Notification Center:** A list of notifications relevant to the group (e.g., deposit confirmations, withdrawal requests, member additions, authorization requests).

**VI. User Dashboard (Group Account - Member)**

*   **Section 1: Account Summary**
    *   **Total Principal Deposited:** The total amount deposited by the group (read-only).
    *   **Total Interest Earned (Cumulative):** The total interest earned by the group to date (read-only).

*   **Section 2: Deposit History**
    *   **Deposit History:** A table showing the group's deposit history with dates and amounts (read-only).

*   **Section 3: Notifications**
    *   **Notification Center:** A list of notifications relevant to the group member, especially those requiring consent for withdrawals.

This detailed breakdown should give you a good starting point for designing the dashboard.

Next, we can start working on the frontend code for these sections using Next.js and MUI. We can create reusable components for common elements like tables, forms, and charts to make the development process more efficient.

Just let me know when you are ready to proceed by using `Next <task>`.
