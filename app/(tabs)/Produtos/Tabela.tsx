import db from '../../db';

export const table = `TBPRODUTOS`;

export const fields = [
  'DESCRICAO',
  'EAN',
  'MARCA',
  'UM',
  'VALOR_VENDA',
  'VALOR_COMPRA',
  'STATUS',
  'ID',
];

export interface IProduto {
    DESCRICAO: string;
    EAN: string;
    MARCA: string;
    UM: string;
    VALOR_VENDA: number;
    VALOR_COMPRA: number;
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
      INSERT INTO ${table} (DESCRICAO, EAN, MARCA, UM, VALOR_VENDA, VALOR_COMPRA, STATUS, ID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
  }else{

    sql = `
      UPDATE ${table} SET DESCRICAO = ?, EAN = ?, MARCA = ?, UM = ?, VALOR_VENDA = ?, VALOR_COMPRA = ?, STATUS = ? WHERE ID = ?;
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

const length = (seach:string, tipo:number) => {

  let filtroText = '';
  if(typeof seach != 'undefined' && seach.length > 0){
    filtroText = 'WHERE ';

    const searchP = seach.trim().replace(/\s+/g, '%');

    filtroText += `(LOWER(DESCRICAO) LIKE LOWER('%${searchP}%') OR LOWER(EAN) LIKE LOWER('%${searchP}%'))`;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            * 
          FROM
            ${table}
            ${filtroText}

          ORDER BY ID DESC;
        `,
        [],
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

const pagination = (seach:string, limit:number, offset:number, tipo:number) => {

  let filtroText = '';
  if(typeof seach != 'undefined' && seach.length > 0){
    filtroText = 'WHERE ';

    const searchP = seach.trim().replace(/\s+/g, '%');

    filtroText += `(LOWER(DESCRICAO) LIKE LOWER('%${searchP}%') OR LOWER(EAN) LIKE LOWER('%${searchP}%'))`;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            * 
          FROM
            ${table}
          ${filtroText}

          ORDER BY ID DESC
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

const list = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            * 
          FROM
            ${table}
          WHERE STATUS = 1
          ORDER BY ID DESC
        ;  
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
  list
};