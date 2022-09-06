export default {
  db: {
    user: "数据库用户名",
    pass: "数据库密码",
    host: "数据库地址ip",
    port: "数据库端口",
    database: "数据库名称",
    authSource: null,
  },
  host: {
    url: "配置地址，邮件中携带的链接",
    port: "端口",
  },
  jwt: {
    secretOrKey: "token加密密钥",
    expiresIn: 36000000,
  },
  mail: {
    host: "邮件服务其地址",
    port: "邮件端口",
    secure: true, // 是否开启安全认证
    user: "发送邮件的邮箱",
    pass: "邮箱密码", // 注意不是登录密码，具体需要到邮箱官网里面去设置，可以百度一下nojs发送邮件
  },
  minio: {
    endPoint: "域名",
    port: 9000, // 端口
    useSSL: true,
    rootUser: "用户名",
    rootPassword: "密码",
  },
};
