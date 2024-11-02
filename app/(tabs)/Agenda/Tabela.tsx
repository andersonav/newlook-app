import db from '../../db';

export const table = `TBEVENTOS`;

export const fields = [
  'DESCRICAO',
  'PESSOA_ID',
  'HORA',
  'DIA',
  'MES',
  'ANO',
  'STATUS',
  'ID'
];

export interface IEvento {
    DESCRICAO: string;
    PESSOA_ID: number;
    HORA: string;
    DIA: number;
    MES: number;
    ANO: number;
    STATUS: number;
    ID: number;
}

const getID = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            ID
          FROM
            TBGIDS
          WHERE TABELA = '${table}';
        `,
        [],
        (_:any, { rows }: { rows:any }) => {
          if (rows.length > 0) {
            let id = rows._array[0].ID+1;

            tx.executeSql(
              `UPDATE TBGIDS SET ID = ? WHERE TABELA = '${table}';`,
              [id],
              (_:any, response:any) => resolve(response),
              (_:any, error:any) => reject(error)
            );

            resolve(id);
          }else{

            tx.executeSql(
              `INSERT INTO TBGIDS (ID, TABELA) VALUES (?, ?);`,
              [1, table],
              (_:any, response:any) => resolve(response),
              (_:any, error:any) => reject(error)
            );

            resolve(1);
          }
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

const create = async (obj:any) => {

  let sql = ``;

  if(obj.ID == 0){
    obj.ID = await getID();

    sql = `
      INSERT INTO ${table} (DESCRICAO, PESSOA_ID, HORA, DIA, MES, ANO, STATUS, ID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
  }else{

    sql = `
      UPDATE ${table} SET DESCRICAO = ?, PESSOA_ID = ?, HORA = ?, DIA = ?, MES = ?, ANO = ?, STATUS = ? WHERE ID = ?;
    `;
  }

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

const length = (dia:number, mes:number, ano:number) => {

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            A.*,
            C.RAZAO_SOCIAL as DESC_CLIENTE
          FROM
            ${table} A
            LEFT JOIN TBCLIENTES C ON C.ID = A.PESSOA_ID
          WHERE DIA = ?
          AND MES   = ?
          AND ANO   = ?

          ORDER BY HORA;
        `,
        [dia, mes, ano],
        (_:any, { rows }: { rows:any }) => resolve(rows._array.length),
        function(_:any, error:any){
          console.log(error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const getAgendamento = (mes:number, ano:number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            A.*
          FROM
            ${table} A
          WHERE MES = ?
          AND ANO   = ?
          ;  
        `,
        [mes, ano],
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

const pagination = (dia:number, mes:number, ano:number, limit:number, offset:number) => {

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            A.*,
            C.RAZAO_SOCIAL as DESC_CLIENTE
          FROM
            ${table} A
          LEFT JOIN TBCLIENTES C ON C.ID = A.PESSOA_ID
          WHERE DIA = ?
          AND MES   = ?
          AND ANO   = ?

          ORDER BY ID DESC
          LIMIT ${limit}
          OFFSET ${offset};  
        `,
        [dia, mes, ano],
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
  getAgendamento
};