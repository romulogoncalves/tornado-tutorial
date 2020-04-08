import aiopg
import psycopg2
import os
import tornado
import asyncio
from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)
define("db_host", default="127.0.0.1", help="blog database host")
define("db_port", default=5432, help="blog database port")
define("db_database", default="blog", help="blog database name")
define("db_user", default="blog", help="blog database user")
define("db_password", default="blog", help="blog database password")


async def maybe_create_tables(db):
    try:
        with (await db.cursor()) as cur:
            await cur.execute("SELECT COUNT(*) FROM entries LIMIT 1")
            await cur.fetchone()
    except psycopg2.ProgrammingError:
        try:
            with open(os.path.join(os.path.dirname(__file__), "schema.sql")) as f:
                schema = f.read()
            with (await db.cursor()) as cur:
                await cur.execute(schema)
        except Exception as exc:
            raise exc


async def connect_to_db():
    tornado.options.parse_command_line()

    # Create the global connection pool.
    try:
        db: object = await aiopg.create_pool(
            host=options.db_host,
            port=options.db_port,
            user=options.db_user,
            password=options.db_password,
            dbname=options.db_database,
            )
    except psycopg2.OperationalError as e:
        print("It was not possible to connect to PostgreSQL: " + str(e))
    else:
        try:
            await maybe_create_tables(db)
        except Exception as exc:
            print("It was not possible to create tables: " + str(exc))
        else:
            return db


async def disconnect_to_db(db):
    tornado.options.parse_command_line()

    # Create the global connection pool.
    try:
        await db.clear()
    except Exception as exc:
        print("It was not possible to disconnect from PostgreSQL: " + str(exc))


def main():
    """ Python 3.7"""
    #db = asyncio.run(connect_to_db())
    #asyncio.run(disconnect_to_db(db))

    """Python 3.6"""
    loop = asyncio.get_event_loop()
    db = loop.run_until_complete(connect_to_db())
    loop.run_until_complete(disconnect_to_db(db))
    loop.stop()
    loop.close()
