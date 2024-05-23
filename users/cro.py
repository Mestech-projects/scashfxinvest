from datetime import datetime

from django.http import HttpResponse

from accounts.models import Account
from company_float.models import CompanyFloat
from subscriptions.models import Subscription
from transactions.models import Transaction

class YourClassName:  # Assuming your class has a name, replace 'YourClassName' with the actual class name
    def handle(self, *args, **options):
        current_time = datetime.now().time()

        log_message = f"Heloooooooooooooooooooooooo\n"
        with open('cronresponse.txt', 'a') as file:
            file.write(log_message)

        return HttpResponse("Hello cron")

                             