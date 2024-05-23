from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import MyForm


from accounts.models import Account
from referals.models import Referral
from users.models import Customers
from utils.helpers import Helpers
from utils.sessions import Sessions


def show_register_form(request):
    helpers = Helpers()
    return render(request, 'register.html')


def show_login_form(request):
    helpers = Helpers()
    return render(request, 'login.html')

def checker(request):
    # helpers = Helpers()
    print("Checking......")
    print(request.session.get('type'))
    if request.session.get('type') == 1:
        return redirect('administrator')
    return redirect('home')




def handleRegister(request):
    helper = Helpers()
    if request.method == 'POST':
        referral_code = helper.genarete_ref_no()
        username = request.POST['username']
        phone_number = request.POST['phone_number']
        password = make_password(request.POST['password1'])
        refererID = request.POST['referral_code']
        form = MyForm(request.POST)



        captcha_html = str(form['captcha'])

        
        if request.POST['password1'] != request.POST['password2']:
            messages.error(request, f'Passwords do not Match!!.')
            return redirect('register')

        # Check if username or phone number already exists
        # if Customers.objects.filter(name=username).exists():
        #     messages.error(request, f'Username {username} is already in use.')
        #     return redirect('register')
        

        if Customers.objects.filter(phone_number=phone_number).exists():
            messages.error(request, f'Phone number {phone_number} is already in use.')
            return redirect('register')

        # Create new Client
        customer = Customers.objects.create(
            name=username,
            phone_number=phone_number,
            password=password,
            referal_code=referral_code
        )

        referer = Customers.objects.filter(referal_code=refererID).first()
        referered = Customers.objects.filter(referal_code=referral_code).first()

        # set Up Account
        account = Account.objects.create(
            user_id=referered,
            balance=5.00
        )

        # Check if Referer is present
        if refererID != "":
            if referer and referered:
                referals = Referral.objects.create(
                    refererID=referer,
                    refereredID=referered
                )
            else:
                pass

            
            if form.is_valid():
                user = form.save()
                messages.success(request, "Success!")
                return redirect('login')
                
            else:
                messages.error(request, "Wrong Captcha!")
                return render(request, 'register.html', {'form': form})
        messages.success(request, f'Account created for {username}!')
        return redirect('register')
    else:
        return redirect('register')


def handleLogin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        try:
            user = Customers.objects.get(phone_number=username)
        except Customers.DoesNotExist:
            user = None

        if user is not None and check_password(password, user.password):
            session = Sessions()
            session.setSession(request, user)
            messages.success(request, 'You have been logged in successfully.')

            # if user.type == 1:
            #
            #     # return redirect('administrator')
            #     return HttpResponseRedirect(reverse('administrator'))
            # # return HttpResponseRedirect(reverse('home'))
            return redirect('checker')
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('login')  # Redirect back to the login page with error message
    else:
        return redirect(request, 'login')


def handleLogout(request):
    request.session.flush()
    return redirect('login')
