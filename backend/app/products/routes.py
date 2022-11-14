from flask import request, Blueprint
from app.helper_functions.snowflake import get_cursor
import pandas as pd
from snowflake.connector.pandas_tools import write_pandas


def construct_products_blueprint(cnx):

    products = Blueprint('products', __name__)

    @products.post('/upload')
    def upload_csv():
        response = {}
        file = request.files['file']
        total = pd.read_csv(
            file,
            sep=';',
            names=['id', 'product name', 'part number', 'prize'],
            doublequote=False
        )
        print('TEST', total)
        # total.replace(';"', '').replace('";', '').replace('"', '\"')
        with get_cursor(cnx) as cur:
            cur.execute('TRUNCATE TABLE products;')
        write_pandas(cnx, total, 'PRODUCTS')

        return response

    return products
