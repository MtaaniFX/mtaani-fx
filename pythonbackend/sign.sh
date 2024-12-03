#!/usr/bin/env bash
curl -X POST http://localhost:8000/signup/ \
-H "Content-Type: application/json" \
-d '{"email": "ada@gmail.com", "password":"password123", "first_name":"Ada", "last_name":"LoveLace", "id_number":"722334455", "phone_number": "0712345679", "is_verified": true}'
echo ""
# echo "*********************"