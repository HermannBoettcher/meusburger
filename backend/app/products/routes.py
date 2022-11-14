from flask import request, Blueprint
from app.helper_functions.snowflake import get_cursor, commit


def tidy_string_quotes(s: str) -> str:
    s = s.strip("'").strip('"')
    s = s.replace('\"\"', '\"').replace('  ', ' ')
    return s


def construct_products_blueprint(cnx):

    products = Blueprint('products', __name__)

    @products.post('/upload')
    def upload_csv():
        response = {}
        file = request.files['file']
        lines = file.readlines()
        # skip header by starting skipping first line
        with get_cursor(cnx) as cur:
            cur.execute('TRUNCATE TABLE products;')
            for line in lines[1:]:
                fields = [tidy_string_quotes(entry)
                          for entry in str(line[:-1]).split(';')]
                id = int(fields[0][2:])
                print('ROW', fields)
                cur.execute('''
                    INSERT INTO products (
                        "id",
                        "product name",
                        "part number",
                        "prize"
                    ) VALUES (
                        ?,
                        ?,
                        ?,
                        ?
                    );
                ''', [id] + fields[1:])

        commit(cnx)

        return response

    @products.get('/product')
    def get_product_by_id():
        response = {}
        id = request.args['id']
        with get_cursor(cnx) as cur:
            cur.execute('SELECT * FROM products WHERE "Id" = ?;', [id])
            response['product'] = cur.fetchone()[0]
        return response

    @products.get('/products')
    def get_all_products():
        response = {}
        with get_cursor(cnx) as cur:
            cur.execute('SELECT * FROM products;')
            response['products'] = [
                list(e)[0:3] + [float(list(e)[3])] for e in cur.fetchall()]
        return response

    return products
