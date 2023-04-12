const baseCon = {
  port: process.env.POSTGRES_PORT,
  schema: process.env.POSTGRES_SCHEMA,
  connectionTimeoutMillis: 300000,
  max: 20,
  min: 10,
  idleTimeoutMillis: 300000,
  ssl: {
    rejectUnauthorized: false
  }
}

const postgresConCatalog = {
  host: process.env.POSTGRES_HOST_CATALOG,
  user: process.env.POSTGRES_USER_CATALOG,
  password: process.env.POSTGRES_PASSWORD_CATALOG,
  database: process.env.POSTGRES_DB_CATALOG,
  name: process.env.POSTGRES_DB_CATALOG,
  alias: process.env.POSTGRES_DB_CATALOG,
  ...baseCon
}

const postgresConCustomer01 = {
  host: process.env.POSTGRES_HOST_CUSTOMER01,
  user: process.env.POSTGRES_USER_CUSTOMER01,
  password: process.env.POSTGRES_PASSWORD_CUSTOMER01,
  database: process.env.POSTGRES_DB_CUSTOMER01,
  name: process.env.POSTGRES_DB_CUSTOMER01,
  alias: process.env.POSTGRES_DB_CUSTOMER01,
  ...baseCon
}

const postgresConCustomer02 = {
  host: process.env.POSTGRES_HOST_CUSTOMER02,
  user: process.env.POSTGRES_USER_CUSTOMER02,
  password: process.env.POSTGRES_PASSWORD_CUSTOMER02,
  database: process.env.POSTGRES_DB_CUSTOMER02,
  name: process.env.POSTGRES_DB_CUSTOMER02,
  alias: process.env.POSTGRES_DB_CUSTOMER02,
  ...baseCon
}

const postgresConCitus = {
  host: process.env.POSTGRES_HOST_CITUS,
  user: process.env.POSTGRES_USER_CITUS,
  password: process.env.POSTGRES_PASSWORD_CITUS,
  database: process.env.POSTGRES_DB_CITUS,
  name: process.env.POSTGRES_DB_CITUS,
  alias: process.env.POSTGRES_DB_CITUS,
  ...baseCon
}

module.exports = {
  postgresConCatalog,
  postgresConCustomer01,
  postgresConCustomer02,
  postgresConCitus
}
