const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// サンプルデータ
let melonbooksRanking = [
  { id: 1, rank: 1, bookName: "to LILITH", author: "nipi", circle: "虎と少女", genre: "Fate/Grand Order", price: 1571, link: "https://www.melonbooks.co.jp/detail/detail.php?product_id=3403134" },
  { id: 2, rank: 2, bookName: "この恋に気づいてくれた", author: "だにまる", circle: "だにまるstudio", genre: "オリジナル", price: 891, link: "https://www.melonbooks.co.jp/detail/detail.php?product_id=3408983&adult_view=1&nrdp=1" },
  { id: 3, rank: 3, bookName: "意外の初体験～絶頂我慢トレーニング編～", author: "ChickeIII", circle: "壞茸社", genre: "五等分の花嫁", price: 550, link: "https://www.melonbooks.co.jp/detail/detail.php?product_id=3409426" },
  { id: 4, rank: 4, bookName: "Fate/GOMEMO10", author: "ワダアルコ", circle: "wadamemo", genre: "	Fate/Grand Order", price: 785, link: "https://www.melonbooks.co.jp/detail/detail.php?product_id=3309924" },
  { id: 5, rank: 5, bookName: "Vanishing Reality4 ～背徳に染まる星～", author: "左藤空気", circle: "Vパン'sエクスタシー", genre: "オリジナル", price: 880, link: "https://www.melonbooks.co.jp/detail/detail.php?product_id=3405182" }
];

// 一覧表示
app.get("/", (req, res) => {
  res.render('melonbooks_list', {data: melonbooksRanking});
});

// 新規登録フォーム
app.get("/create", (req, res) => {
  res.sendFile(__dirname + '/views/melonbooks_new.html');
});

// 詳細表示
app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = melonbooksRanking.find(m => m.id === id);
  if (item) {
    res.render('melonbooks_detail', {item: item});
  } else {
    res.status(404).send('書籍が見つかりません');
  }
});

app.use(express.urlencoded({ extended: true }));

// 新規登録処理
app.post("/create", (req, res) => {
  const newRank = parseInt(req.body.rank);
  
  // 既存のrankを繰り上げ
  melonbooksRanking.forEach(item => {
    if (item.rank >= newRank) {
      item.rank += 1;
    }
  });
  
  // 新しいデータを追加
  melonbooksRanking.push({ 
    id: melonbooksRanking.length + 1,
    rank: newRank,
    bookName: req.body.bookName,
    author: req.body.author,
    circle: req.body.circle,
    genre: req.body.genre,
    price: parseInt(req.body.price),
    link: req.body.link
  });
  
  // rank順にソート
  melonbooksRanking.sort((a, b) => a.rank - b.rank);
  
  res.redirect('/');
});

// 編集フォーム
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = melonbooksRanking.find(m => m.id === id);
  if (item) {
    res.render('melonbooks_edit', {item: item});
  } else {
    res.status(404).send('書籍が見つかりません');
  }
});

// 編集処理
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = melonbooksRanking.findIndex(m => m.id === id);
  if (index !== -1) {
    const oldRank = melonbooksRanking[index].rank;
    const newRank = parseInt(req.body.rank);
    
    // rankが変わった場合、他のrankを調整
    if (oldRank !== newRank) {
      melonbooksRanking.forEach(item => {
        if (item.id !== id) {
          if (newRank < oldRank && item.rank >= newRank && item.rank < oldRank) {
            item.rank += 1;
          } else if (newRank > oldRank && item.rank > oldRank && item.rank <= newRank) {
            item.rank -= 1;
          }
        }
      });
    }
    
    melonbooksRanking[index] = {
      id: id,
      rank: newRank,
      bookName: req.body.bookName,
      author: req.body.author,
      circle: req.body.circle,
      genre: req.body.genre,
      price: parseInt(req.body.price),
      link: req.body.link
    };
    
    melonbooksRanking.sort((a, b) => a.rank - b.rank);
  }
  res.redirect('/');
});

// 削除処理
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = melonbooksRanking.findIndex(m => m.id === id);
  if (index !== -1) {
    const deletedRank = melonbooksRanking[index].rank;
    melonbooksRanking.splice(index, 1);
    
    // 削除したrankより大きいrankを繰り下げ
    melonbooksRanking.forEach(item => {
      if (item.rank > deletedRank) {
        item.rank -= 1;
      }
    });
  }
  res.redirect('/');
});

app.listen(8083, () => console.log("Melonbooks Ranking site listening on port 8083!"));