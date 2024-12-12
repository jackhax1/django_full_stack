import json

from collections import defaultdict
from datetime import datetime

from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from django.db.models import Max, Sum
from django.db.models.functions import ExtractYear,ExtractMonth

from .models import User, Invoice, InvoiceItems, Product

from .pydantic_models import InvoiceSchema


def get_csrf(request):
    response = JsonResponse({"detail": "CSRF cookie set"})
    response["X-CSRFToken"] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse(
            {"detail": "Please provide username and password."}, status=400
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"detail": "Invalid credentials."}, status=400)

    login(request, user)
    return JsonResponse({"detail": "Successfully logged in."})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You're not logged in."}, status=400)

    logout(request)
    return JsonResponse({"detail": "Successfully logged out."})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False, "username": "None"})

    return JsonResponse({"isAuthenticated": True, "username": request.user.username})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})

    return JsonResponse({"username": request.user.username})


@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return JsonResponse({"error": "Missing fields"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        user = User.objects.create_user(
            username=username, email=email, password=password
        )
        user.save()

        return JsonResponse({"message": "User registered successfully"}, status=201)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@ensure_csrf_cookie
def home_info(request):
    if not request.user.is_authenticated:
        return JsonResponse({"data": {}})

    current_year = timezone.now().year
    current_month = timezone.now().month
    today = timezone.now().date()

    invoices = Invoice.objects.all()
    lifetime_invoices = invoices.count()
    number_of_products = Product.objects.all().count()

    total_sales_ytd = Invoice.objects.filter(entry_time__year=current_year).aggregate(
        total_sales=Sum("total_with_tax")
    )["total_sales"]

    total_sales_mtd = Invoice.objects.filter(
        entry_time__year=current_year, entry_time__month=current_month
    ).aggregate(total_sales=Sum("total_with_tax"))["total_sales"]

    total_sales_today = Invoice.objects.filter(entry_time__date=today).aggregate(
        total_sales=Sum("total_with_tax")
    )["total_sales"]

    # Handle the case where no transactions exist yet
    total_sales_ytd = total_sales_ytd or 0
    total_sales_mtd = total_sales_mtd or 0
    total_sales_today = total_sales_today or 0

    top_5_by_quantity = (
        InvoiceItems.objects.values("product_id", "name")
        .filter(entry_time__year=current_year)
        .annotate(total_quantity=Sum("quantity"))
        .order_by("-total_quantity")[:5]
    )

    top_5_by_sales = (
        InvoiceItems.objects.values("product_id", "name")
        .filter(entry_time__year=current_year)
        .annotate(total_revenue=Sum("total_with_tax"))
        .order_by("-total_revenue")[:5]
    )

    data = {
        "lifetime_invoices": lifetime_invoices,
        "number_of_products": number_of_products,
        "total_sales_ytd": float(total_sales_ytd),
        "total_sales_mtd": float(total_sales_mtd),
        "total_sales_today": float(total_sales_today),
        "top_5_qty": list(top_5_by_quantity),
        "top_5_revenue": list(top_5_by_sales),
        "username": request.user.username,
    }
    return JsonResponse(data)


@ensure_csrf_cookie
def statistic_by_year(request):
    if not request.user.is_authenticated:
        return JsonResponse({"data": []})
    

    revenue_by_year = list(
        Invoice.objects
        .annotate(year=ExtractYear('entry_time'), month=ExtractMonth('entry_time'))
        .values('year', 'month')
        .annotate(total_revenue=Sum('total_with_tax'))
        .order_by('year', 'month')
    )

    yearly_aggregates = defaultdict(float)
    for entry in revenue_by_year:
        year = entry["year"]
        total_revenue = float(entry["total_revenue"])
        yearly_aggregates[year] += total_revenue

    aggregated_by_year = [{"year": year, "total_revenue": revenue} for year, revenue in yearly_aggregates.items()]

    aggregated_by_month = []
    for entry in revenue_by_year:
        year = entry["year"]
        month = entry["month"]
        total_revenue = float(entry["total_revenue"])
        
        # Create a datetime object for the first day of the month
        time = datetime(year, month, 1)
        
        # Append the entry with datetime
        aggregated_by_month.append({
            "time": time,
            "total_revenue": total_revenue
        })


    return JsonResponse({"stat_by_year": aggregated_by_year,"stat_by_month": aggregated_by_month,})


@ensure_csrf_cookie
def stat_by_date(request):
    if not request.user.is_authenticated:
        return JsonResponse({"data": []})
    
    if (
        request.method != "GET"
        or "X-Date" not in request.headers
    ):
        return HttpResponse(content="Not allowed", status=406)
    
    parsed_date = datetime.strptime(request.headers['X-Date'], "%a, %d %b %Y %H:%M:%S %Z %z")
    print(parsed_date)
    products_sold = InvoiceItems.objects.filter(entry_time__date=parsed_date) \
        .values('name', 'code') \
        .annotate(quantity_sold=Sum('quantity'), total_revenue=Sum('total_with_tax')) \
        .order_by('-total_revenue')  # Optionally, order by revenue
    print("Hehe")
    print(list(products_sold))
    print("Hehe")

    return JsonResponse({"daily_sales_info": []})




@csrf_exempt
def publish_transaction(request):
    if (
        request.method != "POST"
        or "X-ApiKey" not in request.headers
        or request.headers["X-ApiKey"] != "123"
    ):
        return HttpResponse(content="Not allowed", status=406)

    payload = json.loads(json.loads(request.body.decode("utf-8")))

    if len(payload) == 0:
        return HttpResponse(content="Wrong data format", status=500)

    try:
        for obj in payload:
            data = InvoiceSchema.model_validate(obj)

            if not Invoice.objects.filter(pk=data.id).exists():
                invoice = Invoice.objects.create(
                    invoice_id=data.id,
                    entry_time=data.entry_time,
                    total_with_tax=data.total_with_tax,
                    cash=data.cash,
                    operator=data.operator,
                )
                invoice.save()
                for item in data.items:
                    invoice_items = InvoiceItems.objects.create(
                        invoice_id=data.id,
                        product_id=item.product_id,
                        name=item.name,
                        code=item.code,
                        buying_price=item.buying_price,
                        selling_price=item.selling_price,
                        quantity=item.quantity,
                        total_with_tax=item.total_with_tax,
                        entry_time=item.entry_time,
                    )
                    invoice_items.save()

        return JsonResponse({"status": "success"})
    except pydantic.ValidationError:
        return HttpResponse(content="Wrong data format", status=500)


@csrf_exempt
def sync_db_with_pos(request):
    if (
        request.method != "GET"
        or "X-ApiKey" not in request.headers
        or request.headers["X-ApiKey"] != "123"
    ):
        return HttpResponse(content="Not allowed", status=406)

    id_max_cloud = Invoice.objects.aggregate(Max("invoice_id"))["invoice_id__max"] or 0

    return JsonResponse({"status": "success", "id_max_cloud": id_max_cloud})


# Setting -> change password

# Profile -> show user detail
