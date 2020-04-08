# setup.py
from setuptools import setup, find_packages

requires = [
    'tornado',
    'tornado-sqlalchemy',
    'sqlalchemy',
    'psycopg2',
    'passlib',
    'aiopg',
    'bcrypt',
    'asyncio',
    'markdown'
]

setup(
    name='tornado_tutorial',
    version='0.0',
    description='A tutorial with Tornado',
    author='Romulo Goncalves',
    author_email='<Your email>',
    keywords='web tornado',
    packages=find_packages(),
    install_requires=requires,
    include_package_data=True,
    entry_points={
        'console_scripts': [
            'serve_app = tutorial:main',
            'blog_app = blog:main',
            'initdb = tutorial.scripts.initializedb:main',
            'initBlogDB = blog.scripts.initializeBlogDB:main'
        ],
    },
)
