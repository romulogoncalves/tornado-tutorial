# Information about Tornado

export DATABASE_URL='postgresql://postgres:md53175BCE1D3201D16594CEBF9D7EB3F9D@localhost/tornado_todo'

To connect to Postgres with Unix sockets you need to check the identification method for Postgres in sudo vim /etc/postgresql/10/main/pg_hba.conf.
The best is to set to md5. More info at: https://www.postgresql.org/docs/current/auth-pg-hba-conf.html. Not you need to generate a MD5 password.

https://stackoverflow.com/questions/14918763/generating-postgresql-user-password/14941263#14941263

Python project template:
https://pypi.org/project/python-project-template/

Packing:
https://python-packaging.readthedocs.io/en/latest/everything.html

Accessing Postgres from async:
https://github.com/aio-libs/aiopg


## Notes

We can use tornado to server static web-pages and build APIs.
We can build micro-services, serve via HTTP python program, and a proxy.

ioloop is the thread waiting for requests 

## Tornado structure
Information obtained from:
https://www.youtube.com/watch?v=cGgqtKmz2cI

### Application

The application defined the routes and defines the initial state.
```
tornado.web.Application([])
```

We can create an application to talk with a DBMS to load or retrieve data.

### HTTP server

To serve pages we need to initiate an HTTP server that serves the app we just created.
```
server = tornado.httpserver.HTTPServer(app)
server = listen(int(environ["SERVER_PORT"]), "localhost")
```

### IO Loop
The HTTP server will accept connections, but not yet requests. For that we need to instantiate
the IO Loop.

```
ioloop = tornado.ioloop.IOLoop.current()
ioloop.start()
```

### Request Handlers
That's where the work is done.
```
class ExampleHandler(tornado.web.RequestHandler):
    def get(self):
        self.finish("Hello neighboor!!!")

```

## DBMSs

### MongoDB
We could use MongoDB to store JSON files, like description of data catalogs. 
To interact asynchronously with the MongoDB. For that we use Motor. Motor is a asynchronously interface with MongoDB.
An API like PyMongo but with Futures.

The procedure is to create a Mongo connection in the `main()`.
```
motor_client = motor.motor_tornado.MotorClient(
    environ["MONGODB_URI"])

mongo_db = motor_client.get_default_database() 
```

Then it can be used in the Handler. To use in the handler you need to pass the db connection using `settings`.
The `GET` method reads information from the Database while the post, updates a record.

```
class ExampleHandler(tornado.web.RequestHandler):

    async def get(self, name):
        collection = await self.settings["mongo_db"].my_collection.find_one({"name": name})

        if collection is None:
            raise tornado.web.HTTPError(404, f"Missing collection: {name}")

        self.finish(collection["content"])

    async def post(self, name):
        await self.settings["mongo_db"].my_collection.replace_one(
            {"name": name},
            {
                "name": name,
                "content": json.loads(self.request.body)
            },
            upsert=True)
        self.set_status(204)
        self.finish()
        
```

## REDIS

For REDIS we can use `aioredis`, it allows us to run asyncio Redis client library.
We need to set a `AsyncIOMainLoop()` event loop in the `main` to use an asyncio library like `aioredis`.
```
tornado.platform.asyncio.AsyncIOMainLoop().install()
```
 
We need to connect to REDIS.
```
async def connect_redis(environ):
    return await aioredis.create_redis(
        (
            environ["REDIS_HOST"], environ["REDIS_PORT"]
        ))
```

Before we setup the `AsyncIOMainLoop()` we need to connect to the REDIS and for that we use `ioloop.run_sync()`.
We will run this in the `main`.
```
redis = ioloop.run_sync(functools.partial(connect_redis, environ))
```
Note: `ioloop.run_sync` expects a function, but to pass a function the environment we can use `functools.partial`
or we could use a lambda function.

Then we create an handle for REDIS database.
```
class RedisHandler(tornado.web.RequestHandler):
    
    async def get(self, name):
        record = await.self.settings["redis"].get(name)

        if record is None:
            raise tornado.web.HTTPError(
                404, f"Missing record for key:{name}")

        self.finish(record)

    async def post(self, name):
        await self.settings["redis"].set(name, self.request.body)

        self.set_status(204)
        self.finish()
```

## AsyncHTTPclient
In case we want to retrieve data from a catalog server and we do not have an async
library to do that, we can simply use the async HTTP Client. In this example we show how load data from
a weather web-site and then get the current temperature.

```
class MyClassHandler(tornado.web.RequestHandler):

    async def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        response = await client.fetch(self.settings["weather_uri"])
        
        body = json.loads(response_body)
        item = body["query"]["results"]["channel"]["item"]
        condition = item["condition"]
        temp = condition["temp"]
        text = condition["text"]

        self.finish(f"Currently {temp} degrees and {text} in Berlin, DE")

```

## Multiple operations in Parallel
We can execute multiple async operations at the same time.
```
await tornado.gen.multi([
    self.settings["mongo_db"].command("ping"),
    self.settings["redis"].ping(),
    self.check_mysql()
])
```

## Tornado security
In this section are all the notes about cookies and how they should be set and managed.
To understand how they work, the best is first start with
[security guide from tornado](https://www.tornadoweb.org/en/stable/guide/security.html)
and then check [blog example from tornado](https://github.com/tornadoweb/tornado/tree/stable/demos/blog).
A minamalist example can be found [here](https://github.com/mehmetkose/tornado-user-authentication-example/blob/master/app.py).





 
