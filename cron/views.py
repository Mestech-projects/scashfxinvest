from datetime import datetime

from django.http import HttpResponse


from accounts.models import Account
from company_float.models import CompanyFloat
from subscriptions.models import Subscription
from transactions.models import Transaction


def handle(self, *args, **options):
    current_time = datetime.now().time()

    # get all active subscriptions
    subscriptions = Subscription.objects.filter(status=1)

    for subscription in subscriptions:
        date_subscribed = subscription.date_subscribed.time()
        if current_time.hour == date_subscribed.hour and current_time.minute == date_subscribed.minute and current_time.second == date_subscribed.second:
            # get related objects
            user = subscription.user_id                                 
            product = subscription.prod_id
            account = account.objects.get(user_id=user)

            # calculate daily income
            daily_income = product.daily_income

            # update user account balance
            account.balance += daily_income
            account.save()

            # log transaction
            Transaction.objects.create(
                accountid=account,
                type='cr',
                tran_desc='product income',
                amount=daily_income,
                transaction_date=datetime.now(),
                status=1
            )

            # reduce company float
            company_float = CompanyFloat.objects.first()
            company_float.balance -= daily_income
            company_float.save()

            # logging
            log_message = f"{datetime.now()} executed on hour {current_time.hour} minute {current_time.minute} ------------> userid {user.id}\n"
            with open('cronresponse.txt', 'a') as file:
                 file.write(log_message)

            # self.stdout.write(
            #     self.style.success(f'cron job executed for subscription id {subscription.id} at {current_time}.'))
    return HttpResponse("hello")

