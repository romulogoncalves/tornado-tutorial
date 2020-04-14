# initializedb.py
from sqlalchemy import engine_from_config
from task_manager import SQLALCHEMY_URL
from task_manager.models import Base
from sqlalchemy import create_engine
import os


def main():
    """Tear down existing tables and create new ones."""
    engine = create_engine(os.environ.get('DATABASE_URL'))
    if bool(os.environ.get('DEBUG', '')):
        Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine, Base.metadata.tables.values(), checkfirst=True)
