"""
URL configuration for invest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


from admin.views import showAdmin, showDeposits, showWithdrawals, showClients, showBinds, approveDeposit, \
    declineDeposit, declineWithdrawal, approveWithdrawal
from cron.views import handle
from home.views import showHome, showTest, showEarnings, showShare, showProfile, showRecharge, handleRecharge, payMpesa, \
    withDraw, statements, showTeam, showService, showScashhome
from investmentOpt.views import investNow
from users.views import show_register_form, show_login_form, handleRegister, handleLogin, handleLogout, checker
from utils.helpers import Helpers



urlpatterns = [
    path('admin/', admin.site.urls),
    path('captcha/', include('captcha.urls')),
    

    path('cron/', handle, name='cron'),

    # Auth
    path('register/', show_register_form, name='register'),
    path('', checker, name='checker'),
    path('login/', show_login_form, name='login'),
    path('logout/', handleLogout, name='logout'),
    path('handleregister/', handleRegister, name='handleregister'),
    path('handlelogin/', handleLogin, name='handlelogin'),

    # Home
    path('home/', showHome, name='home'),
    path('test/', showTest, name='test'),
    path('help/', showEarnings, name='help'),
    path('share/', showShare, name='share'),
    path('service/', showService, name='service'),
    path('profile/', showProfile, name='profile'),
    path('team/', showTeam, name='team'),
    path('scashhome/', showScashhome, name='scashhome'),

    #Investment
    path('handleinvest/', investNow, name='handleinvest'),

    # Recharge
    path('recharge/', showRecharge, name='recharge'),
    path('handlerecharge/', handleRecharge, name='handlerecharge'),
    path('mpesapay/', payMpesa, name='mpesapay'),
    path('withdraw/', withDraw, name='withdraw'),
    path('statements/', statements, name='statements'),


    # Admin
    path('administrator/', Helpers.admin_required(showAdmin), name='administrator'),
    path('administrator/deposits/', Helpers.admin_required(showDeposits), name='deposits'),
    path('administrator/withdrawals/', Helpers.admin_required(showWithdrawals), name='withdrawals'),
    path('administrator/clients/', Helpers.admin_required(showClients), name='clients'),
    path('administrator/binds/', Helpers.admin_required(showBinds), name='binds'),
    path('approvedeposit/', Helpers.admin_required(approveDeposit), name='approvedeposit'),
    path('declinedeposit/', Helpers.admin_required(declineDeposit), name='declinedeposit'),
    path('approvewithdraw/', Helpers.admin_required(approveWithdrawal), name='approvewithdraw'),
    path('declinewithdraw/', Helpers.admin_required(declineWithdrawal), name='declinewithdraw'),

]
urlpatterns += staticfiles_urlpatterns()