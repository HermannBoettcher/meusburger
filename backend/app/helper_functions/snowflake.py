from snowflake.connector import connect, SnowflakeConnection
from snowflake.connector.cursor import SnowflakeCursor
from os import environ
from dotenv import load_dotenv


def limit_identifier_length(identifier: str) -> str:
    return identifier[:128] if len(identifier) > 255 else identifier


def setup_name_length_exceeded(setup_name: str) -> bool:
    return len('cb_comments_' + setup_name) > 255 or len('cb_history_' + setup_name) > 255


def escape_identifier(identifier: str) -> str:
    return limit_identifier_length(identifier).replace('"', '""')


def open_snowflake_cnx() -> SnowflakeConnection:

    load_dotenv()

    USER = environ.get('SNOWFLAKE_USER')
    PASSWORD = environ.get('SNOWFLAKE_PASSWORD')
    ACCOUNT = environ.get('SNOWFLAKE_ACCOUNT')
    DATABASE = environ.get('SNOWFLAKE_DATABASE')
    SCHEMA = environ.get('SNOWFLAKE_SCHEMA')

    cnx = connect(
        user=USER,
        password=PASSWORD,
        account=ACCOUNT,
        database=DATABASE,
        schema=SCHEMA,
        paramstyle='qmark'
    )

    return cnx


def get_cursor(cnx: SnowflakeConnection) -> SnowflakeCursor:
    if(cnx is None):
        cnx = open_snowflake_cnx()
    try:
        with cnx.cursor() as cur:
            cur.execute('SELECT 1;')
    except:
        cnx.close()
        cnx = open_snowflake_cnx()
    return cnx.cursor()


def commit(cnx: SnowflakeConnection) -> None:
    with get_cursor(cnx) as cur:
        cur.execute('COMMIT;')
