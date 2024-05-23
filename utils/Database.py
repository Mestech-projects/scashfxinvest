import mysql.connector
import logging
from invest import settings

class db:
    def __init__(self):
        self.conn = None
        try:
            self.conn = mysql.connector.connect(
                host=settings.DATABASES['default']['HOST'],
                user=settings.DATABASES['default']['USER'],
                password=settings.DATABASES['default']['PASSWORD'],
                database=settings.DATABASES['default']['NAME']
            )
            self.cursor = self.conn.cursor()
            logging.info("Database connection established successfully.")
        except mysql.connector.Error as e:
            logging.error(f"Error connecting to the database: {e}")

    def execute_query(self, query, params=None):
        if not self.conn:
            logging.error("Database connection is not established.")
            return None
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            return self.cursor.fetchall()
        except mysql.connector.Error as e:
            logging.error(f"Error executing query: {e}")
            return None

    def close(self):
        if self.conn:
            self.conn.close()
            logging.info("Database connection closed.")
        else:
            logging.warning("Trying to close an already closed connection.")
