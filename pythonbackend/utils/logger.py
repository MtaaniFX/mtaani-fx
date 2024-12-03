from datetime import datetime

"""
takes a resp and logs/writes it to log_file
"""
def log_transaction_to_file(resp, log_file: str):
    if log_file.strip() == "" :
        print("please provide a valid name for the log file")
        return
    when = datetime.now().strftime(" %A, %B %d, %Y, %H:%M:%S ")
    stars = "*" * 10
    with open(log_file, 'a') as f:
        f.write(stars + when + stars + '\n' + resp + '\n') # write resp and move to new line
        f.close()

# def main():
#     log_transaction_to_file("hello world","test.txt")
# main()