from flask import request, Blueprint

def construct_products_blueprint(cnx):

    products = Blueprint('products', __name__)
