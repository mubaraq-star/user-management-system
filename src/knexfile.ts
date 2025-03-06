// // Update with your config settings.

// /**
//  * @type { Object.<string, import("knex").Knex.Config> }
//  */
// module.exports = {

//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: './dev.sqlite3'
//     }
//   },

//   staging: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// };


import { Knex } from "knex";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      
      filename: path.resolve(__dirname, 'db/dev.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "db/migration"), // Define migration directory
      extension: "ts", 
    },
  },
};

export default config;
