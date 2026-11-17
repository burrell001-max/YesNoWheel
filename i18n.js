/* YesNoWheel - translations (10 languages). Missing keys fall back to English. */
(function (global) {
  'use strict';

  var LANGS = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文（简体）' },
    { code: 'ar', name: 'العربية', rtl: true }
  ];

  var T = {
    en: {
      title: 'Yes or No Wheel - Random Decision & Custom Picker Wheel | YesNoWheel',
      desc: 'Spin the Yes or No wheel for a random decision, or build a custom picker wheel with your own names, weights and images. Free, no sign-up, works offline in 10 languages.',
      yesnoMode: 'Yes/No Wheel', customMode: 'Custom Wheel', settings: 'Settings', fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', language: 'Language', wheelTitlePh: 'Wheel title',
      spin: 'SPIN', yes: 'Yes', no: 'No', maybe: 'Maybe', opt2: 'Yes / No', opt3: 'Yes / No / Maybe', sets: 'Number of sets', tally: 'Scoreboard', resetTally: 'Reset scoreboard',
      listView: 'List', textView: 'Text', addEntry: 'Add entry', entryPh: 'Enter an option', textPh: 'One entry per line.\nUse "weight, text" to set a weight, e.g. 3, Pizza', search: 'Search entries', shuffle: 'Shuffle', sortAZ: 'Sort A–Z', delEmpty: 'Delete empty', clearAll: 'Clear all', importFile: 'Import CSV/TXT', exportCSV: 'Export CSV', exportJSON: 'Export JSON', restoreHidden: 'Restore hidden',
      mysteryWheel: 'Mystery wheel', mysteryResult: 'Mystery result', weight: 'Weight', toggleVisible: 'Show / hide', duplicate: 'Duplicate', remove: 'Delete', imageUrl: 'Image URL', uploadImage: 'Upload image', color: 'Slice color', reorder: 'Drag to reorder',
      tabInputs: 'Inputs', tabResults: 'Results', history: 'History', leaderboard: 'Leaderboard', noResults: 'No spins yet', clearHistory: 'Clear history',
      actionMode: 'After each spin', normal: 'Normal', elimination: 'Elimination', accumulation: 'Accumulation',
      done: 'Done', hideChoice: 'Hide choice', hideAll: 'Hide all matching', tapReveal: 'Tap to reveal', winnerIs: 'The winner is', wins: 'wins',
      setSpin: 'Spin behavior', duration: 'Spin duration', speed: 'Spin speed', idle: 'Slow idle rotation', setEffects: 'Sound & effects', tick: 'Tick sound', victory: 'Victory sound', confetti: 'Confetti', dark: 'Dark theme', setStyle: 'Wheel & page style', palette: 'Color palette', vibrant: 'Vibrant', pastel: 'Pastel', neon: 'Neon', mono: 'Monochrome', custom: 'Custom', pageBg: 'Page background', resetColor: 'Reset', centerText: 'Center button text', centerColor: 'Center button color', wheelTitle: 'Wheel title', wheelDesc: 'Wheel description', descPh: 'Optional description',
      share: 'Share & embed', copyLink: 'Copy share link', copyEmbed: 'Copy embed code', copied: 'Copied!', close: 'Close', minEntries: 'Add at least 2 visible entries to spin.', resetAll: 'Reset everything', confirmSure: 'Are you sure?', shortcuts: 'Space / Enter: spin · Esc: close', importFail: 'Could not read that file.'
    },
    es: {
      title: 'Ruleta Sí o No - Rueda de Decisiones y Sorteos Aleatorios | YesNoWheel',
      desc: 'Gira la ruleta de Sí o No para tomar una decisión al azar, o crea una rueda personalizada con tus nombres, pesos e imágenes. Gratis, sin registro, funciona sin conexión en 10 idiomas.',
      yesnoMode: 'Ruleta Sí/No', customMode: 'Ruleta personalizada', settings: 'Ajustes', fullscreen: 'Pantalla completa', exitFullscreen: 'Salir de pantalla completa', language: 'Idioma', wheelTitlePh: 'Título de la ruleta',
      spin: 'GIRAR', yes: 'Sí', no: 'No', maybe: 'Quizás', opt2: 'Sí / No', opt3: 'Sí / No / Quizás', sets: 'Número de series', tally: 'Marcador', resetTally: 'Reiniciar marcador',
      listView: 'Lista', textView: 'Texto', addEntry: 'Añadir opción', entryPh: 'Escribe una opción', textPh: 'Una opción por línea.\nUsa "peso, texto" para asignar un peso, p. ej. 3, Pizza', search: 'Buscar opciones', shuffle: 'Mezclar', sortAZ: 'Ordenar A–Z', delEmpty: 'Borrar vacías', clearAll: 'Borrar todo', importFile: 'Importar CSV/TXT', exportCSV: 'Exportar CSV', exportJSON: 'Exportar JSON', restoreHidden: 'Restaurar ocultas',
      mysteryWheel: 'Rueda misteriosa', mysteryResult: 'Resultado misterioso', weight: 'Peso', toggleVisible: 'Mostrar / ocultar', duplicate: 'Duplicar', remove: 'Eliminar', imageUrl: 'URL de imagen', uploadImage: 'Subir imagen', color: 'Color del sector', reorder: 'Arrastra para reordenar',
      tabInputs: 'Opciones', tabResults: 'Resultados', history: 'Historial', leaderboard: 'Clasificación', noResults: 'Aún no hay giros', clearHistory: 'Borrar historial',
      actionMode: 'Después de cada giro', normal: 'Normal', elimination: 'Eliminación', accumulation: 'Acumulación',
      done: 'Hecho', hideChoice: 'Ocultar opción', hideAll: 'Ocultar todas las iguales', tapReveal: 'Toca para revelar', winnerIs: 'El ganador es', wins: 'victorias',
      setSpin: 'Comportamiento del giro', duration: 'Duración del giro', speed: 'Velocidad del giro', idle: 'Rotación lenta en reposo', setEffects: 'Sonido y efectos', tick: 'Sonido de tic', victory: 'Sonido de victoria', confetti: 'Confeti', dark: 'Tema oscuro', setStyle: 'Estilo de rueda y página', palette: 'Paleta de colores', vibrant: 'Vibrante', pastel: 'Pastel', neon: 'Neón', mono: 'Monocromo', custom: 'Personalizada', pageBg: 'Fondo de la página', resetColor: 'Restablecer', centerText: 'Texto del botón central', centerColor: 'Color del botón central', wheelTitle: 'Título de la rueda', wheelDesc: 'Descripción de la rueda', descPh: 'Descripción opcional',
      share: 'Compartir e incrustar', copyLink: 'Copiar enlace', copyEmbed: 'Copiar código para incrustar', copied: '¡Copiado!', close: 'Cerrar', minEntries: 'Añade al menos 2 opciones visibles para girar.', resetAll: 'Restablecer todo', confirmSure: '¿Seguro?', shortcuts: 'Espacio / Intro: girar · Esc: cerrar', importFail: 'No se pudo leer el archivo.'
    },
    fr: {
      title: 'Roue Oui ou Non - Roue de Décision et Tirage au Sort | YesNoWheel',
      desc: 'Faites tourner la roue Oui ou Non pour décider au hasard, ou créez une roue personnalisée avec vos noms, poids et images. Gratuit, sans inscription, fonctionne hors ligne en 10 langues.',
      yesnoMode: 'Roue Oui/Non', customMode: 'Roue personnalisée', settings: 'Paramètres', fullscreen: 'Plein écran', exitFullscreen: 'Quitter le plein écran', language: 'Langue', wheelTitlePh: 'Titre de la roue',
      spin: 'TOURNER', yes: 'Oui', no: 'Non', maybe: 'Peut-être', opt2: 'Oui / Non', opt3: 'Oui / Non / Peut-être', sets: 'Nombre de séries', tally: 'Tableau des scores', resetTally: 'Réinitialiser les scores',
      listView: 'Liste', textView: 'Texte', addEntry: 'Ajouter une option', entryPh: 'Saisissez une option', textPh: 'Une option par ligne.\nUtilisez « poids, texte » pour définir un poids, ex. 3, Pizza', search: 'Rechercher', shuffle: 'Mélanger', sortAZ: 'Trier A–Z', delEmpty: 'Supprimer les vides', clearAll: 'Tout effacer', importFile: 'Importer CSV/TXT', exportCSV: 'Exporter en CSV', exportJSON: 'Exporter en JSON', restoreHidden: 'Restaurer les masquées',
      mysteryWheel: 'Roue mystère', mysteryResult: 'Résultat mystère', weight: 'Poids', toggleVisible: 'Afficher / masquer', duplicate: 'Dupliquer', remove: 'Supprimer', imageUrl: "URL de l'image", uploadImage: 'Téléverser une image', color: 'Couleur de la part', reorder: 'Glisser pour réorganiser',
      tabInputs: 'Options', tabResults: 'Résultats', history: 'Historique', leaderboard: 'Classement', noResults: 'Aucun tirage pour l’instant', clearHistory: "Effacer l'historique",
      actionMode: 'Après chaque tirage', normal: 'Normal', elimination: 'Élimination', accumulation: 'Cumul',
      done: 'Terminé', hideChoice: "Masquer l'option", hideAll: 'Masquer toutes les identiques', tapReveal: 'Touchez pour révéler', winnerIs: 'Le gagnant est', wins: 'victoires',
      setSpin: 'Comportement du tour', duration: 'Durée du tour', speed: 'Vitesse du tour', idle: 'Rotation lente au repos', setEffects: 'Son et effets', tick: 'Son de cliquetis', victory: 'Son de victoire', confetti: 'Confettis', dark: 'Thème sombre', setStyle: 'Style de la roue et de la page', palette: 'Palette de couleurs', vibrant: 'Vive', pastel: 'Pastel', neon: 'Néon', mono: 'Monochrome', custom: 'Personnalisée', pageBg: 'Arrière-plan de la page', resetColor: 'Réinitialiser', centerText: 'Texte du bouton central', centerColor: 'Couleur du bouton central', wheelTitle: 'Titre de la roue', wheelDesc: 'Description de la roue', descPh: 'Description facultative',
      share: 'Partager et intégrer', copyLink: 'Copier le lien', copyEmbed: "Copier le code d'intégration", copied: 'Copié !', close: 'Fermer', minEntries: 'Ajoutez au moins 2 options visibles pour tourner.', resetAll: 'Tout réinitialiser', confirmSure: 'Êtes-vous sûr ?', shortcuts: 'Espace / Entrée : tourner · Échap : fermer', importFail: 'Impossible de lire ce fichier.'
    },
    de: {
      title: 'Ja oder Nein Rad - Zufallsrad & Entscheidungsrad | YesNoWheel',
      desc: 'Drehe das Ja-oder-Nein-Rad für eine zufällige Entscheidung oder erstelle ein eigenes Glücksrad mit Namen, Gewichtungen und Bildern. Kostenlos, ohne Anmeldung, offline nutzbar in 10 Sprachen.',
      yesnoMode: 'Ja/Nein-Rad', customMode: 'Eigenes Rad', settings: 'Einstellungen', fullscreen: 'Vollbild', exitFullscreen: 'Vollbild beenden', language: 'Sprache', wheelTitlePh: 'Titel des Rads',
      spin: 'DREHEN', yes: 'Ja', no: 'Nein', maybe: 'Vielleicht', opt2: 'Ja / Nein', opt3: 'Ja / Nein / Vielleicht', sets: 'Anzahl der Sätze', tally: 'Anzeigetafel', resetTally: 'Anzeigetafel zurücksetzen',
      listView: 'Liste', textView: 'Text', addEntry: 'Eintrag hinzufügen', entryPh: 'Option eingeben', textPh: 'Ein Eintrag pro Zeile.\nMit „Gewicht, Text“ legst du eine Gewichtung fest, z. B. 3, Pizza', search: 'Einträge suchen', shuffle: 'Mischen', sortAZ: 'A–Z sortieren', delEmpty: 'Leere löschen', clearAll: 'Alle löschen', importFile: 'CSV/TXT importieren', exportCSV: 'Als CSV exportieren', exportJSON: 'Als JSON exportieren', restoreHidden: 'Ausgeblendete wiederherstellen',
      mysteryWheel: 'Mystery-Rad', mysteryResult: 'Mystery-Ergebnis', weight: 'Gewicht', toggleVisible: 'Ein- / ausblenden', duplicate: 'Duplizieren', remove: 'Löschen', imageUrl: 'Bild-URL', uploadImage: 'Bild hochladen', color: 'Segmentfarbe', reorder: 'Zum Umsortieren ziehen',
      tabInputs: 'Eingaben', tabResults: 'Ergebnisse', history: 'Verlauf', leaderboard: 'Rangliste', noResults: 'Noch keine Drehungen', clearHistory: 'Verlauf löschen',
      actionMode: 'Nach jeder Drehung', normal: 'Normal', elimination: 'Ausscheiden', accumulation: 'Zählen',
      done: 'Fertig', hideChoice: 'Auswahl ausblenden', hideAll: 'Alle gleichen ausblenden', tapReveal: 'Zum Aufdecken tippen', winnerIs: 'Der Gewinner ist', wins: 'Siege',
      setSpin: 'Drehverhalten', duration: 'Drehdauer', speed: 'Drehgeschwindigkeit', idle: 'Langsame Leerlaufdrehung', setEffects: 'Ton & Effekte', tick: 'Tickgeräusch', victory: 'Siegesklang', confetti: 'Konfetti', dark: 'Dunkles Design', setStyle: 'Rad- & Seitenstil', palette: 'Farbpalette', vibrant: 'Lebhaft', pastel: 'Pastell', neon: 'Neon', mono: 'Monochrom', custom: 'Eigene', pageBg: 'Seitenhintergrund', resetColor: 'Zurücksetzen', centerText: 'Text der Mitteltaste', centerColor: 'Farbe der Mitteltaste', wheelTitle: 'Titel des Rads', wheelDesc: 'Beschreibung des Rads', descPh: 'Optionale Beschreibung',
      share: 'Teilen & einbetten', copyLink: 'Link kopieren', copyEmbed: 'Einbettungscode kopieren', copied: 'Kopiert!', close: 'Schließen', minEntries: 'Füge mindestens 2 sichtbare Einträge hinzu, um zu drehen.', resetAll: 'Alles zurücksetzen', confirmSure: 'Bist du sicher?', shortcuts: 'Leertaste / Enter: drehen · Esc: schließen', importFail: 'Die Datei konnte nicht gelesen werden.'
    },
    pt: {
      title: 'Roleta Sim ou Não - Roda da Sorte e Decisões Aleatórias | YesNoWheel',
      desc: 'Gire a roleta Sim ou Não para tomar uma decisão aleatória, ou crie uma roda personalizada com seus nomes, pesos e imagens. Grátis, sem cadastro, funciona offline em 10 idiomas.',
      yesnoMode: 'Roleta Sim/Não', customMode: 'Roda personalizada', settings: 'Configurações', fullscreen: 'Tela cheia', exitFullscreen: 'Sair da tela cheia', language: 'Idioma', wheelTitlePh: 'Título da roda',
      spin: 'GIRAR', yes: 'Sim', no: 'Não', maybe: 'Talvez', opt2: 'Sim / Não', opt3: 'Sim / Não / Talvez', sets: 'Número de conjuntos', tally: 'Placar', resetTally: 'Zerar placar',
      listView: 'Lista', textView: 'Texto', addEntry: 'Adicionar opção', entryPh: 'Digite uma opção', textPh: 'Uma opção por linha.\nUse "peso, texto" para definir um peso, ex.: 3, Pizza', search: 'Buscar opções', shuffle: 'Embaralhar', sortAZ: 'Ordenar A–Z', delEmpty: 'Excluir vazias', clearAll: 'Limpar tudo', importFile: 'Importar CSV/TXT', exportCSV: 'Exportar CSV', exportJSON: 'Exportar JSON', restoreHidden: 'Restaurar ocultas',
      mysteryWheel: 'Roda misteriosa', mysteryResult: 'Resultado misterioso', weight: 'Peso', toggleVisible: 'Mostrar / ocultar', duplicate: 'Duplicar', remove: 'Excluir', imageUrl: 'URL da imagem', uploadImage: 'Enviar imagem', color: 'Cor da fatia', reorder: 'Arraste para reordenar',
      tabInputs: 'Opções', tabResults: 'Resultados', history: 'Histórico', leaderboard: 'Classificação', noResults: 'Nenhum giro ainda', clearHistory: 'Limpar histórico',
      actionMode: 'Após cada giro', normal: 'Normal', elimination: 'Eliminação', accumulation: 'Acúmulo',
      done: 'Concluir', hideChoice: 'Ocultar opção', hideAll: 'Ocultar todas iguais', tapReveal: 'Toque para revelar', winnerIs: 'O vencedor é', wins: 'vitórias',
      setSpin: 'Comportamento do giro', duration: 'Duração do giro', speed: 'Velocidade do giro', idle: 'Rotação lenta em repouso', setEffects: 'Som e efeitos', tick: 'Som de tique', victory: 'Som de vitória', confetti: 'Confete', dark: 'Tema escuro', setStyle: 'Estilo da roda e da página', palette: 'Paleta de cores', vibrant: 'Vibrante', pastel: 'Pastel', neon: 'Neon', mono: 'Monocromática', custom: 'Personalizada', pageBg: 'Fundo da página', resetColor: 'Redefinir', centerText: 'Texto do botão central', centerColor: 'Cor do botão central', wheelTitle: 'Título da roda', wheelDesc: 'Descrição da roda', descPh: 'Descrição opcional',
      share: 'Compartilhar e incorporar', copyLink: 'Copiar link', copyEmbed: 'Copiar código de incorporação', copied: 'Copiado!', close: 'Fechar', minEntries: 'Adicione pelo menos 2 opções visíveis para girar.', resetAll: 'Redefinir tudo', confirmSure: 'Tem certeza?', shortcuts: 'Espaço / Enter: girar · Esc: fechar', importFail: 'Não foi possível ler o arquivo.'
    },
    it: {
      title: 'Ruota Sì o No - Ruota delle Decisioni e Sorteggi Casuali | YesNoWheel',
      desc: 'Gira la ruota Sì o No per una decisione casuale, oppure crea una ruota personalizzata con nomi, pesi e immagini. Gratis, senza registrazione, funziona offline in 10 lingue.',
      yesnoMode: 'Ruota Sì/No', customMode: 'Ruota personalizzata', settings: 'Impostazioni', fullscreen: 'Schermo intero', exitFullscreen: 'Esci da schermo intero', language: 'Lingua', wheelTitlePh: 'Titolo della ruota',
      spin: 'GIRA', yes: 'Sì', no: 'No', maybe: 'Forse', opt2: 'Sì / No', opt3: 'Sì / No / Forse', sets: 'Numero di serie', tally: 'Tabellone', resetTally: 'Azzera tabellone',
      listView: 'Elenco', textView: 'Testo', addEntry: 'Aggiungi voce', entryPh: 'Inserisci un’opzione', textPh: 'Una voce per riga.\nUsa "peso, testo" per impostare un peso, es. 3, Pizza', search: 'Cerca voci', shuffle: 'Mescola', sortAZ: 'Ordina A–Z', delEmpty: 'Elimina vuote', clearAll: 'Cancella tutto', importFile: 'Importa CSV/TXT', exportCSV: 'Esporta CSV', exportJSON: 'Esporta JSON', restoreHidden: 'Ripristina nascoste',
      mysteryWheel: 'Ruota misteriosa', mysteryResult: 'Risultato misterioso', weight: 'Peso', toggleVisible: 'Mostra / nascondi', duplicate: 'Duplica', remove: 'Elimina', imageUrl: 'URL immagine', uploadImage: 'Carica immagine', color: 'Colore dello spicchio', reorder: 'Trascina per riordinare',
      tabInputs: 'Voci', tabResults: 'Risultati', history: 'Cronologia', leaderboard: 'Classifica', noResults: 'Ancora nessun giro', clearHistory: 'Cancella cronologia',
      actionMode: 'Dopo ogni giro', normal: 'Normale', elimination: 'Eliminazione', accumulation: 'Accumulo',
      done: 'Fatto', hideChoice: 'Nascondi scelta', hideAll: 'Nascondi tutte le uguali', tapReveal: 'Tocca per rivelare', winnerIs: 'Il vincitore è', wins: 'vittorie',
      setSpin: 'Comportamento del giro', duration: 'Durata del giro', speed: 'Velocità del giro', idle: 'Rotazione lenta a riposo', setEffects: 'Suoni ed effetti', tick: 'Suono del tic', victory: 'Suono della vittoria', confetti: 'Coriandoli', dark: 'Tema scuro', setStyle: 'Stile di ruota e pagina', palette: 'Tavolozza colori', vibrant: 'Vivace', pastel: 'Pastello', neon: 'Neon', mono: 'Monocromatica', custom: 'Personalizzata', pageBg: 'Sfondo della pagina', resetColor: 'Ripristina', centerText: 'Testo del pulsante centrale', centerColor: 'Colore del pulsante centrale', wheelTitle: 'Titolo della ruota', wheelDesc: 'Descrizione della ruota', descPh: 'Descrizione facoltativa',
      share: 'Condividi e incorpora', copyLink: 'Copia link', copyEmbed: 'Copia codice di incorporamento', copied: 'Copiato!', close: 'Chiudi', minEntries: 'Aggiungi almeno 2 voci visibili per girare.', resetAll: 'Ripristina tutto', confirmSure: 'Sei sicuro?', shortcuts: 'Spazio / Invio: gira · Esc: chiudi', importFail: 'Impossibile leggere il file.'
    },
    ja: {
      title: 'イエス・ノールーレット - ランダム決定＆カスタムルーレット | YesNoWheel',
      desc: 'イエス・ノールーレットを回してランダムに決定。名前・重み・画像を使ったオリジナルルーレットも作れます。無料・登録不要・オフライン対応・10言語。',
      yesnoMode: 'Yes/Noルーレット', customMode: 'カスタムルーレット', settings: '設定', fullscreen: '全画面', exitFullscreen: '全画面を終了', language: '言語', wheelTitlePh: 'ルーレットのタイトル',
      spin: '回す', yes: 'はい', no: 'いいえ', maybe: 'たぶん', opt2: 'はい / いいえ', opt3: 'はい / いいえ / たぶん', sets: 'セット数', tally: 'スコアボード', resetTally: 'スコアをリセット',
      listView: 'リスト', textView: 'テキスト', addEntry: '項目を追加', entryPh: '項目を入力', textPh: '1行に1項目。\n「重み, テキスト」で重みを指定（例: 3, ピザ）', search: '項目を検索', shuffle: 'シャッフル', sortAZ: '昇順に並べ替え', delEmpty: '空の項目を削除', clearAll: 'すべて削除', importFile: 'CSV/TXTをインポート', exportCSV: 'CSVをエクスポート', exportJSON: 'JSONをエクスポート', restoreHidden: '非表示を復元',
      mysteryWheel: 'ミステリールーレット', mysteryResult: 'ミステリー結果', weight: '重み', toggleVisible: '表示 / 非表示', duplicate: '複製', remove: '削除', imageUrl: '画像URL', uploadImage: '画像をアップロード', color: 'スライスの色', reorder: 'ドラッグで並べ替え',
      tabInputs: '入力', tabResults: '結果', history: '履歴', leaderboard: 'ランキング', noResults: 'まだ回していません', clearHistory: '履歴を消去',
      actionMode: '回した後の動作', normal: '通常', elimination: '勝ち抜き', accumulation: '集計',
      done: '完了', hideChoice: 'この項目を隠す', hideAll: '同じ項目をすべて隠す', tapReveal: 'タップして表示', winnerIs: '当選は', wins: '勝',
      setSpin: '回転の設定', duration: '回転時間', speed: '回転速度', idle: '待機中のゆっくり回転', setEffects: 'サウンドと演出', tick: 'ティック音', victory: '勝利サウンド', confetti: '紙吹雪', dark: 'ダークテーマ', setStyle: 'ルーレットとページのスタイル', palette: 'カラーパレット', vibrant: 'ビビッド', pastel: 'パステル', neon: 'ネオン', mono: 'モノクロ', custom: 'カスタム', pageBg: 'ページの背景色', resetColor: 'リセット', centerText: '中央ボタンの文字', centerColor: '中央ボタンの色', wheelTitle: 'ルーレットのタイトル', wheelDesc: 'ルーレットの説明', descPh: '説明（任意）',
      share: '共有と埋め込み', copyLink: '共有リンクをコピー', copyEmbed: '埋め込みコードをコピー', copied: 'コピーしました！', close: '閉じる', minEntries: '回すには表示中の項目が2つ以上必要です。', resetAll: 'すべてリセット', confirmSure: 'よろしいですか？', shortcuts: 'Space / Enter: 回す · Esc: 閉じる', importFail: 'ファイルを読み込めませんでした。'
    },
    ko: {
      title: '예스 노 룰렛 - 랜덤 결정 & 맞춤 돌림판 | YesNoWheel',
      desc: '예스/노 룰렛을 돌려 무작위로 결정하거나 이름, 가중치, 이미지를 넣어 나만의 돌림판을 만들어 보세요. 무료, 가입 불필요, 오프라인 지원, 10개 언어.',
      yesnoMode: '예/아니오 룰렛', customMode: '맞춤 돌림판', settings: '설정', fullscreen: '전체 화면', exitFullscreen: '전체 화면 종료', language: '언어', wheelTitlePh: '돌림판 제목',
      spin: '돌리기', yes: '예', no: '아니오', maybe: '글쎄', opt2: '예 / 아니오', opt3: '예 / 아니오 / 글쎄', sets: '세트 수', tally: '점수판', resetTally: '점수판 초기화',
      listView: '목록', textView: '텍스트', addEntry: '항목 추가', entryPh: '항목 입력', textPh: '한 줄에 한 항목.\n"가중치, 텍스트" 형식으로 가중치 지정 (예: 3, 피자)', search: '항목 검색', shuffle: '섞기', sortAZ: '가나다순 정렬', delEmpty: '빈 항목 삭제', clearAll: '모두 삭제', importFile: 'CSV/TXT 가져오기', exportCSV: 'CSV 내보내기', exportJSON: 'JSON 내보내기', restoreHidden: '숨긴 항목 복원',
      mysteryWheel: '미스터리 돌림판', mysteryResult: '미스터리 결과', weight: '가중치', toggleVisible: '표시 / 숨김', duplicate: '복제', remove: '삭제', imageUrl: '이미지 URL', uploadImage: '이미지 업로드', color: '조각 색상', reorder: '드래그하여 순서 변경',
      tabInputs: '입력', tabResults: '결과', history: '기록', leaderboard: '순위표', noResults: '아직 돌린 기록이 없습니다', clearHistory: '기록 지우기',
      actionMode: '돌린 후 동작', normal: '일반', elimination: '탈락', accumulation: '누적',
      done: '완료', hideChoice: '이 항목 숨기기', hideAll: '같은 항목 모두 숨기기', tapReveal: '눌러서 확인', winnerIs: '당첨 결과는', wins: '승',
      setSpin: '회전 설정', duration: '회전 시간', speed: '회전 속도', idle: '대기 중 천천히 회전', setEffects: '소리 및 효과', tick: '틱 소리', victory: '승리 사운드', confetti: '색종이', dark: '다크 테마', setStyle: '돌림판 및 페이지 스타일', palette: '색상 팔레트', vibrant: '선명한', pastel: '파스텔', neon: '네온', mono: '모노크롬', custom: '사용자 지정', pageBg: '페이지 배경', resetColor: '초기화', centerText: '중앙 버튼 문구', centerColor: '중앙 버튼 색상', wheelTitle: '돌림판 제목', wheelDesc: '돌림판 설명', descPh: '설명 (선택 사항)',
      share: '공유 및 삽입', copyLink: '공유 링크 복사', copyEmbed: '삽입 코드 복사', copied: '복사됨!', close: '닫기', minEntries: '돌리려면 표시된 항목이 2개 이상 필요합니다.', resetAll: '모두 초기화', confirmSure: '정말 진행할까요?', shortcuts: 'Space / Enter: 돌리기 · Esc: 닫기', importFail: '파일을 읽을 수 없습니다.'
    },
    zh: {
      title: '是非轮盘 - 随机决定与自定义抽签转盘 | YesNoWheel',
      desc: '转动“是/否”轮盘随机做决定，或用自己的名字、权重和图片创建自定义转盘。免费、无需注册、支持离线，提供10种语言。',
      yesnoMode: '是/否转盘', customMode: '自定义转盘', settings: '设置', fullscreen: '全屏', exitFullscreen: '退出全屏', language: '语言', wheelTitlePh: '转盘标题',
      spin: '开始', yes: '是', no: '否', maybe: '也许', opt2: '是 / 否', opt3: '是 / 否 / 也许', sets: '组数', tally: '计分板', resetTally: '重置计分板',
      listView: '列表', textView: '文本', addEntry: '添加选项', entryPh: '输入选项', textPh: '每行一个选项。\n使用“权重, 文本”设置权重，例如 3, 披萨', search: '搜索选项', shuffle: '打乱', sortAZ: '按 A–Z 排序', delEmpty: '删除空项', clearAll: '全部清除', importFile: '导入 CSV/TXT', exportCSV: '导出 CSV', exportJSON: '导出 JSON', restoreHidden: '恢复隐藏项',
      mysteryWheel: '神秘转盘', mysteryResult: '神秘结果', weight: '权重', toggleVisible: '显示 / 隐藏', duplicate: '复制', remove: '删除', imageUrl: '图片链接', uploadImage: '上传图片', color: '扇区颜色', reorder: '拖动排序',
      tabInputs: '输入', tabResults: '结果', history: '历史记录', leaderboard: '排行榜', noResults: '还没有转动记录', clearHistory: '清除历史',
      actionMode: '每次转动之后', normal: '普通', elimination: '淘汰', accumulation: '累计',
      done: '完成', hideChoice: '隐藏该选项', hideAll: '隐藏所有相同项', tapReveal: '点击揭晓', winnerIs: '获胜者是', wins: '次获胜',
      setSpin: '转动设置', duration: '转动时长', speed: '转动速度', idle: '待机时缓慢旋转', setEffects: '声音与特效', tick: '滴答声', victory: '胜利音效', confetti: '彩纸', dark: '深色主题', setStyle: '转盘与页面样式', palette: '配色方案', vibrant: '鲜艳', pastel: '柔和', neon: '霓虹', mono: '单色', custom: '自定义', pageBg: '页面背景', resetColor: '重置', centerText: '中心按钮文字', centerColor: '中心按钮颜色', wheelTitle: '转盘标题', wheelDesc: '转盘描述', descPh: '可选描述',
      share: '分享与嵌入', copyLink: '复制分享链接', copyEmbed: '复制嵌入代码', copied: '已复制！', close: '关闭', minEntries: '至少需要 2 个可见选项才能转动。', resetAll: '全部重置', confirmSure: '确定吗？', shortcuts: '空格 / 回车：转动 · Esc：关闭', importFail: '无法读取该文件。'
    },
    ar: {
      title: 'عجلة نعم أو لا - قرار عشوائي وعجلة اختيار مخصصة | YesNoWheel',
      desc: 'أدر عجلة نعم أو لا لاتخاذ قرار عشوائي، أو أنشئ عجلة مخصصة بأسمائك وأوزانك وصورك. مجانية، بدون تسجيل، تعمل دون اتصال بـ 10 لغات.',
      yesnoMode: 'عجلة نعم/لا', customMode: 'عجلة مخصصة', settings: 'الإعدادات', fullscreen: 'ملء الشاشة', exitFullscreen: 'الخروج من ملء الشاشة', language: 'اللغة', wheelTitlePh: 'عنوان العجلة',
      spin: 'أدِر', yes: 'نعم', no: 'لا', maybe: 'ربما', opt2: 'نعم / لا', opt3: 'نعم / لا / ربما', sets: 'عدد المجموعات', tally: 'لوحة النتائج', resetTally: 'إعادة ضبط النتائج',
      listView: 'قائمة', textView: 'نص', addEntry: 'إضافة خيار', entryPh: 'أدخل خيارًا', textPh: 'خيار واحد في كل سطر.\nاستخدم "الوزن، النص" لتحديد الوزن، مثل 3، بيتزا', search: 'بحث في الخيارات', shuffle: 'خلط', sortAZ: 'ترتيب أبجدي', delEmpty: 'حذف الفارغة', clearAll: 'مسح الكل', importFile: 'استيراد CSV/TXT', exportCSV: 'تصدير CSV', exportJSON: 'تصدير JSON', restoreHidden: 'استعادة المخفية',
      mysteryWheel: 'عجلة الغموض', mysteryResult: 'نتيجة غامضة', weight: 'الوزن', toggleVisible: 'إظهار / إخفاء', duplicate: 'تكرار', remove: 'حذف', imageUrl: 'رابط الصورة', uploadImage: 'رفع صورة', color: 'لون الشريحة', reorder: 'اسحب لإعادة الترتيب',
      tabInputs: 'المدخلات', tabResults: 'النتائج', history: 'السجل', leaderboard: 'لوحة المتصدرين', noResults: 'لا توجد دورات بعد', clearHistory: 'مسح السجل',
      actionMode: 'بعد كل دورة', normal: 'عادي', elimination: 'الإقصاء', accumulation: 'التراكم',
      done: 'تم', hideChoice: 'إخفاء الخيار', hideAll: 'إخفاء كل المتطابقة', tapReveal: 'اضغط للكشف', winnerIs: 'الفائز هو', wins: 'فوز',
      setSpin: 'سلوك الدوران', duration: 'مدة الدوران', speed: 'سرعة الدوران', idle: 'دوران بطيء أثناء الخمول', setEffects: 'الصوت والمؤثرات', tick: 'صوت النقر', victory: 'صوت الفوز', confetti: 'قصاصات ملونة', dark: 'المظهر الداكن', setStyle: 'نمط العجلة والصفحة', palette: 'لوحة الألوان', vibrant: 'زاهية', pastel: 'باستيل', neon: 'نيون', mono: 'أحادية اللون', custom: 'مخصصة', pageBg: 'خلفية الصفحة', resetColor: 'إعادة ضبط', centerText: 'نص الزر المركزي', centerColor: 'لون الزر المركزي', wheelTitle: 'عنوان العجلة', wheelDesc: 'وصف العجلة', descPh: 'وصف اختياري',
      share: 'المشاركة والتضمين', copyLink: 'نسخ رابط المشاركة', copyEmbed: 'نسخ كود التضمين', copied: 'تم النسخ!', close: 'إغلاق', minEntries: 'أضف خيارين مرئيين على الأقل للدوران.', resetAll: 'إعادة ضبط كل شيء', confirmSure: 'هل أنت متأكد؟', shortcuts: 'مسافة / Enter: دوران · Esc: إغلاق', importFail: 'تعذر قراءة الملف.'
    }
  };

  function has(code) { return Object.prototype.hasOwnProperty.call(T, code); }
  function t(lang, key) {
    var d = T[lang];
    if (d && d[key] != null) return d[key];
    return T.en[key] != null ? T.en[key] : key;
  }
  function isRtl(lang) { return lang === 'ar'; }

  global.I18N = { LANGS: LANGS, T: T, has: has, t: t, isRtl: isRtl };
})(typeof window !== 'undefined' ? window : globalThis);
