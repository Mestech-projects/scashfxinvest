# from . import Database
#
#
# class Helpers(Database.db):
#     def users(self):
#         query = """
#             SELECT COUNT(*) FROM  customers
#         """
#         result = self.execute_query(query)
#         users = result[0][0] if result else 0
#         return users
import random
import string

from accounts.models import Account
from company_float.models import CompanyFloat
from investmentOpt.models import InvestmentOption
from referals.models import Referral
from subscriptions.models import Subscription
from transactions.models import Transaction
from users.models import Customers
from django.db import models

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse


class Helpers:

    def genarete_ref_no(self):
        characters = string.digits + string.ascii_lowercase
        ref_no = ''.join(random.choice(characters) for _ in range(7))
        return ref_no

    def getUserAccount(self, user_id):
        account = Account.objects.get(user_id=user_id)
        return account

    def checkUserHasSubscription(self, user_id):
        subsCount = Subscription.objects.filter(user_id=user_id).filter(status=1).count()
        return subsCount

    def getTrasnsaction(self, i):
        transaction = Transaction.objects.get(id=1)
        print(transaction)
        return transaction

    def decreaseAccount(self, user_id, amount):
        account = Account.objects.get(user_id=user_id)
        current_balance = account.balance
        new_balance = current_balance - amount
        account.balance = new_balance
        account.save()

    def increaseFloat(self, amount):
        try:
            company_float = CompanyFloat.objects.get(pk=1)
            company_float.balance += amount
            company_float.save()
        except CompanyFloat.DoesNotExist:
            CompanyFloat.objects.create(balance=amount)

    def decreaseFloat(self, amount):
        try:
            company_float = CompanyFloat.objects.get(pk=1)
            company_float.balance -= amount
            company_float.save()
        except CompanyFloat.DoesNotExist:
            CompanyFloat.objects.create(balance=amount)

    def IncreaseAccount(self, user_id, amount):
        account = Account.objects.get(user_id=user_id)
        current_balance = account.balance
        new_balance = current_balance + amount
        account.balance = new_balance
        account.save()

    def getProduct(self, proId):
        product = InvestmentOption.objects.get(id=proId)
        return product

    def check_user_has_subscribers(self, user_id):
        num_referrals_with_deposits = Referral.objects.filter(refererID=user_id,
                                                              referered__account__transaction__tran_desc='Normal Deposit',
                                                              referered__account__transaction__status=0).count()

        return num_referrals_with_deposits

    def check_if_user_has_active_subscription(self, user):
        count = Subscription.objects.filter(user_id=user).filter(status=1).count()
        if count > 0:
            return True
        return False

    def getReferer(self, id):
        ref = Referral.object.get(refereredID=id)
        print(ref)
        return ref

    def get_level_tree(self, id):
        data = {}
        first = Referral.objects.filter(refererID=id).values('referered__id')
        if first.exists():
            data['first'] = first

        if 'first' in data:
            second = Referral.objects.filter(refererID=data['first'][0]['referered_id']).values('referered_id')
            if second.exists():
                data['second'] = second

        if 'second' in data:
            third = Referral.objects.filter(refererID=data['second'][0]['referered_id']).values('referered_id')
            if third.exists():
                data['third'] = third

        return data

    def getRefs(self, userId):
        data = []
        referrals = Referral.objects.filter(refererID=userId).all()
        for referral in referrals:
            data.append({
                'name': referral.refereredID.name,
                'date': referral.refereredID.date_created,
                'id': referral.refereredID.id
            })
        return data



    def get_user_referrals(self, id, p):
        response = []
        user_data = Customers.objects.get(id=id)
        user_referals = Referral.objects.filter(refererID=user_data.id)

        for refer in user_referals:
            refered_data = refer.refered
            final = {}
            final['name'] = refered_data.name
            final['id'] = refered_data.id
            final['date_created'] = refered_data.date_created

            referal_account = refered_data.account
            total = \
                Transaction.objects.filter(account_ID=referal_account.id, tran_desc='Normal Deposit',
                                           status=0).aggregate(
                    total_amount=models.Sum('amount'))['total_amount']
            final['amount'] = total if total else 0

            bonus = 0
            first_transaction = Transaction.objects.filter(account_ID=referal_account.id, tran_desc='Normal Deposit',
                                                           status=0).first()
            if first_transaction:
                bonus = p * first_transaction.amount
            final['bonus'] = bonus

            response.append(final)

        return response

    def fetch_subscription(self, id):
        subscription = Subscription.objects.filter(user_id=id, status=1).first()
        return subscription

    def update_float(self, amount):
        company_float, created = CompanyFloat.objects.get_or_create()
        company_float.balance += amount
        company_float.save()

    def decrease_float(self, amount):
        num_rows = CompanyFloat.objects.count()
        if num_rows > 0:
            company_float = CompanyFloat.objects.first()
            company_float.balance -= amount
            company_float.save()
        else:
            CompanyFloat.objects.create(balance=amount)

    def update_user_account(self, amount, user_id):
        account = Account.objects.get(user_id=user_id)
        account.balance -= amount
        account.save()

    def increase_user_account(self, amount, user_id):
        account = Account.objects.get(user_id=user_id)
        account.balance += amount
        account.save()

    def update_product_income(self, amount, user_id):
        account = Account.objects.get(user_id=user_id)
        account.other_amnt += amount
        account.save()

    def admin_required(view_func):
        def wrapper(request, *args, **kwargs):
            if request.session.get('type') < 0:
                request.session.flush()
                return HttpResponseRedirect(reverse('login'))
            return view_func(request, *args, **kwargs)
        return wrapper
