# setup.py
from setuptools import setup, find_packages

requires = [
    'tornado',
    'tornado-sqlalchemy',
    'sqlalchemy',
    'psycopg2',
    'passlib'
]

setup(
    name='tornado_todo',
    version='0.0',
    description='A To-Do List built with Tornado',
    author='<Your name>',
    author_email='<Your email>',
    keywords='web tornado',
    packages=find_packages(),
    install_requires=requires,
    include_package_data=True,
    entry_points={
        'console_scripts': [
            'serve_app = todo:main',
            'initdb = todo.scripts.initializedb:main',
        ],
    },
)
