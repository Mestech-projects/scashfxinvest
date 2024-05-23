import time
from datetime import datetime
import mysql.connector


class AutomaticCron:
    def __init__(self, db_connection):
        self.conn = db_connection

    def test(self):
        with open('response.txt', 'w') as file:
            file.write('Hello, world!')

    def auto(self):
        current_time = datetime.now()
        current_hour = current_time.hour
        current_minute = current_time.minute
        current_secs = current_time.second

        query = """
                    SELECT * FROM subscriptions WHERE status = 1
                """
        with self.conn.cursor() as cursor:
            cursor.execute(query)
            subscriptions = cursor.fetchall()
            for subscription in subscriptions:
                date_subscribed = subscription[1]
                userID = subscription[-1]
                prodID = subscription[-2]

                hr = date_subscribed.hour
                minute = date_subscribed.minute
                sec = date_subscribed.second

                if current_hour == hr and current_minute == minute and current_secs == sec:
                    print("Time reached................................................")
                    # get Product
                    cursor.execute("SELECT * FROM products WHERE id = %s", (prodID,))
                    product = cursor.fetchone()
                    # print(product)
                    # get User account
                    cursor.execute("SELECT * FROM accounts WHERE user_id_id = %s", (userID,))
                    account = cursor.fetchone()
                    # Calculate daily income and update user account
                    daily_income = product[1]
                    new_balance = account[2] + daily_income
                    cursor.execute("UPDATE accounts SET balance = %s WHERE user_id_id = %s", (new_balance, userID))
                    self.conn.commit()

                    # Log transaction
                    tran_desc = "Product Income"
                    cursor.execute(
                        "INSERT INTO transactions (accountID_id, type, tran_desc, amount) VALUES (%s, %s, %s, %s)",
                        (account[0], 'CR', tran_desc, daily_income))
                    self.conn.commit()

                    # Reduce company float
                    cursor.execute("SELECT balance FROM company_float")
                    company_balance = cursor.fetchone()
                    updated_company_balance = company_balance[0] - daily_income
                    cursor.execute("UPDATE company_float SET balance = %s", (updated_company_balance,))
                    self.conn.commit()

                    # Logging
                    log_message = f"{datetime.now()} executed on Hour {current_hour} Minute {current_minute} ------------> userID {userID}\n"
                    with open('cronresponse.txt', 'a') as file:
                        file.write(log_message)

