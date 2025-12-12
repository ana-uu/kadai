const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// サンプルデータ
let fanzaRanking = [
  { id: 1, rank: 1, title: "人気作品A", genre: "アニメ", price: 1980, releaseDate: "2024-01-15" },
  { id: 2, rank: 2, title: "人気作品B", genre: "実写", price: 2480, releaseDate: "2024-02-01" },
  { id: 3, rank: 3, title: "人気作品C", genre: "アニメ", price: 1580, releaseDate: "2024-01-20" },
  { id: 4, rank: 4, title: "人気作品D", genre: "CG", price: 2980, releaseDate: "2024-03-10" },
  { id: 5, rank: 5, title: "人気作品E", genre: "実写", price: 1780, releaseDate: "2024-02-15" }
];

// 一覧表示
app.get("/", (req, res) => {
  res.render('fanza_list', {data: fanzaRanking});
});

// 詳細表示
app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = fanzaRanking.find(f => f.id === id);
  if (item) {
    res.render('fanza_detail', {item: item});
  } else {
    res.status(404).send('商品が見つかりません');
  }
});

// 新規登録フォーム
app.get("/create", (req, res) => {
  res.sendFile(__dirname + '/views/fanza_new.html');
});

app.use(express.urlencoded({ extended: true }));

// 新規登録処理
app.post("/create", (req, res) => {
  const id = fanzaRanking.length + 1;
  const rank = parseInt(req.body.rank);
  const title = req.body.title;
  const genre = req.body.genre;
  const price = parseInt(req.body.price);
  const releaseDate = req.body.releaseDate;
  
  fanzaRanking.push({ 
    id: id, 
    rank: rank, 
    title: title, 
    genre: genre, 
    price: price, 
    releaseDate: releaseDate 
  });
  
  res.redirect('/');
});

app.listen(8081, () => console.log("FANZA Ranking site listening on port 8081!"));