import * as SQLite from "expo-sqlite/legacy";
import Numeral from "numeral";
import moment from "moment";
import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import api from "../utils/api";
import { formatNumber } from "../utils/utils";

async function updateDbExecute(tdb, flag) {
  console.log("@@@@@@@@@@@@@@@ - Update DB (" + flag + ")");
  console.log("@@@@@@@@@@@@@@@ - " + FileSystem.documentDirectory);

  let databaseVersao = 0;
  tdb.versao_app = "1.0.0";
  tdb.versao_banco = 0;

  let updateVersao = function (versao) {
    //console.log('*** Atualizando versao do banco:'+databaseVersao+' -> '+versao);

    return new Promise((resolve, reject) => {
      tdb.transaction((tx) => {
        tx.executeSql(
          `UPDATE DATABASE_VERSAO SET VERSAO = ? WHERE ID = 1;`,
          [versao],
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) {
              databaseVersao = versao;
              resolve(insertId);
            } else {
              //console.log('#### - Erro ao atualizar versao do banco - ####');
            }
          },
          (_, error) => {
            //console.log(error); db.logAdd(error.message);
            reject(error);
          }
        );
      });
    });
  };

  let insertVersao = function (versao) {
    return new Promise((resolve, reject) => {
      tdb.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO DATABASE_VERSAO (ID, VERSAO, APP) VALUES (1, 1, '1.0.0');`,
          [],
          (_, { rowsAffected, insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            console.log(error);
            db.logAdd(error.message);
            reject(error);
          }
        );
      });
    });
  };

  let setUpdateAllTabele = function (tabela) {
    return new Promise((resolve, reject) => {
      tdb.transaction((tx) => {
        tx.executeSql(
          `SELECT
                        * 
                      FROM TABELA_UPDATE
                      WHERE TABELA = ?;
                    `,
          [tabela],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows._array[0]);
            } else {
              tx.executeSql(
                `INSERT INTO TABELA_UPDATE (TABELA) VALUES (?);`,
                [tabela],
                (_, { rowsAffected, insertId }) => {
                  resolve(insertId);
                },
                (_, error) => {
                  console.log(error);
                  db.logAdd(error.message);
                  reject(error);
                }
              );
            }
          },
          (_, error) => {
            console.log(error);
            db.logAdd(error.message);
            reject(error);
          }
        );
      });
    });
  };

  db.setUpdateAllTabele = setUpdateAllTabele;

  if (flag == 1) {
    await updateVersao(0);
  }

  let listaEstrutura = [
    {
      databaseVersao: 0,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS TABELA_UPDATE (ID INTEGER PRIMARY KEY AUTOINCREMENT, TABELA TEXT);`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 0,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS DATABASE_VERSAO (ID INTEGER NOT NULL, VERSAO INTEGER NOT NULL, APP TEXT);`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 0,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `SELECT
                        * 
                      FROM
                        DATABASE_VERSAO
                      WHERE ID = 1;
                    `,
              [],
              (_, { rows }) => {
                if (rows.length > 0) {
                  databaseVersao = Number(rows._array[0].VERSAO);
                  resolve(rows._array[0]);
                } else {
                  Promise.all([insertVersao(1)]).then(async () => {
                    resolve({});
                  });
                }
              },
              (_, error) => {
                console.log(error);
                db.logAdd(error.message);
                reject(error);
              }
            );
          });
        });
      },
    },
    {
      databaseVersao: 4,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS TBCLIENTES (
                ID INTEGER,
                DESCRICAO TEXT,
                STATUS INTEGER,
                TIPO INTEGER
               );
              `,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 5,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCLIENTES ADD COLUMN RAZAO_SOCIAL TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 6,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCLIENTES ADD COLUMN NOME_FANTAZIA TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 7,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCLIENTES ADD COLUMN ENDERECO TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 8,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCLIENTES ADD COLUMN NUMERO TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 9,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCLIENTES ADD COLUMN CEP TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 10,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCLIENTES ADD COLUMN CPF_CNPJ TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 11,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS TBGIDS (
                ID INTEGER,
                TABELA TEXT
               );
              `,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 12,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS TBPRODUTOS (
                ID INTEGER,
                DESCRICAO TEXT,
                STATUS INTEGER,
                UM TEXT,
                EAN TEXT,
                MARCA TEXT,
                VALOR_VENDA TEXT,
                VALOR_COMPRA TEXT
               );
              `,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 14,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS TBCONTAS (
                ID INTEGER,
                STATUS INTEGER,
                DESCRICAO TEXT,
                PESSOA_ID INTEGER,
                PRODUTO_ID INTEGER,
                VALOR_PAGAR TEXT,
                VALOR_SALDO TEXT,
                DATA_PAGAMENTO TEXT,
                DATA_PREVISAO TEXT
               );
              `,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 15,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCONTAS ADD COLUMN VALOR_PAGO TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 17,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCONTAS ADD COLUMN TIPO TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 18,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBCONTAS ADD COLUMN DATA_REGISTRO TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 19,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS TBEVENTOS (
                ID INTEGER,
                STATUS INTEGER,
                DESCRICAO TEXT,
                PESSOA_ID INTEGER,
                DIA TEXT,
                MES TEXT,
                ANO TEXT
              );
              `,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
    {
      databaseVersao: 20,
      limparTabela: "",
      executar: function () {
        return new Promise((resolve, reject) => {
          tdb.transaction((tx) => {
            tx.executeSql(
              `ALTER TABLE TBEVENTOS ADD COLUMN HORA TEXT;`,
              [],
              (_, response) => resolve(response),
              (_, error) => reject(error)
            );
          });
        });
      },
    },
  ];

  for (let index = 0; index < listaEstrutura.length; index++) {
    const estrutura = listaEstrutura[index];

    if (databaseVersao < estrutura.databaseVersao || estrutura.databaseVersao == 0) {
      console.log("Executando " + index);
      tdb.logAdd("Executando " + index);

      try {
        try {
          await estrutura.executar();
        } catch (error) {
          //console.log('********* erro *********');
          //console.log(error);
        }

        if (estrutura.databaseVersao > 0 && databaseVersao < estrutura.databaseVersao) {
          await updateVersao(estrutura.databaseVersao);
        }

        if (estrutura.limparTabela != "") {
          setUpdateAllTabele(estrutura.limparTabela);
        }
      } catch (error) {
        console.log("Erro ao dar update no banco, v" + estrutura.databaseVersao);
        tdb.logAdd("Erro ao dar update no banco, v" + estrutura.databaseVersao);
      }
    }

    tdb.versao_banco = databaseVersao;
  }

  console.log("versão DB:" + tdb.versao_banco);
  tdb.logAdd("versão DB:" + tdb.versao_banco);
}

let db = SQLite.openDatabase("NewLookApp.db", "1.0.0", "banco do Gestão Salão", 1024, async function (tdb) {
  await updateDbExecute(tdb, 0);
});

db.consultaSql = function (sql) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array);
          } else {
            resolve([]);
          }
        },
        (_, error) => {
          console.log(error);
          db.logAdd(error.message);
          reject(error);
        }
      );
    });
  });
};

