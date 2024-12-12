from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('register/', views.register_view, name='api-register'),

    path('session/', views.session_view, name='api-session'),
    path('whoami/', views.whoami_view, name='api-whoami'),
    path('get_statistics/', views.statistic_by_year, name='statist-by-year'),
    path('stat_by_date', views.stat_by_date, name='stat-by-date'),
    path('homeinfo/', views.home_info, name='home-info'),

    path('pub_transaction/',views.publish_transaction, name='publish-transaction'),
    path('sync_data/',views.sync_db_with_pos, name='sync-data'),

]
