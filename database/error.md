System prompt:

Your output per prompt is restricted to less than 8000 characters. Some tasks will generally
require more; in which case, break down the task into various steps, label and state the steps, then prompt
the user for the task they need. Whenever possible, start off with the first step; or
pool subsequent steps together, from the selected step. The steps should be labelled in the format:
`<Task Name>:<Task Step>`, where, `<Task Name>` is a letter representing the task, and `<Task Step>` is the task number
in the sequence `[1..]`. With that format, the user can now just type `Next <Task Name>:<Task Step>`,
and you'll go through the specified task step; or just `Next` and you'll attempt to perform the whole task or
stop where limits are deemed to exceed the 8000 characters.

Do not include common tasks as installation of the common libraries, how to run commands, and such, unless specified.
Your focus is only on the code, not explanations, unless specified.

Whenever a database table needs to be created, write the necessary SQL statements. Write all SQL statements in one
file, optionally, with a short explanation of what the statement does.

------------------------------------------------------------------------------------


We will be building a `Next.js` app, using `Supabase` as the database, auth, and storage backend. For the UI, we'll
be using Material UI React (MUI).

Also keep in mind the default database tables managed from Supabase; this should help you come up with
other tables that extend the default tables via database relationships.

We'll mostly be dealing with database operations, and
database information display on the client, based on the user roles.

This is the specifications of the app:

```markdown

The app is an investment platform, and will mostly have two main user types: 
`clients`, and `admins`, with option for more user types as `staff`.

## Administrators section

Administrators will include users with full rights, for the start, 
we'll grant `John@mail.com` and `Doe@mail.com` the full Administrative rights.

There should also be an option for more staff users with limited rights.

Administrators should see reports of how much each account has deposited
(principal), how much interest has been earned so far, how much interest has been paid
so far and the pending interest yet to be paid.
The above report should also be available in cumulative for all the accounts.

The Administrators should also be able to see which accounts have requested to withdraw their principal,
have authorization over the withdrawal of some accounts (this will be explained in more
detail in the client section below)

Also, The Administrators should:
- Be able to send notification to the account holders
- Be able to view the client account profiles and information
- Be able to see how much interest or principal has been deposited/paid to the client and a corresponding 
  verification from the client that he/she has received the interest / principal.
- Be able to see the overview of the company’s financial position with relation to the app.

## Client section

- Should have 2 main type of accounts i.e. `individual` accounts and `group` accounts.
- The `individual` accounts should also be subdivided into two account subtypes, `normal` accounts and `locked`
  accounts, with support to add more account subtypes.
- Normal account users will deposit their principal and receive interest payment at the
  end of each month. They should, however, before the 1st of the month confirm that they want
  their interest payment.
- `Locked` account users will not receive interest payments monthly; they will receive their
  cumulated interest payment upon request. Upon request for withdrawal, they should be
  authorized by either John or Doe after contact and verification with the account
  owner from within the app.

Client registration segment for individual account should require full names, phone no, I.D no, and email.

After registration, the clients should verify their accounts. The verification will be a photo ID of the user to see
if it matches with the names provided and registered to the number.

Terms and conditions should also be available and accepted by the user before they
submit their application for verification. This will serve as a binding contract between the company and
the client.

Client account should be able to deposit money, (this will be handled by an external API, 
that needs the application to provide a callback URL with the details of the payments).

Clients should also be able to request for withdrawal of the principal.

For all accounts, they should only be able to deposit money between the 1st and 10th of
any given month to earn interest in that month. All deposits made after the 10th will start
earning interest the following month. This will be made clear in the agreement before the user chooses to do so.

Clients will be unable to withdraw their first deposit after 2 months (60 days) and any
subsequent deposit after 1 month (This will be made clear in the agreement before the user chooses to do so).

Principal withdrawal should be made available between the 25th and 30th or 31st of each
month (24th and 28th/29th for February). The withdrawal will be processed on the 1st of the next month from the request,
unless the 1st is a Weekend or Holiday in which case the deposit will be made on the
next available working day (This will be made clear in the agreement with the user).

Principals requested to be withdrawn outside the specified dates will forfeit any interest
earned within that month (This will be made clear in the agreement with the user).

The client should be able to view their Principal and the expected interest earned
that month for all accounts, and for locked accounts should also show the total interest
earned.

Account investments should be made in KES (Kenyan Shilling), with the minimum investment amount
being `10000`, with increments of `5000` up to a max of `100000`.

Group accounts are there to cater for unions. 
They should also have designated Administrative positions, i.e. chairperson, vice-chair, treasurer, secretary.

The group account Administrators will have full access to the account. 
They will require ID verification, and will be responsible for
deposits and withdrawals from the group account.

On the other hand, the group members should be able to view only the deposited principal and the cumulative
interest earned.

Group Interest and Principal will be locked and paid out upon request and authorization
granted by either John or Doe. Before the authorization is granted a notification should
be sent to all members, and they should also be contacted about the requested
withdrawal of funds and consent should be granted by all members.

## Additional Points

Each user should have a unique referral code.
Bonuses will be paid up for referrals (the bonus will be 5% of the first deposit of the referred user).
All new users will receive a 5% bonus of their first deposit.
Group members will receive a bonus dependent on the number of months before withdrawal of principal or interest, 
5% for the first 5 months, 10% for the first 9 months, and 15% for 12 months. This bonus will be calculated on the total amount available in
the account as at the months end, (that is to mean principal and interest).

The groups are only allowed one interest bonus per year.
Individual accounts will also receive a 10% bonus for every subsequent 4th investment made.

```

