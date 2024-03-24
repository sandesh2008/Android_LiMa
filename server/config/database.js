import mysql from 'mysql';
import mysql2 from 'mysql2';

const openConnection = () => {
  const connection = mysql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'sandesh',
    password: '124421',
    database: 'lima',
  })

  connection.connect()

  return connection
}

// const openConnection = () => {
//   const connection = mysql.createConnection({
//     port: 3306,
//     host: 'localhost',
//     user: 'sunbeam',
//     password: 'sunbeam',
//     database: 'lima',
//   })

//   connection.connect()

//   return connection
// }

// const openConnection2 = async () => {
//   const connection = await mysql2.createConnection({
//     port: 3306,
//     host: 'localhost',
//     user: 'sandesh',
//     password: '124421',
//     database: 'lima',
//   })

//   return connection
// }

const openConnection2 = async () => {
  const connection = await mysql2.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'sunbeam',
    password: 'sunbeam',
    database: 'lima',
  })

  return connection
}

export default {openConnection,openConnection2}