##### contains daraja implementation

## c2b (CUSTOMER TO BUSINESS)
Used when customer sends money to your pay bill number.
- register URL for validation and confirmation at -> "/mpesa/c2b/v1/registerurl"
- simulate a transaction for testing -> "/mpesa/c2b/v1/simulate"

## b2c (BUSINESS TO CUSTOMER)
Send money back to customer
- endpoint -> "/mpesa/b2c/v1/payment"

## OAuth Token
Generate access token to authenticate requests
- endpoint -> "/oauth/v1/generate?grant_type=client_credentials"

### 2: implementation steps
Step1 : You will need an access token:
To get access token you need your `consumer_key` and `consumer_secret` from your daraja dashboard.

```python
def get_access_token(consumer_key, consumer_secret):
   url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
```