Based on the above specification:

We'll need a way to control data authorization. To effectively handle this, we will define some
roles for users. The roles should have a hierarchy; such that, an `admin`,
when querying a table that requires the `staff` role assigned, the `admin` role being superior to the `staff` role,
the `admin` should thus be able to access the data without explicitly being assigned the `staff` role.

For other tables, we may need to further enforce RLS with Postgresql, so that users can only modify their
own data in the table.

Group accounts should also have their own roles, independent of the global roles. The group owner,
has the group's `owner` and `admin` role assigned. Other group roles may be assigned to members
by the group owner, or admins.

A user can create many different investment accounts. They will all be displayed,
on their dashboard overview page.

Can you suggest a short, simple roadmap for building this application?
Let's begin by creating the necessary tables and policies.



------------------------------------------------------------------------------------------------


We will be building a `Next.js` app, using `Supabase` as the database, auth, and storage backend. For the UI, we'll
be using Material UI React (MUI).

Also keep in mind the default database tables managed from Supabase; this should help you come up with
other tables that extend the default tables via database relationships.

We will mostly be dealing with database operations, and
database information display on the client, based on the user roles.

We will be creating an application, where users can create and join investment groups with friends.
Initially, a user has some money in their account; which they can then choose to invest in different group(s) they so wish.
A group consists of an owner, and may have other admins, and members.
In each group, members will make contributions, that will be pooled together in the group's account
balance, thus, we also need to keep track of how much was contributed, and by how much per user.
Once the contributions are finalized, no more contributions should be accepted; they should be rejected, and
the contribution sent back to the contributor's account.
Then, after a month, the group will earn an interest of its balance at the rate of `x`%,
where this rate is retrieved from another table based on the group type.
This interest will be shared, among the group members based on the amount of their contribution.
The group, may, also earn a bonus, that will also be shared among members in the same criteria.

Suggest a roadmap for this.

------------------------------------------------------------------------------------------------------------

Write the SQL tables and RLS policies that will model this application.


---------------------------------------------------------------------------------------------------------

Henceforth, where possible, when for example I say I need an SQL query to create a group,
be sure to analyze the situation, and also provide and organize the SQL statements for CRUD operations
relating to the given task.

Let's start with a SQL query to list all groups a user is in, with pagination in mind.

------------------------------------------------------------------------------------------------

List all groups of type "individual", where a given user is a member, ordering the results by date they joined the group, with pagination.
List all groups of type "group", where a given user is a member, with pagination.

A user to create a group of type "individual".
A user to create a group of type "group".

A group owner to add a given user to a given group they own by the group id.
A group owner to remove a given user from a given group they own by the group id.

Check whether a given user is the owner of a given group

Read all details of a given group.
Join a group from its invite link, invite links may expire, once expired the user cannot join the group with the link.
Leave a group at will.

Given a group id, check if a given user is a member of the group.





