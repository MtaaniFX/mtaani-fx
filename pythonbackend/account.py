from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, constr, validator
from datetime import datetime, timedelta
from typing import Optional, List, Union
import pyotp
from decimal import Decimal

