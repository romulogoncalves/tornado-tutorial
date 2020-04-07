from typing import Optional, Awaitable

import os
import tornado.web
import tornado.ioloop
from tornado.options import options
from http import HTTPStatus as status



class BasicRequestHandler(tornado.web.RequestHandler):
    def data_received(self, chunk: bytes) -> Optional[Awaitable[None]]:
        pass

    def get(self):
        self.write("Hello, world!!!")


class StaticRequestHandler(tornado.web.RequestHandler):
    def data_received(self, chunk: bytes) -> Optional[Awaitable[None]]:
        pass

    def get(self):
        self.render("index_static .html")


class QueryStringRequestHandler(tornado.web.RequestHandler):
    def data_received(self, chunk: bytes) -> Optional[Awaitable[None]]:
        pass

    def get(self):
        """You need to call the URL: /isEven?n=<number>"""
        n = int(self.get_argument("n"))
        r = "odd" if n % 2 else "even"
        self.write("the number n is " + str(n) + " and it is " + r + "!!!")


class ResourceRequestHandler(tornado.web.RequestHandler):
    """In this case we use a regular expression to say we expect here a number."""

    """
        We define which methods we want to use.
        GET - to read
        PUT - Replace or add a document.
        PATCH - To update an existent document.
    """
    SUPPORTED_METHODS = ("DATA_RECEIVED", "GET")

    def data_received(self, chunk: bytes) -> Optional[Awaitable[None]]:
        pass

    """In this case the get expects another handler, in this case called id."""
    def get(self, id):
        """You need to call the URL: /isEven?n=<number>"""
        self.write("The ID that you requested is " + str(id) + "!!!")


class ResponseHandler(tornado.web.RequestHandler):
    SUPPORTED_METHODS = "GET"

    """It will write a response as a Json object and set the status to 200_OK."""
    def get(self, id):
        response = {
            'name': 'My Name',
            'age': id
        }
        self.set_status(status.OK)
        """Since response is a dictionary, Tornado Request Handler will automatically write it as a JSON object."""
        self.write(response)


if __name__ == "__main__":
    """
    The web.Application will create an App.
    The App will have request handlers. For different URLs, requests, we will have different handlers.
    We can have requests of static pages, but also the request of pages with a query (/?itemid=30
    """

    app = tornado.web.Application([
        (r"/", BasicRequestHandler),
        (r"/blog", StaticRequestHandler),
        (r"/isEven", QueryStringRequestHandler),
        (r"/tweet/([0-9]+)", ResourceRequestHandler),
        (r"/me/([0-9]+)", ResponseHandler)

    ],
        cookie_secret=os.environ.get('SESSION_SECRET', 'beefy'),
        **options.group_dict('application'),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        template_path=os.path.join(os.path.dirname(__file__), "templates")
    )

    """We will have the app listening on port 8881"""
    app.listen(8881)

    """Then we start ioloop thread."""
    print("I'm listening on port 8881")
    tornado.ioloop.IOLoop.current().start()
