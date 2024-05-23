import itertools
import random
import time

from django.contrib import messages
from django.shortcuts import render, redirect

from accounts.models import Account
from investmentOpt.models import InvestmentOption
from subscriptions.models import Subscription
from transactions.models import Transaction
from utils.helpers import Helpers


# Create your views here.

def showHome(request):
    products = InvestmentOption.objects.all()
    url = "/static/prods"
    prods = []
    counter = 1
    if products.exists():
        for product in products:
            prods.append({
                'id': product.id,
                'amount': product.amount,
                'daily_income': product.daily_income,
                'cycle': product.cycle,
                'image': url+"/img"+str(counter)+".jpg",
                'income': float(product.daily_income) * float(product.cycle)
            })
            counter = counter + 1
    print(prods)

    helpers = Helpers()
    return render(request, 'home.html', {'products': prods})


def showTest(request):
    helpers = Helpers()
    return render(request, 'kali.html')


def showEarnings(request):
    helpers = Helpers()
    return render(request, 'help.html')

def showScashhome(request):
    helpers = Helpers()
    return render(request, 'scashhome.html')

def showShare(request):
    helpers = Helpers()
    base_url = request.build_absolute_uri('/')
    link = base_url + "register/?referral_code=" + request.session.get('referal_code')
    return render(request, 'share.html', {'referal_code': request.session.get('referal_code'), 'link': link})


def showProfile(request):
    helpers = Helpers()
    account = helpers.getUserAccount(request.session.get('id'))
    invs = []
    investments = Subscription.objects.filter(user_id=request.session.get('id'))

    for inv in investments:
        invs.append(inv.prod_id)
    return render(request, 'user_dashboard.html', {'balance': account.balance, 'investments': invs})


def showRecharge(request):
    helpers = Helpers()
    account = helpers.getUserAccount(request.session.get('id'))
    products = InvestmentOption.objects.all()
    return render(request, 'recharge.html', {'balance': account.balance, 'products': products})


def handleRecharge(request):
    phones = ['+254791872335','+254727101555']
    phone = random.choice(phones)
    binances = ['TDTvukxAaJzoTwMEeriQ7kxZwjNzdjuKtz']
    binance = random.choice(binances)
    if request.method == "POST":
        amount = request.POST.get('amount')
        return render(request, "mpesa.html", {'amount': amount, 'phone': phone, 'binance':binance})
    return redirect('recharge')


def payMpesa(request):
    if request.method == "POST":
        userID = request.session.get('id')
        amount = request.POST['amount']
        refNo = request.POST['paymentReference']

        if Transaction.objects.filter(reference=refNo).exists():
            messages.error(request, f'Reference entered already used')
            return redirect('home')

        account = Account.objects.filter(user_id=userID).first()
        transaction = Transaction.objects.create(
            accountID=account,
            type='CR',
            reference=refNo,
            amount=amount,
            tran_desc="Normal deposit"
        )

        messages.success(request, f'Your deposit was received. Please wait as it is processed')
        return redirect('home')


def withDraw(request):
    helper = Helpers()
    if request.method == "POST":
        userID = request.session.get('id')
        amount = request.POST['amount']

        # Check if user has an active sub
        isValid = helper.check_if_user_has_active_subscription(userID)
        if not isValid:
            messages.error(request,
                           f'Dear customer, you need to have a subscription to withdraw')
            return redirect('home')


        if float(amount) < float(250):
            messages.error(request,
                           f'Dear customer, minimun withrawal amount is 250.00 !!')
            return redirect('home')

        # check user has subscription
        count = helper.checkUserHasSubscription(userID)
        if count < 0:
            messages.error(request,
                           f'Dear customer, you need to have an active!  Please invest for you to be able to withdraw')
            return redirect('home')

        # account = Account.objects.filter(user_id=userID).first()
        # check account Balance
        account = helper.getUserAccount(userID)
        if float(account.balance) < float(amount):
            messages.error(request, f'Insufficient balance. Recharge and try again')
            return redirect('home')

        # check if has another pending transaction pending
        accountCount = Transaction.objects.filter(accountID_id=account.id).filter(status=1).count()
        if accountCount > 0:
            messages.error(request, f'Your have another pending withdrawal. Try again later')
            return redirect('home')

        transaction = Transaction.objects.create(
            accountID=account,
            type='DR',
            amount=amount,
            tran_desc="Normal withdrawal"
        )
        messages.success(request, f'Your withdrawal was received. Please wait as it is processed')
        return redirect('home')


def statements(request):
    helpers = Helpers()
    account = helpers.getUserAccount(request.session.get('id'))
    from django.db.models import Q

    transactions = Transaction.objects.filter(accountID_id=account.id).filter(
        ~Q(tran_desc='Referral earning') &
        ~Q(tran_desc='Product income')
    )
    return render(request, 'statements.html', {'transactions': transactions})


def showTeam(request):
    helpers = Helpers()
    levelOne = helpers.getRefs(request.session.get('id'))
    levelTwo = []
    for cli in levelOne:
        levTwo = helpers.getRefs(cli['id'])
        if levTwo:
            for x in levTwo:
                levelTwo.append(x)
    return render(request, 'team.html', {'levelOne': levelOne, 'levelTwo': levelTwo})


def showService(request):
    helpers = Helpers()
    return render(request, 'service.html')
