"use strict";
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// サンプルデータ
let fanzaRanking = [
  { id: 1, rank: 1, title: "1000年に一人の女子〇生から求愛を受けた担任教師は全てを捨て教え子との禁断性交に溺れた。", genre: "制服，美少女，女子校生，巨乳フェチ，アクメ・オーガズム", price: 1190, releaseDate: "2025-08-12", actress: "瀬戸環奈", link: "https://video.dmm.co.jp/av/content/?id=sone00811" },
  { id: 2, rank: 2, title: "絶頂の向こう側へ 最強ヒロインに巨根ピストンを", genre: "デカチン・巨根，淫乱・ハード系，潮吹き，巨乳，アクメ・オーガズム", price: 1190, releaseDate: "2025-09-09", actress: "瀬戸環奈", link: "https://video.dmm.co.jp/av/content/?id=sone00846" },
  { id: 3, rank: 3, title: "息子が通う保育園の美人先生と妻子が実家に帰省中に自宅密会をして1週間ヤリまくった絶倫不倫セックス", genre: "不倫，寝取り・寝取られ・NTR，中出し，ドラマ，巨乳", price: 985, releaseDate: "2024-10-10", actress: "MINAMO", link: "https://video.dmm.co.jp/av/content/?id=1start00148" },
  { id: 4, rank: 4, title: "最強ヒロインに会える風俗店", genre: "顔射，巨乳，パイズリ，アイドル・芸能人，キャバ嬢・風俗嬢", price: 1190, releaseDate: "2025-06-10", actress: "瀬戸環奈", link: "https://video.dmm.co.jp/av/content/?id=sone00720" },
  { id: 5, rank: 5, title: "観れば絶対中イキさせられる！ アナタもヌイて学べる 石原希望と一緒に！How to SEX！ 「中イキできたら中出し」編", genre: "中出し，制服，3P・4P，巨乳，How To", price: 590, releaseDate: "2024-05-21", actress: "石原希望", link: "https://video.dmm.co.jp/av/content/?id=midv00725" }
];

// 一覧表示
app.get("/fanza", (req, res) => {
  res.render('fanza_list', {data: fanzaRanking});
});

// 新規登録フォーム
app.get("/fanza/create", (req, res) => {
  res.render('fanza_new');
});

// 詳細表示
app.get("/fanza/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = fanzaRanking.find(f => f.id === id);
  if (item) {
    res.render('fanza_detail', {item: item});
  } else {
    res.status(404).send('動画が見つかりません');
  }
});

app.use(express.urlencoded({ extended: true }));

// 新規登録処理
app.post("/fanza/create", (req, res) => {
  const newRank = parseInt(req.body.rank);
  const price = parseInt(req.body.price);
  
  // バリデーション
  if (!newRank || newRank < 1) {
    return res.status(400).send('ランクは1以上の数値を入力してください');
  }
  if (!price || price < 0) {
    return res.status(400).send('価格は0以上の数値を入力してください');
  }
  if (!req.body.title || !req.body.actress || !req.body.link) {
    return res.status(400).send('必須項目が入力されていません');
  }
  
  fanzaRanking.forEach(item => {
    if (item.rank >= newRank) {
      item.rank += 1;
    }
  });
  
  // ID生成ルール: 現在の最大ID + 1
  const maxId = fanzaRanking.length > 0 ? Math.max(...fanzaRanking.map(item => item.id)) : 0;
  
  fanzaRanking.push({ 
    id: maxId + 1,
    rank: newRank,
    title: req.body.title,
    genre: req.body.genre,
    price: price,
    releaseDate: req.body.releaseDate,
    actress: req.body.actress,
    link: req.body.link
  });
  
  fanzaRanking.sort((a, b) => a.rank - b.rank);
  
  res.redirect('/fanza');
});

// 編集フォーム
app.get("/fanza/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = fanzaRanking.find(f => f.id === id);
  if (item) {
    res.render('fanza_edit', {item: item});
  } else {
    res.status(404).send('動画が見つかりません');
  }
});

// 編集処理
app.post("/fanza/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = fanzaRanking.findIndex(f => f.id === id);
  if (index !== -1) {
    const oldRank = fanzaRanking[index].rank;
    const newRank = parseInt(req.body.rank);
    
    if (oldRank !== newRank) {
      fanzaRanking.forEach(item => {
        if (item.id !== id) {
          if (newRank < oldRank && item.rank >= newRank && item.rank < oldRank) {
            item.rank += 1;
          } else if (newRank > oldRank && item.rank > oldRank && item.rank <= newRank) {
            item.rank -= 1;
          }
        }
      });
    }
    
    fanzaRanking[index] = {
      id: id,
      rank: newRank,
      title: req.body.title,
      genre: req.body.genre,
      price: parseInt(req.body.price),
      releaseDate: req.body.releaseDate,
      actress: req.body.actress,
      link: req.body.link
    };
    
    fanzaRanking.sort((a, b) => a.rank - b.rank);
  }
  res.redirect('/fanza');
});

// 削除処理
app.post("/fanza/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = fanzaRanking.findIndex(f => f.id === id);
  if (index !== -1) {
    const deletedRank = fanzaRanking[index].rank;
    fanzaRanking.splice(index, 1);
    
    fanzaRanking.forEach(item => {
      if (item.rank > deletedRank) {
        item.rank -= 1;
      }
    });
  }
  res.redirect('/fanza');
});

app.listen(8081, () => console.log("FANZA Video Ranking site listening on port 8081!"));