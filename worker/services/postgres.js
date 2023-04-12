const { Pool } = require('pg')
const { postgres } = require('../config')

module.exports = (() => {
  /**
   * @type {Object.<string, PGPool()>}
   */
  const pools = {}

  const connect = async () => {
    try {
      for (const config of postgres) {
        const pool = new Pool(config)
        pools[config.name] = PGPool(pool, config)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  const disconnect = async () => {
    for (const pool in pools) {
      await pools[pool].end()
    }
  }

  const QueryHelper = (client) => {
    const Fn = {
      /**
      *
      * @param {string} id
      * @returns {boolean}
      */
      isValidIdent: (id) => {
        return /^[a-z_][a-z0-9_.$]*$/i.test(id)
      },
      /**
      *
      * @param {string} operation
      * @param {any[]} parameters
      */
      callSP: async (operation, parameters) => {
        if (!Fn.isValidIdent(operation)) {
          throw new Error(`Invalid function name: ${operation}.`)
        }
        const paramSt = `(${parameters.map((p, i) => `$${i + 1}`).join(',')})`
        const result = await client.query(
          `SELECT * FROM ${operation} ${paramSt}`, parameters
        )

        return (result)
      },
      callSingleSP: async (operation, query = null) => {
        if (!Fn.isValidIdent(operation)) {
          throw new Error(`Invalid function name: ${operation}.`)
        }

        const result = await client.query(
          `SELECT * FROM ${operation} ${query ? `(${query})` : '()'}`
        )

        return (result)
      },
      callSingleQuery: async (operation, parameters) => {
        if (!Fn.isValidIdent(operation)) {
          throw new Error(`Invalid function name: ${operation}.`)
        }

        const result = await client.query(`SELECT cat FROM ${operation}('${JSON.stringify(parameters)}') as x(cat)`)
        return (result)
      },
      /**
      *
      */
      clearOrderInfoResults: async () => {
        return await client.query('drop table if exists Results')
      },

      /**
      *
      * @param {string} operation
      * @param {any[} parameters
      */
      callScalarSP: async (operation, parameters) => {
        const res = await Fn.callSP(operation, parameters)
        return res.rows[0]
      },

      /**
      *
      * @param {string} operation
      * @param {any[]} parameters
      */
      callJsonSP: async (operation, parameter) => {
        return Fn.callScalarSP(operation, [JSON.stringify(parameter)])
      }
    }
    return Fn
  }

  /**
   * @typedef {object} PGPoolInstance
   */
  /**
  * @param {Pool} pool
  * @param {any} config
  */
  function PGPool (pool, config) {
    const helper = QueryHelper(pool)

    async function connect () {
      return PGClient(await pool.connect())
    }

    async function transaction (fn) {
      const client = await connect()
      try {
        await client.begin()
        const result = await fn(client)
        await client.commit()
        return result
      } catch (e) {
        await client.rollback()
        throw e
      } finally {
        client.release()
      }
    }

    return /** @lends PGPoolInstance# */ {
      ...helper,
      transaction,
      connect,
      query: (...params) => pool.query(...params),
      end: pool.end,
      on: pool.on,
      pool: () => pool,
      config: () => config
    }
  }

  /**
  *
  * @param {Client} client
  */
  function PGClient (client) {
    const helper = QueryHelper(client)
    async function begin () {
      await client.query('BEGIN')
    }

    async function commit () {
      await client.query('COMMIT')
    }

    async function rollback () {
      await client.query('ROLLBACK')
    }

    return {
      begin,
      commit,
      rollback,
      ...helper,
      query: (...params) => client.query(...params),
      release: client.release,
      client: () => client
    }
  }
  return {
    pools: () => pools,
    connect,
    disconnect
  }
})()
