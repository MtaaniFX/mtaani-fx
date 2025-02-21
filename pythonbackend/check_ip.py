"""
daraja encourages that you white list ip addresses
that are coming from safaricom in order to secure your backend
it has some ips that you are supposed to check before processing any 
requests further.
"""

from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

# these are the ip that safaricom uses
# store it in a set to ensure uniqueness
SAFARICOM_IP_ADDRESSES = {
    "196.201.214.200",
    "196.201.214.206",
    "196.201.213.114",
    "196.201.214.207",
    "196.201.214.208",
    "196. 201.213.44",
    "196.201.212.127",
    "196.201.212.138",
    "196.201.212.129",
    "196.201.212.136",
    "196.201.212.74",
    "196.201.212.69",
    # put the ip of your machine here, since the middleware will reject it if its not in this set, for testing purposes
}


async def check_ip_middleware(request: Request, next_handler):
    client_ip = request.client.host
    print(client_ip)#function to log this ip addresses to a file (but this feature is useless since we already know the ips to filter)

    if request.url.path == "/c2b/register":
        response = await next_handler(request)
        return response

    # check if the ip is allowed
    if client_ip not in SAFARICOM_IP_ADDRESSES:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # if ip is allowed, process the request by calling the next_handler
    response = await next_handler(request)

    return response