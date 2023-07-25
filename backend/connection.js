import express from "express";
import mysql from "mysql";
import cors from "cors";

//===============================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ifb2023",
  database: "database02",
});
//======================================
const app = express();
app.use(express.json());
app.use(cors());
//========================================

app.get("/ranking", (req, res) => {
  const q = "SELECT * FROM PONTUACAO";

  db.query(q, (err, data) => {
    if (err) return console.log(err);
    console.log(data);
    return res.json(data);
  });
});

app.post("/ranking/:points", (req, res) => {
  const q = "INSERT INTO PONTUACAO(`pontos`) VALUES (?)";
  const points = req.params.points;

  db.query(q, points, (err, data) => {
    if (err) return console.log(err);
    return console.log(`Adicionada a nova pontuação ${points} do jogador`);
  });
});

// inicialização básica
app.get("/", (req, res) => {
  res.send("REST API Game");
});

app.listen(8800, () => console.log("server REST API GAME started"));
