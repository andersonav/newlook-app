import db from '../../db';

export const table = `TBCONTAS`;

export const fields = [
  'DESCRICAO',
  'PESSOA_ID',
  'PRODUTO_ID',
  'VALOR_PAGAR',
  'VALOR_PAGO',
  'DATA_PAGAMENTO',
  'DATA_PREVISAO',
  'DATA_REGISTRO',
  'STATUS',
  'TIPO',
  'ID',
];

export interface IConta {
    DESCRICAO: string;
    PESSOA_ID: number;
    PRODUTO_ID: number;
    VALOR_PAGAR: number;
    VALOR_PAGO: number;
    DATA_PAGAMENTO: Date;
    DATA_PREVISAO: Date;
    DATA_REGISTRO: Date;
    STATUS: number;
    TIPO: number;
    ID: number;

    DESC_CLIENTE: string;
    DESC_PRODUTO: string;
    VALOR_PENDENTE: 0;
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
      INSERT INTO ${table} (DESCRICAO, PESSOA_ID, PRODUTO_ID, VALOR_PAGAR, VALOR_PAGO, DATA_PAGAMENTO, DATA_PREVISAO, DATA_REGISTRO, STATUS, TIPO, ID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  }else{

    sql = `
      UPDATE ${table} SET DESCRICAO = ?, PESSOA_ID = ?, PRODUTO_ID = ?, VALOR_PAGAR = ?, VALOR_PAGO = ?, DATA_PAGAMENTO = ?, DATA_PREVISAO = ?, DATA_REGISTRO = ?, STATUS = ?, TIPO = ? WHERE ID = ?;
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

    filtroText += `(LOWER(DESCRICAO) LIKE LOWER('%${searchP}%'))`;
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

const getContas = (dataInicial:string, dataFinal:string, cliente:number) => {

  let filtro = '';

  if(cliente > 0){
    filtro = 'AND C.PESSOA_ID = '+cliente;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            C.ID,
            C.DATA_REGISTRO,
            COALESCE(A.RAZAO_SOCIAL,'CLIENTE PADRÃO') AS CLIENTE,
            COALESCE(B.DESCRICAO,'PRODUTO PADRÃO') AS PRODUTO,
            C.TIPO,
            C.VALOR_PAGAR,
            C.VALOR_PAGAR - C.VALOR_PAGO AS VALOR_PENDENTE
          FROM TBCONTAS C
          LEFT JOIN TBCLIENTES A ON A.ID = C.PESSOA_ID 
          LEFT JOIN TBPRODUTOS B ON B.ID = C.PRODUTO_ID 
          WHERE DATE(C.DATA_REGISTRO) BETWEEN ? AND ?

          ${filtro}

          ORDER BY C.DATA_REGISTRO DESC
        `,
        [dataInicial, dataFinal],
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

const pagination = (seach:string, limit:number, offset:number, tipo:number) => {

  let filtroText = '';
  if(typeof seach != 'undefined' && seach.length > 0){
    filtroText = 'WHERE ';

    const searchP = seach.trim().replace(/\s+/g, '%');

    filtroText += `(LOWER(A.DESCRICAO) LIKE LOWER('%${searchP}%'))`;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      tx.executeSql(
        `SELECT
            A.*,
            B.DESCRICAO as DESC_PRODUTO,
            C.RAZAO_SOCIAL as DESC_CLIENTE,
            A.VALOR_PAGAR - A.VALOR_PAGO as VALOR_PENDENTE
          FROM
            ${table} A
            LEFT JOIN TBPRODUTOS B ON B.ID = A.PRODUTO_ID
            LEFT JOIN TBCLIENTES C ON C.ID = A.PESSOA_ID
          ${filtroText}

          ORDER BY A.ID DESC
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
  getContas
};