const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// cola aqui a connection string do Neon
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_lsAjznoRk30N@ep-dawn-bird-anrtle68-pooler.c-6.us-east-1.aws.neon.tech/Banco%20Finix?sslmode=require&channel_binding=require"
});