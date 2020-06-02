import knex from 'knex';
import path from 'path';

const connection = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'nextlevelweek'
    },
    migrations: {
        directory: path.resolve(__dirname, 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'seeds')
    },
    useNullAsDefault: true
})

export default connection;