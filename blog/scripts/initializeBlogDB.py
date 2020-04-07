import aiopg
import psycopg2
import tornado
import asyncio
from tornado.options import define, options


async def maybe_create_tables(db):
    try:
        with (await db.cursor()) as cur:
            await cur.execute("SELECT COUNT(*) FROM entries LIMIT 1")
            await cur.fetchone()
    except psycopg2.ProgrammingError:
        with open("scripts/schema.sql") as f:
            schema = f.read()
        with (await db.cursor()) as cur:
            await cur.execute(schema)


def main():
    tornado.options.parse_command_line()

    # Create the global connection pool.
    db = yield from aiopg.create_pool(
            host=options.db_host,
            port=options.db_port,
            user=options.db_user,
            password=options.db_password,
            dbname=options.db_database,
    )
    loop = asyncio.get_event_loop()
    loop.run_until_complete(maybe_create_tables(db))
    loop.close()


