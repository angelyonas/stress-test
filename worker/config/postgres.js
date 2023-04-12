const base = {
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

const catalog = {
  host: process.env.POSTGRES_HOST_CATALOG,
  user: process.env.POSTGRES_USER_CATALOG,
  password: process.env.POSTGRES_PASSWORD_CATALOG,
  database: process.env.POSTGRES_DB_CATALOG,
  name: 'catalog'
}

const customer01 = {
  host: process.env.POSTGRES_HOST_CUSTOMER01,
  user: process.env.POSTGRES_USER_CUSTOMER01,
  password: process.env.POSTGRES_PASSWORD_CUSTOMER01,
  database: process.env.POSTGRES_DB_CUSTOMER01,
  name: 'customer01'
}

const customer02 = {
  host: process.env.POSTGRES_HOST_CUSTOMER02,
  user: process.env.POSTGRES_USER_CUSTOMER02,
  password: process.env.POSTGRES_PASSWORD_CUSTOMER02,
  database: process.env.POSTGRES_DB_CUSTOMER02,
  name: 'customer02'
}

// TODO: Env
const citus = {
  host: process.env.POSTGRES_HOST_CITUS,
  user: process.env.POSTGRES_USER_CITUS,
  password: process.env.POSTGRES_PASSWORD_CITUS,
  database: process.env.POSTGRES_DB_CITUS,
  name: 'citus00'
}

const dwh = {
  host: process.env.POSTGRES_HOST_DWH,
  user: process.env.POSTGRES_USER_DWH,
  password: process.env.POSTGRES_PASSWORD_DWH,
  database: process.env.POSTGRES_DB_DWH,
  name: 'dwh'
}

module.exports = [
  { ...base, ...catalog },
  { ...base, ...customer01 },
  { ...base, ...customer02 },
  { ...base, ...citus },
  { ...base, ...dwh }
]
