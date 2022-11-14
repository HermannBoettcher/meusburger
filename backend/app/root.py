from flask import Flask
from flask_cors import CORS
from app.helper_functions.snowflake import open_snowflake_cnx
from app.products.routes import construct_products_blueprint


def create_app():
    app = Flask(__name__)
    app.config.from_object('instance.config.DevelopmentConfig')
    CORS(app, resources={r"/*": {'origins': '*'}})

    cnx = open_snowflake_cnx()
    
    app.config['CORS_HEADERS'] = 'Content-Type'
    with app.app_context():
        app.register_blueprint(
            construct_products_blueprint(cnx)
        )

    app.debug = True

    return app
