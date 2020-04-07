# __init__.py
from tornado.ioloop import IOLoop
from blog.blog import main


if __name__ == "__main__":
    IOLoop.current().start()
    IOLoop.current().run_sync(main)
