"use strict";
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// サンプルデータ
let dlsiteRanking = [
  { id: 1, rank: 1, productName: "【ブルーアーカイブ】ユウカASMR～頑張るあなたのすぐそばに～", genre: "ASMR，癒し，バイノーラル/ダミヘ，萌え", price: 1320, rating: 4.93, circle: "Yostar", link: "https://www.dlsite.com/home/work/=/product_id/RJ403038.html" },
  { id: 2, rank: 2, productName: "【ブルーアーカイブ】ヒナASMR～甘えられる優しいひと時～", genre: "ASMR，癒し，バイノーラル/ダミヘ，萌え", price: 1320, rating: 4.94, circle: "Yostar", link: "https://www.dlsite.com/home/work/=/product_id/RJ01078257.html" },
  { id: 3, rank: 3, productName: "【ブルーアーカイブ】カヨコASMR～穏やかで温かい距離感～", genre: "ASMR，癒し，バイノーラル/ダミヘ，萌え", price: 1320, rating: 4.96, circle: "Yostar", link: "https://www.dlsite.com/home/work/=/product_id/RJ01144225.html" },
  { id: 4, rank: 4, productName: "【寝落ちASMR】悪魔娘が最高に癒すのでものすごく眠れる(耳かき・囁き・マッサージ・泡オイル)", genre: "ASMR，癒し，健全，バイノーラル/ダミヘ，萌え，耳かき，ささやき，Vtuber本人出演作品", price: 1430, rating: 4.92, circle: "周防パトラ", link: "https://www.dlsite.com/home/work/=/product_id/RJ299717.html" },
  { id: 5, rank: 5, productName: "【寝落ちASMR13時間】99.99%ぐ～っすり寝かせちゃう癒しの安眠屋さん。(極上耳かき・マッサージ・赤ちゃん綿棒・囁き)", genre: "ASMR，Vtuber，癒し，健全，バイノーラル/ダミヘ，萌え，耳かき，ささやき", price: 1430, rating: 4.92, circle: "周防パトラ", link: "https://www.dlsite.com/home/work/=/product_id/RJ329940.html" }
];

// 一覧表示
app.get("/dlsite", (req, res) => {
  res.render('dlsite_list', {data: dlsiteRanking});
});

// 新規登録フォーム
app.get("/dlsite/create", (req, res) => {
  res.render('dlsite_new');
});

// 詳細表示
app.get("/dlsite/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = dlsiteRanking.find(d => d.id === id);
  if (item) {
    res.render('dlsite_detail', {item: item});
  } else {
    res.status(404).send('作品が見つかりません');
  }
});

app.use(express.urlencoded({ extended: true }));

// 新規登録処理
app.post("/dlsite/create", (req, res) => {
  const newRank = parseInt(req.body.rank);
  const price = parseInt(req.body.price);
  const rating = parseFloat(req.body.rating);
  
  // バリデーション
  if (!newRank || newRank < 1) {
    return res.status(400).send('ランクは1以上の数値を入力してください');
  }
  if (!price || price < 0) {
    return res.status(400).send('価格は0以上の数値を入力してください');
  }
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).send('評価は1から5の範囲で入力してください');
  }
  if (!req.body.productName || !req.body.circle || !req.body.link) {
    return res.status(400).send('必須項目が入力されていません');
  }
  
  dlsiteRanking.forEach(item => {
    if (item.rank >= newRank) {
      item.rank += 1;
    }
  });
  
  // ID生成ルール: 現在の最大ID + 1
  const maxId = dlsiteRanking.length > 0 ? Math.max(...dlsiteRanking.map(item => item.id)) : 0;
  
  dlsiteRanking.push({ 
    id: maxId + 1,
    rank: newRank,
    productName: req.body.productName,
    genre: req.body.genre,
    price: price,
    rating: rating,
    circle: req.body.circle,
    link: req.body.link
  });
  
  dlsiteRanking.sort((a, b) => a.rank - b.rank);
  
  res.redirect('/dlsite');
});

// 編集フォーム
app.get("/dlsite/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = dlsiteRanking.find(d => d.id === id);
  if (item) {
    res.render('dlsite_edit', {item: item});
  } else {
    res.status(404).send('作品が見つかりません');
  }
});

// 編集処理
app.post("/dlsite/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = dlsiteRanking.findIndex(d => d.id === id);
  if (index !== -1) {
    const oldRank = dlsiteRanking[index].rank;
    const newRank = parseInt(req.body.rank);
    
    if (oldRank !== newRank) {
      dlsiteRanking.forEach(item => {
        if (item.id !== id) {
          if (newRank < oldRank && item.rank >= newRank && item.rank < oldRank) {
            item.rank += 1;
          } else if (newRank > oldRank && item.rank > oldRank && item.rank <= newRank) {
            item.rank -= 1;
          }
        }
      });
    }
    
    dlsiteRanking[index] = {
      id: id,
      rank: newRank,
      productName: req.body.productName,
      genre: req.body.genre,
      price: parseInt(req.body.price),
      rating: parseFloat(req.body.rating),
      circle: req.body.circle,
      link: req.body.link
    };
    
    dlsiteRanking.sort((a, b) => a.rank - b.rank);
  }
  res.redirect('/dlsite');
});

// 削除処理
app.post("/dlsite/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = dlsiteRanking.findIndex(d => d.id === id);
  if (index !== -1) {
    const deletedRank = dlsiteRanking[index].rank;
    dlsiteRanking.splice(index, 1);
    
    dlsiteRanking.forEach(item => {
      if (item.rank > deletedRank) {
        item.rank -= 1;
      }
    });
  }
  res.redirect('/dlsite');
});

app.listen(8082, () => console.log("DLsite Ranking site listening on port 8082!"));