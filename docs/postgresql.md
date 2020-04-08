# PostgreSQL

Detailed information about installation, configuration and deployment.

## Installation

## Configuration

### User Credentials
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
## Deployment

