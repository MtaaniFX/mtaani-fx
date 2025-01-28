#usr/bin/env bash
# use OPENSSH to generate security credential

# Use OpenSSL to generate security credential
openssl x509 -inform der -in ProductionCertificate.cer -pubkey > pubkey.pem
openssl rsautl -encrypt -inkey pubkey.pem -pubin -in InitiatorPassword.txt -out SecurityCredential.bin
base64 < SecurityCredential.bin > SecurityCredential.txt
#Required Parameters:

#Valid B2C shortcode (6 digits)

#Registered initiator name

#Properly encrypted security credential

#Valid SSL certificates for callback URLs

#Transaction Limits:

#Minimum amount: 10 KES

#Maximum amount: 70,000 KES (for registered customers)

#Maximum 25 transactions per minute

#Error Handling:

#Implement retry logic for timeout errors

#Maintain transaction state database

#Implement proper logging for audit trails

#Production Considerations:

#Use proper SSL certificates (not adhoc)

#Implement IP whitelisting

#Add request validation middleware

#Implement rate limiting

#Set up monitoring and alerts

#Common Response Codes:

#0: Success

#1: Insufficient balance

#2001: Invalid initiator credentials

#2008: Invalid receiver party

#2010: Duplicate transaction