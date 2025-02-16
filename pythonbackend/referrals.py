# deals with referrals
import string
import random

# generate a referral code that has 6 digits composed of uppercase and digits
# this function can be expanded to include lowercase characters
def generate_referral_code() -> str:
    return ''.join(random.choices(string.ascii_uppercase+string.digits, k=6))

if __name__ == '__main__':
    print(generate_referral_code())