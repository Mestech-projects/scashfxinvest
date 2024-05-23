from django.contrib import messages
from django.shortcuts import render, redirect
#from django.contrib.auth.decorators import login_required


from investmentOpt.models import InvestmentOption
from subscriptions.models import Subscription
from users.models import Customers
from utils.helpers import Helpers
import random


# Create your views here.
#@login_required
def investNow(request):
    helper = Helpers()
    if request.method == "POST":
        prodID = int(request.POST['prodID'])
        userID = int(request.POST['userID'])
        product = InvestmentOption.objects.get(id=prodID)
        customer = Customers.objects.get(id=userID)

        
        # image_filenames = ['binance.png', 'ethereum.jpg', 'zcash.png','dogecoin.png', 'litecoin.png','bitcoincash.png','bitcoin.png'] * len(product)
        # image_path = '/static/img/'
        # for option in product:
        #     image_filename = random.choice(image_filenames)
        #     full_image_path = image_path + image_filename
        #     option.image = full_image_path




        # check user account balance
        account = helper.getUserAccount(userID)
        if float(account.balance) < float(product.amount):
            messages.error(request, 'Insufficient account Balance')
            return redirect('home')

        # Decrease account
        helper.decreaseAccount(userID, product.amount)
        # Update Float
        helper.increaseFloat(product.amount)

        # Add Subscription
        subscription = Subscription.objects.create(
            user_id=customer,
            prod_id=product
        )
        messages.success(request, 'Investment was successfull')
        return redirect('home')
    