db.executarSql = function (sql) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [],
        (_, { rowsAffected, insertId }) => {
          resolve(rowsAffected);
        },
        (_, error) => {
          console.log(error);
          db.logAdd(error.message);
          reject(error);
        }
      );
    });
  });
};

db.delTabelaResete = function (tabela_id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM TABELA_UPDATE WHERE ID = ?`,
        [tabela_id],
        (_, { rowsAffected, insertId }) => {
          resolve(rowsAffected);
        },
        (_, error) => {
          console.log(error);
          db.logAdd(error.message);
          reject(error);
        }
      );
    });
  });
};

db.updateDbExecute = async function (tdb, flag) {
  return new Promise(async (resolve, reject) => {
    await updateDbExecute(tdb, flag);
    resolve();
  });
};

db.LISTA_LOG = [];

saveFile = async (nome, conteudo) => {
  let filename = FileSystem.documentDirectory + nome;
  FileSystem.writeAsStringAsync(filename, conteudo, { encoding: FileSystem.EncodingType.UTF8 });
};

loadFile = async (nome) => {
  let filename = FileSystem.documentDirectory + nome;
  const fileInfo = await FileSystem.getInfoAsync(filename);

  if (fileInfo.exists) {
    file = await FileSystem.readAsStringAsync(filename, { encoding: FileSystem.EncodingType.UTF8 });
    return file;
  } else {
    return "";
  }
};

db.getDadosArquivo = async function (arquivo) {
  let filename = FileSystem.documentDirectory + arquivo;
  const fileInfo = await FileSystem.getInfoAsync(filename);
  let dados = [];

  if (fileInfo.exists) {
    file = await FileSystem.readAsStringAsync(filename, { encoding: FileSystem.EncodingType.UTF8 });
    dados = JSON.parse(file);
  }

  return dados;
};

db.getListaLogs = async function () {
  var lista_logs = [];

  for (let index = 0; index < 31; index++) {
    var arquivo = moment().subtract(index, "days").format("YY_MM_DD") + ".txt";
    var fdata = moment().subtract(index, "days").format("DD/MM/YYYY");

    let filename = FileSystem.documentDirectory + arquivo;
    const fileInfo = await FileSystem.getInfoAsync(filename);

    if (fileInfo.exists) {
      lista_logs.push({ name: fdata, descricao: fdata, dados: [], key: index, ARQUIVO: arquivo, DATA: fdata });
    }
  }

  return lista_logs;
};

db.logAdd = async function (log) {
  var nome = moment().format("YY_MM_DD") + ".txt";

  console.log(log);

  if (db.LISTA_LOG.length == 0) {
    var conteudo = await loadFile(nome);
    if (conteudo != "") {
      db.LISTA_LOG = JSON.parse(conteudo);
    }
  }

  if (typeof log == "object") {
    try {
      const valor = JSON.stringify(mensagem);
      db.logAdd(valor);
    } catch (error1) {
      try {
        db.logAdd(mensagem.toString());
      } catch (error2) {}
    }
  }

  db.LISTA_LOG.push({
    ID: db.LISTA_LOG.length + 1,
    DATA: moment().format("DD/MM/YY HH:mm"),
    LOG: log,
  });

  var txt = JSON.stringify(db.LISTA_LOG);
  await saveFile(nome, txt);
};

const makeid = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

async function abirDB() {
  let bkp_db = Object.assign({}, db);
  db = await SQLite.openDatabase("NewLookApp.db", "1.0.0", "banco do Gestão Salão", 1024, async function (tdb) {});

  db.LISTA_LOG = bkp_db.LISTA_LOG;
  console.log("Fim abrir DB");
}

db.restoreFile = async function () {
  try {
    const paths = await DocumentPicker.getDocumentAsync({
      type: "application/octet-stream",
    });

    console.log(paths);

    if (paths.type == "success" && typeof paths != "undefined" && typeof paths.name != "undefined") {
      let uri_db = paths.uri;

      await abirDB();

      try {
        console.log("bkp usuario");
        let usuario = await findUsers(1);
        console.log(usuario);
        db.closeAsync();

        let fbkp = uri_db;
        let aantigo = FileSystem.documentDirectory + "SQLite/NewLookApp.db";
        let abkp = FileSystem.documentDirectory + "SQLite/NewLookApp_bkp_" + makeid(5) + ".db";

        console.log(fbkp);
        console.log(aantigo);
        console.log(abkp);

        console.log("Copiando arquivo antigo");

        await FileSystem.moveAsync({
          from: aantigo,
          to: abkp,
        }).then(async () => {
          console.log("Copiando arquivo novo");

          await FileSystem.copyAsync({
            from: fbkp,
            to: aantigo,
          }).then(async () => {
            console.log("Restaurar Usuario (Menus All 1)");
            await abirDB();

            usuario.LAST_SYNC = moment().format("YYYY-MM-DD HH:mm:ss");
            updateInfoUserAll(1, usuario).catch((err) => console.log(err));

            Alert.alert("Restauração", "Feche o aplicativo e em seguida abra novamente para aplicar as alterações.");
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return db;
};

db.restoreFile2 = async function (url, tamanhodowload, setTituloProgresso, setStatusProgresso, restoreUser) {
  try {
    console.log("URL File:" + url);

    let file1 = FileSystem.documentDirectory + "SQLite/" + makeid(5) + ".db";
    const fileInfo1 = await FileSystem.getInfoAsync(file1);

    if (fileInfo1.exists) {
      await FileSystem.deleteAsync(file1);
    }

    let prog = 0;
    const downloadCallback = (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / tamanhodowload;
      setTituloProgresso("Download: " + formatNumber(progress * 100) + "%");
      setStatusProgresso(progress);
    };

    console.log("Dowload criando");
    const downloadResumable = FileSystem.createDownloadResumable(url, file1, {}, downloadCallback);

    console.log("Dowload iniciado");
    const { uri } = await downloadResumable.downloadAsync();

    if (typeof uri != "undefined" && uri != "") {
      let uri_db = uri;

      await abirDB();

      try {
        console.log("bkp usuario");
        let usuario = await findUsers(1);
        console.log(usuario);
        db.closeAsync();

        let fbkp = uri_db;
        let aantigo = FileSystem.documentDirectory + "SQLite/NewLookApp.db";
        let abkp = FileSystem.documentDirectory + "SQLite/NewLookApp_bkp_" + makeid(5) + ".db";

        const fileInfo2 = await FileSystem.getInfoAsync(abkp);

        if (fileInfo2.exists) {
          await FileSystem.deleteAsync(abkp);
        }

        console.log(fbkp);
        console.log(aantigo);
        console.log(abkp);

        console.log("Copiando arquivo antigo");
        setTituloProgresso("Copiando arquivo antigo");

        await FileSystem.moveAsync({
          from: aantigo,
          to: abkp,
        }).then(async () => {
          console.log("Copiando arquivo novo");
          setTituloProgresso("Copiando arquivo novo");

          await FileSystem.copyAsync({
            from: fbkp,
            to: aantigo,
          }).then(async () => {
            console.log("Restaurar Usuario (Menus All 2)");
            setTituloProgresso("Restaurar Usuario");
            await abirDB();

            try {
              api.defaults.headers.authorization = `Bearer ${usuario.ACCESS_TOKEN}`;
              const userResponse = await api.post(`/dados/ConfirmarDownload`, {
                DISPOSITIVO_ID: usuario.DISPOSITIVO_ID,
              });
            } catch (error) {
              console.log(error);
            }

            if (restoreUser == true) {
              usuario.LAST_SYNC = moment().format("YYYY-MM-DD HH:mm:ss");
              updateInfoUserAll(1, usuario).catch((err) => console.log(err));

              Alert.alert("Restauração", "Feche o aplicativo e em seguida abra novamente para aplicar as alterações.");
            }
          });
        });
      } catch (error) {
        console.log(error);
        Alert.alert("Download", "Erro ao fazer Download do arquivo.");
      }
    } else {
      console.log(uri);
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Download", "Erro ao fazer Download do arquivo.");
  }

  return db;
};

db.backupFile = async function () {
  try {
    let uri = FileSystem.documentDirectory + "SQLite/NewLookApp.db";
    console.log(uri);

    if (Platform.OS === "ios") {
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } else {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export default db;