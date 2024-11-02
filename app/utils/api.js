import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  timeout: 30000,
  params: {},
});

api.interceptors.request.use(
  async (config) => {
    var server = await AsyncStorage.getItem("@NewLookApp:server");

    if (server + "" != "null") {
      server = server + "/api/user";
      //server = server.replace('/api/user/api/user','/api/user');
      //server = server.replace('//','/');

      server = server.replace("://", "#@#");
      server = server.replace("//", "/");

      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("\\", "/");
      server = server.replace("#@#", "://");
    } else {
      server = "";
    }

    //console.log(server);

    config.baseURL = server;
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

export default api;