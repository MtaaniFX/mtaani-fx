## This readme contains documentation on how I implemented the backend

### Using supabase to manage the database

First of all these are how the tables look like.

1. `clients` table

Our  first table is called `clients`, supabase suggests that you use `snake_case` when naming tables and columns.
This is how `clients` table looks like.
```sql
id -> (UUID,PRIMARY KEY)
full_name -> (TEXT)
phone_number -> (TEXT,UNIQUE)
email -> (TEXT,UNIQUE)
id_number -> (TEXT,UNIQUE)
account_type -> (ENUM: `normal`,`locked`,`group`)
referral_code -> (TEXT,UNIQUE) // not needed now
created_at -> (TIMESTAMP, DEFAULT: `now()`)
```
2. `groups` table
```sql
id -> (UUID,PRIMARY KEY)
group_id -> (UUID, References `clients.id`)
full_name -> (TEXT) // name of the group
phone_number -> (TEXT)
id_number -> (TEXT)
role -> (ENUM: `chair_person`,`vice_chair`,`treasurer`,`secretary`,`member`) // not needed now
```
3. `deposits`
```sql
id -> (UUID,PRIMARY KEY) // each deposit made has a unique id
client_id -> (UUID, REFERENCES `clients.id`) // person who made the deposit
amount -> (TEXT) // amount deposited by `client.id`
deposit_date -> (TIMESTAMP, DEFAULT `now()`)
status -> (ENUM: `pending`,`verified`,`rejected`)
```
4. `transactions`

```sql
id -> (UUID, PRIMARY KEY)
client_id -> (UUID, REFERENCES `clients.id`)
type -> (ENUM: `deposit`,`withdrwal`,`interest`,`bonus`)
amount (text)
transaction_date (TIMESTAMP, DEFAULT `now()`)
```