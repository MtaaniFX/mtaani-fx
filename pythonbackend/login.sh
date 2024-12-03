#!/usr/bin/env bash
curl -X POST http://localhost:8000/login/ \
-H "Content-Type: application/json" \
-d '{"email": "rjmuiruri@gmail.com", "password":"password123"}'
echo ""