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
            'task_manager_app = task_manager:main',
            'blog_app = blog:main',
            'init_task_manager_db = task_manager.scripts.initializedb:main',
            'init_blog_db = blog.scripts.initializeBlogDB:main'
        ],
    },
)
