from decimal import Decimal

from django.contrib import messages
from django.shortcuts import render, redirect

from accounts.models import Account
from company_float.models import CompanyFloat
from referals.models import Referral
from transactions.models import Transaction
from users.models import Customers
from utils.helpers import Helpers
from django.core.exceptions import ObjectDoesNotExist


# Create your views here.

def showAdmin(request):
    balance = 0
    if CompanyFloat.objects.exists():
        data = CompanyFloat.objects.first()
        balance = data.balance
    deposits = Transaction.objects.filter(status=1).filter(type="CR").count()
    withdrawals = Transaction.objects.filter(status=1).filter(type="DR").count()
    clients = Customers.objects.filter(type=0).count()
    bind = Customers.objects.filter(type=0).count()
    return render(request, 'admin/dashs.html',
                  {'float_balance': balance, 'deposits': deposits, 'withdrawals': withdrawals, 'clients': clients,
                   'bind': bind})


def showDeposits(request):
    helper = Helpers()
    transactions = []
    trans = Transaction.objects.filter(status=1).filter(type="CR")
    if trans.count() > 0:
        counter = 1
        for tran in trans:
            account = Account.objects.get(id=tran.accountID_id)
            customer = Customers.objects.get(id=account.user_id_id)
            transactions.append({
                'counter': counter,
                'amount': tran.amount,
                'ref': tran.reference,
                'customer': customer.name,
                'id': tran.id
            })
            counter = counter + 1
    return render(request, 'admin/deposits.html', {'transactions': transactions})


def showWithdrawals(request):
    helper = Helpers()
    transactions = []
    trans = Transaction.objects.filter(status=1).filter(type="DR")
    if trans.count() > 0:
        counter = 1
        for tran in trans:
            account = Account.objects.get(id=tran.accountID_id)
            customer = Customers.objects.get(id=account.user_id_id)
            transactions.append({
                'counter': counter,
                'amount': tran.amount,
                'customer': customer.name,
                'phone': customer.phone_number,
                'id': tran.id
            })
            counter = counter + 1
    return render(request, 'admin/withdrawals.html', {'transactions': transactions})


def showClients(request):
    helper = Helpers()
    users = []
    clients = Customers.objects.filter(type=0)
    counter = 1
    for client in clients:
        refererName = "N/A"
        ref = Referral.objects.filter(refereredID=client)
        if ref.exists():
            for referral in ref:
                refererName = referral.refererID.name
        users.append({
            'counter': counter,
            'name': client.name,
            'referer': refererName,
            'phone': client.phone_number,
            'id': client.id
        })
        counter = counter + 1
    return render(request, 'admin/users.html', {'clients': users})


def showBinds(request):
    helper = Helpers()
    users = []
    clients = Customers.objects.filter(type=0)
    counter = 1
    for client in clients:
        refererName = "N/A"
        ref = Referral.objects.filter(refereredID=client)
        if ref.exists():
            for referral in ref:
                refererName = referral.refererID.name
        users.append({
            'counter': counter,
            'name': client.name,
            'referer': refererName,
            'phone': client.phone_number,
            'id': client.id
        })
        counter = counter + 1
    return render(request, 'admin/binds.html', {'clients': users})


def approveDeposit(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        try:
            transaction = Transaction.objects.get(id=id)
        except Transaction.DoesNotExist:
            messages.error(request, 'Transaction does not exist')
            return redirect('deposits')

        account = transaction.accountID
        amount = transaction.amount

        # Check if first deposit
        first_deposit_count = Transaction.objects.filter(tran_desc="Normal deposit",
                                                         accountID=account,
                                                         status=0).count()
        if first_deposit_count < 1:
            try:
                # Try to get the referral object
                referer = Referral.objects.get(refereredID=account.user_id)
            except ObjectDoesNotExist:
                # Referral does not exist
                referer = None

            if referer:
                # Get level 2
                try:
                    # Try to get the referral object
                    level2referer = Referral.objects.get(refereredID=referer.refererID)
                except ObjectDoesNotExist:
                    # Referral does not exist
                    level2referer = None
                if level2referer:
                    # Handle referral logic
                    deduction = Decimal('0.1') * amount
                    level2Acc = Account.objects.get(user_id=level2referer.refererID)
                    level2Acc.balance += deduction
                    level2Acc.referal_amnt += deduction
                    level2Acc.save()
                    Transaction.objects.create(accountID=level2Acc,
                                               type='CR',
                                               tran_desc='Referral earning',
                                               amount=deduction,
                                               status=0)

                # Handle referral logic
                deduction = Decimal('0.15') * amount
                referrer_account = Account.objects.get(user_id=referer.refererID)
                referrer_account.balance += deduction
                referrer_account.referal_amnt += deduction
                referrer_account.save()
                Transaction.objects.create(accountID=referrer_account,
                                           type='CR',
                                           tran_desc='Referral earning',
                                           amount=deduction,
                                           status=0)


        # Increase user's account balance
        user_account = Account.objects.get(user_id=account.user_id)
        user_account.balance += amount
        user_account.save()

        # Set status of transaction to approved
        transaction.status = 0
        transaction.save()

        messages.success(request, 'Approved Successfully')
        return redirect('deposits')

    messages.error(request, 'Invalid request method')
    return redirect('deposits')


def declineDeposit(request):
    if request.method == "POST":
        id = request.POST.get('id')
        transaction = Transaction.objects.get(id=id)
        transaction.status = 2
        transaction.save()
        messages.error(request, 'Transaction declined')
        return redirect('deposits')
    messages.error(request, 'Incorrect Method')
    return redirect('deposits')


def declineWithdrawal(request):
    if request.method == "POST":
        id = request.POST.get('id')
        transaction = Transaction.objects.get(id=id)
        transaction.status = 2
        transaction.save()
        messages.error(request, 'Transaction declined')
        return redirect('withdrawals')
    messages.error(request, 'Incorrect Method')
    return redirect('withdrawals')


def approveWithdrawal(request):
    helper = Helpers()
    if request.method == "POST":
        id = request.POST.get('id')
        transaction = Transaction.objects.get(id=id)

        # amount to float
        floAmount = float(0.06) * float(transaction.amount)
        amountToCustomer = float(transaction.amount) - float(floAmount)

        account = transaction.accountID

        # Credit float
        flo = CompanyFloat.objects.get(id=1)
        old = flo.balance
        new = float(old) + float(floAmount)
        flo.balance = new
        flo.save()

        # debit user account
        oldbal = account.balance
        newbal = float(oldbal) - float(transaction.amount)
        account.balance = newbal
        account.save()

        transaction.status = 0
        transaction.save()
        messages.success(request, 'Withdrawal was approved. Please disburse ' + str(amountToCustomer) + ' to customer')
        return redirect('withdrawals')
    messages.error(request, 'Incorrect Method')
    return redirect('withdrawals')
