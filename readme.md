# Projeto de Sistemas Multimídia
Jogo feito no Phaser 3 e com banco de dados MySQL para armazenar as 10 últimas pontuações

## Configurações do banco

Tabela para os pontos:
```
create table PONTUACAO(
	pontos numeric
);
```

Configurações necessárias para o backend em connection.js:
```
const db = mysql.createConnection({
  host: "seu host",
  user: "seu user",
  password: "sua senha",
  database: "seu banco de dados",
});
```
