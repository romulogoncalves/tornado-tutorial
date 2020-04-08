# PostgreSQL

Detailed information about installation, configuration and deployment.

## Installation
Steps for the installation of PostgreSQL 12
1) Add PostgreSQL 12 repository.
   ```
   wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
   echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
   ```
2) Install PostgreSQL 12 on Ubuntu.
   ```
   sudo apt update
   sudo apt -y install postgresql-12 postgresql-client-12
   ```
3) Start and stop PostgreSQL 12 on Ubuntu.
   ```
   sudo service postgresql start
   sudo service postgresql stop
   ```
4) Login as user postgres to create a new DB and user.
   ```
   sudo su - postgres
   psql
   ```
   In the psql console type the following:
   ```
   postgres=# CREATE DATABASE mytestdb;
   CREATE DATABASE
   postgres=# CREATE USER mytestuser WITH ENCRYPTED PASSWORD 'MyStr0ngP@SS';
   CREATE ROLE
   postgres=# GRANT ALL PRIVILEGES ON DATABASE mytestdb to mytestuser;
   GRANT
   ```
   To list databases use `\l`, to list tables use `\d` and quit use `\q`.

## Configuration

### User Credentials
The login information is encrypted. To connect to Postgres with Unix sockets you need to
check the identification method for Postgres in `pg_hba.conf` (it is recommend to set it
to md5, more info at [auth-pg-hba-conf.html](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)).
```
sudo vim /etc/postgresql/<version>/main/pg_hba.conf
```
An MD5 password can be generated in a web-site or using a command line tool, such as `mkpasswd -m help`.

**Note:** The password for PostgreSQL also need to have the username included (more info [here](https://stackoverflow.com/questions/14918763/generating-postgresql-user-password/14941263#14941263)).
    ```
    pghash = "md5" + hashlib.md5(password + username).hexdigest()
    ```

## Deployment
