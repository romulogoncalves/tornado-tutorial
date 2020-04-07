# Tornado tutorial
"_Tornado is a Python web framework and asynchronous networking library, originally developed at FriendFeed. By using non-blocking network I/O, Tornado can scale to tens of thousands of open connections, making it ideal for long polling, WebSockets, and other applications that require a long-lived connection to each user._" - [Tornado documentation](https://www.tornadoweb.org/en/stable/)


## Tornado structure
We can use tornado to server static web-pages and build APIs. We can build micro-services, serve via HTTP python program, and a proxy.
Tornado structure is divided into 4 blocks:
* Application - it defines the routes and defines the initial state.
```
tornado.web.Application([])
```
* HTTP Server - it serves the app we created.
```
server = tornado.httpserver.HTTPServer(app)
server = listen(int(environ["SERVER_PORT"]), "localhost")
```
* IO Loop. The HTTP server will accept connections, but not yet requests. For that we need to instantiate
the IO Loop.

```
ioloop = tornado.ioloop.IOLoop.current()
ioloop.start()
```
* Request Handlers - it is where the work is done.
```
class ExampleHandler(tornado.web.RequestHandler):
    def get(self):
        self.finish("Hello neighboor!!!")

```
 
A cool description of its structure is provided by a tutorial from [Tim Jensen - Building Asynchronous Microservices with Tornado (PyTexas 2017)](https://www.youtube.com/watch?v=cGgqtKmz2cI).

## Tornado applications


### Storage Systems
Often we use a storage system to store static data or a DBMS to store metadata or user login credentials.
For some DBMS we have `async` libraries to be used in a Tornado application. We will show how to use them
in case we need to store JSON files in MongoDB or retrieve data from REDIS. In case an `async` library is not
provided, we also provide an example on how to do it with `AsyncHTTPclient`.   

#### PostgreSQL
For `async` communication with PostgreSQL we can use [aiopg](https://github.com/aio-libs/aiopg).  

1) Establish a connection.
    The login information is encrypted. To connect to Postgres with Unix sockets you need to check the identification method for Postgres in sudo vim /etc/postgresql/10/main/pg_hba.conf.
    The best is to set to md5, more info at [auth-pg-hba-conf.html](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html). 

    An MD5 password can be generated in a web-site or using a command line tool, such as `mkpasswd -m help`.
    Note that the password for PostgreSQL also need to have the username included (more info [here](https://stackoverflow.com/questions/14918763/generating-postgresql-user-password/14941263#14941263)).
    ```
    pghash = "md5" + hashlib.md5(password + username).hexdigest()
    ```

    ```
    export DATABASE_URL='postgresql://postgres:md53175BCE1D3201D16594CEBF9D7EB3F9D@localhost/tornado_todo'
    ```

#### MongoDB
[MongoDB]() is a cross-platform document oriented database program. It is classified as a NoSQL database
program and it uses JSON-like documents with schema. It can be used to store JSON files like the ones used
to describe large catalogs such as in Remote Sensing data banks.
 
For asynchronous access to MongoDB we use [Motor](https://motor.readthedocs.io/en/stable/). It is an asynchronous
Python driver for MongoDB, i.e., it is an API like PyMongo but with Futures. The steps to establish a connection,
read and write data are the following:  
1) First step is to create a MongoDB connection in the `main()`.
    ```
    motor_client = motor.motor_tornado.MotorClient(
    environ["MONGODB_URI"])

    # In this example we use the default database
    mongo_db = motor_client.get_default_database() 
    ```
2) Define an Handler which uses the MongoDB connection to read data - `get` and write data - `post`. To use the open connection, `mongo_db` needs to be passed using `settings`.

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


#### REDIS
[Redis](https://redis.io/) is an in-memory data structure project implementing a distributed,
in-memory key-value database. _"It supports data structures such as strings, hashes, lists, sets,
sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams."_

For asynchronous access to REDIS we can use [aioredis](https://github.com/aio-libs/aioredis) library. 
The steps to connect to REDIS, read and write data are the following:
1) Connect to REDIS.
    ```
    async def connect_redis(environ):
        return await aioredis.create_redis(
            (
                environ["REDIS_HOST"], environ["REDIS_PORT"]
            ))
    ```
2) Establish the connection using `ioloop.run_sync` in the `main()`.
    ```
    redis = ioloop.run_sync(functools.partial(connect_redis, environ))
    ```
3) Set a `AsyncIOMainLoop()` event loop in the `main()` so we can use an asynchronous library like `aioredis`.
    ```
    tornado.platform.asyncio.AsyncIOMainLoop().install()
    ```
    **Note:** `ioloop.run_sync` expects a function, but to pass a function the environment we can use `functools.partial`
    or we could use a lambda function.
4) Create an Handler to handle HTTP requests to read data - `get()` and write data - `post()`.
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

#### AsyncHTTPclient
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

### Tornado security
In this section are all the notes about cookies and how they should be set and managed.
To understand how they work, the best is first start with
[security guide from tornado](https://www.tornadoweb.org/en/stable/guide/security.html)
and then check [blog example from tornado](https://github.com/tornadoweb/tornado/tree/stable/demos/blog).
A minimalistic example can be found [here](https://github.com/mehmetkose/tornado-user-authentication-example/blob/master/app.py).

### Extras
 
#### Multiple operations in Parallel
We can execute multiple async operations at the same time.
```
await tornado.gen.multi([
    self.settings["mongo_db"].command("ping"),
    self.settings["redis"].ping(),
    self.check_mysql()
])
```
### Development
* [Python project templates](https://pypi.org/project/python-project-template/)
* [Packing a python project](https://python-packaging.readthedocs.io/en/latest/everything.html)
