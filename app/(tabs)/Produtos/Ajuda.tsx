import db from '../../db';

export const table = `TBCLIENTES`;

export const fields = [
  'ID',
  'DESCRICAO',
  'STATUS',
  'TIPO'
];

export interface IClient {
    ID: number;
    DESCRICAO: string;
    STATUS: number;
    TIPO: number;
}

const create = (obj:any) => {

  let sql = `
    INSERT INTO ${table} (ID, DESCRICAO, STATUS, TIPO) 
    VALUES (?, ?, ?, ?);
  `;

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(sql,
        fields.map((field) => obj[field]),
        (_:any, { rowsAffected, insertId }: { rowsAffected: number, insertId: number}) => {
          if (rowsAffected > 0) resolve(insertId);
          else
            reject(
              `Table: ${table} - Error inserting item: ${JSON.stringify(obj,null,2)}`
            );
        },
        function(_:any, error:any){
          console.log(error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const deleteItem = (ID:number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `DELETE FROM 
            ${table}
          WHERE
            ID = ?;
        `,
        [ID],
        (_:any, { rowsAffected }: { rowsAffected: number }) => {
          resolve(rowsAffected);
        },
        function(_:any, error:any){
          console.log(error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const length = (tipo:number) => {
  let filtro = '';
  if(typeof tipo != 'undefined'){
    filtro = 'WHERE TIPO = '+tipo;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            * 
          FROM
            ${table}
          `+filtro+`
          ORDER BY ID;
        `,
        [],
        (_:any, { rows }: { rows:any }) => resolve(rows.length),
        function(_:any, error:any){
          console.log(error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const pagination = (limit:number, offset:number, tipo:number) => {

  let filtro = '';
  if(typeof tipo != 'undefined'){
    filtro = 'WHERE TIPO = '+tipo;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            * 
          FROM
            ${table}
          `+filtro+`
          ORDER BY ID
          LIMIT ${limit}
          OFFSET ${offset};  
        `,
        [],
        (_:any, { rows }: { rows:any }) => resolve(rows._array),
        function(_:any, error:any){
          console.log(error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export default {
  create,
  deleteItem,
  length,
  pagination,
};