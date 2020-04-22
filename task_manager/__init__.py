# __init__.py
import logging
import os

from task_manager.views import (
    HomeView,
    ErrorView,
    InfoView,
    LoginView,
    ProfileView,
    RegistrationView,
    TaskListView,
    TaskView
)
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.options import options, define
from tornado_sqlalchemy import SQLAlchemy
from tornado.web import Application


SQLALCHEMY_URL = os.environ.get('DATABASE_URL', '')
define('port', default=8888, help='port to listen on')


def main():
    """Construct and serve the tornado application."""
    api_root = '/api/v1'
    app = Application(handlers=[
        (r'/', HomeView),
        (r'/favicon.ico', HomeView),
        (r'/error_500', ErrorView),
        (api_root, InfoView),
        (api_root + r'/login', LoginView),
        (api_root + r'/accounts', RegistrationView),
        (api_root + r'/accounts/([\w]+)', ProfileView),
        (api_root + r'/accounts/([\w]+)/tasks', TaskListView),
        (api_root + r'/accounts/([\w]+)/tasks/([\d]+)', TaskView),
    ],
        db=SQLAlchemy(os.environ.get('DATABASE_URL', 'postgres://postgres:postgres@localhost:5432/task_manager')),
        cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
        **options.group_dict('application'),
        login_url="/api/v1/login",
        xsrf_cookies=True,
        debug=True,
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        template_path=os.path.join(os.path.dirname(__file__), "templates")
    )
    print(str(os.path.join(os.path.dirname(__file__), "static")))
    http_server = HTTPServer(app)
    http_server.listen(options.port)
    print('Listening on http://localhost:%d' % options.port)
    logging.info('Listening on http://localhost:%d' % options.port)
    IOLoop.current().start()

