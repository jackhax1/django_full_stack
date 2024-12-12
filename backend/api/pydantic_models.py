from pydantic import BaseModel, Json


class InvoiceItemSchema(BaseModel):
    product_id: int
    name: str
    code: str
    buying_price: float
    selling_price: float
    quantity: float
    total_with_tax: float
    entry_time: str

class InvoiceSchema(BaseModel):
    id: int
    entry_time: str
    total_with_tax: float
    cash: float
    operator: str
    items: list[InvoiceItemSchema]
