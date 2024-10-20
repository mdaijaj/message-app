module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "aijaj123",
    DB: "messaging_app",
    dialect: "mysql",
    innodb_log_file_size: "512M",
    innodb_strict_mode: 1,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};