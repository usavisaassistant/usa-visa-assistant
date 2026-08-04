(() => {
  const missionEl = document.getElementById('mission');
  const loadingEl = document.getElementById('loading');

  const state = {
    scene: 'outside',
    documents: { photo: false, ds160: false, receipt: false },
    queueDone: false,
    interviewStarted: false,
  };

  const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1280,
    height: 720,
    backgroundColor: '#87c8f5',
    physics: { default: 'arcade', arcade: { gravity: { y: 1100 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: { create, update }
  };

  new Phaser.Game(config);

  let player, cursors, keyA, keyD, keyE, currentRoom, doorZone, actionLocked = false;
  let roomGroup, uiGroup;

  function create() {
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    roomGroup = this.add.group();
    uiGroup = this.add.group();
    buildOutside.call(this);
    loadingEl.classList.add('hidden');
  }

  function update() {
    if (!player || actionLocked) return;
    const left = cursors.left.isDown || keyA.isDown;
    const right = cursors.right.isDown || keyD.isDown;
    player.body.setVelocityX(left ? -260 : right ? 260 : 0);
    player.setData('moving', left || right);
    if (left) player.setScale(-1, 1);
    if (right) player.setScale(1, 1);
    animateWalker(player, this.game.loop.time);

    if (doorZone && Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), doorZone.getBounds())) {
      showPrompt.call(this, 'E — შესვლა');
      if (Phaser.Input.Keyboard.JustDown(keyE)) nextRoom.call(this);
    } else {
      hidePrompt.call(this);
    }
  }

  function clearRoom() {
    roomGroup.clear(true, true);
    uiGroup.clear(true, true);
    doorZone = null;
    player = null;
    currentRoom = null;
  }

  function nextRoom() {
    if (state.scene === 'outside') return transitionTo.call(this, buildSecurity, 'security');
    if (state.scene === 'security') return transitionTo.call(this, buildDocuments, 'documents');
    if (state.scene === 'documents') return transitionTo.call(this, buildWaiting, 'waiting');
    if (state.scene === 'waiting') return transitionTo.call(this, buildInterview, 'interview');
  }

  function transitionTo(builder, name) {
    actionLocked = true;
    const fade = this.add.rectangle(640, 360, 1280, 720, 0x06152f, 0).setDepth(1000);
    this.tweens.add({ targets: fade, alpha: 1, duration: 350, onComplete: () => {
      clearRoom();
      state.scene = name;
      builder.call(this);
      this.tweens.add({ targets: fade, alpha: 0, duration: 350, onComplete: () => { fade.destroy(); actionLocked = false; } });
    }});
  }

  function makePlayer(scene, x, y) {
    const body = scene.add.container(x, y);
    const head = scene.add.circle(0, -54, 18, 0xe1ad7a).setStrokeStyle(3, 0x3b2d24);
    const torso = scene.add.rectangle(0, -18, 34, 58, 0x173f78).setStrokeStyle(3, 0x0d2344);
    const armL = scene.add.rectangle(-24, -20, 10, 48, 0xe1ad7a).setOrigin(.5, .1);
    const armR = scene.add.rectangle(24, -20, 10, 48, 0xe1ad7a).setOrigin(.5, .1);
    const legL = scene.add.rectangle(-10, 19, 12, 56, 0x1e293b).setOrigin(.5, .1);
    const legR = scene.add.rectangle(10, 19, 12, 56, 0x1e293b).setOrigin(.5, .1);
    body.add([armL, armR, legL, legR, torso, head]);
    body.setSize(54, 128);
    scene.physics.add.existing(body);
    body.body.setCollideWorldBounds(true);
    body.body.setSize(46, 124).setOffset(4, 0);
    body.setData({ armL, armR, legL, legR, moving: false });
    roomGroup.add(body);
    return body;
  }

  function animateWalker(p, time) {
    const amp = p.getData('moving') ? Math.sin(time / 90) * 24 : 0;
    p.getData('armL').rotation = Phaser.Math.DegToRad(amp);
    p.getData('armR').rotation = Phaser.Math.DegToRad(-amp);
    p.getData('legL').rotation = Phaser.Math.DegToRad(-amp * .75);
    p.getData('legR').rotation = Phaser.Math.DegToRad(amp * .75);
  }

  function addGround(scene, y = 620, color = 0x6b7280) {
    const ground = scene.add.rectangle(640, y + 50, 1280, 100, color);
    scene.physics.add.existing(ground, true);
    roomGroup.add(ground);
    return ground;
  }

  function buildOutside() {
    currentRoom = 'outside';
    missionEl.textContent = 'მისია: მიდი საკონსულოს შესასვლელთან';
    this.cameras.main.setBackgroundColor('#7ec8f8');
    roomGroup.add(this.add.rectangle(640, 520, 1280, 200, 0xb8bec7));
    roomGroup.add(this.add.rectangle(640, 665, 1280, 110, 0x3f4650));
    for (let i = 0; i < 7; i++) roomGroup.add(this.add.rectangle(90 + i * 190, 665, 90, 8, 0xffffff));

    const embassy = this.add.container(950, 360);
    const base = this.add.rectangle(0, 60, 420, 350, 0xf2f4f7).setStrokeStyle(8, 0xd5dce5);
    const title = this.add.text(0, -55, 'U.S. EMBASSY', { fontSize: '28px', fontStyle: 'bold', color: '#123b70' }).setOrigin(.5);
    const door = this.add.rectangle(0, 145, 90, 150, 0x17395f);
    const columns = [-150,-75,75,150].map(x => this.add.rectangle(x, 55, 28, 250, 0xffffff).setStrokeStyle(2, 0xdde3ea));
    embassy.add([base, ...columns, door, title]);
    roomGroup.add(embassy);

    const flagPole = this.add.rectangle(1160, 230, 8, 260, 0x4b5563);
    const flag = this.add.rectangle(1105, 120, 105, 64, 0xffffff).setStrokeStyle(2, 0x374151);
    roomGroup.add(flagPole); roomGroup.add(flag);
    for (let i=0;i<7;i++) roomGroup.add(this.add.rectangle(1105, 94 + i*9, 105, 5, i%2?0xffffff:0xb22234));
    roomGroup.add(this.add.rectangle(1078, 106, 50, 28, 0x3c3b6e));

    const guard = makeNpc.call(this, 820, 555, 0x234a83, 'დაცვა');
    roomGroup.add(guard);
    addGround(this, 620, 0xb9bec6);
    player = makePlayer(this, 120, 560);
    this.physics.add.collider(player, roomGroup.getChildren().filter(x => x.body && x.body.immovable));
    doorZone = this.add.zone(950, 520, 120, 200);
    this.physics.add.existing(doorZone, true);
    roomGroup.add(doorZone);
    addPedestrians.call(this);
  }

  function buildSecurity() {
    currentRoom = 'security';
    missionEl.textContent = 'მისია: გაიარე დაცვა და დატოვე აკრძალული ნივთები';
    this.cameras.main.setBackgroundColor('#dce5ef');
    addInterior.call(this, 'SECURITY CHECK');
    addGround(this, 620, 0xb4bdc8);
    player = makePlayer(this, 120, 560);
    const guard = makeNpc.call(this, 420, 555, 0x1f4f86, 'დაცვის თანამშრომელი');
    const detector = this.add.container(710, 490);
    detector.add([this.add.rectangle(-55, 20, 24, 220, 0x334155), this.add.rectangle(55, 20, 24, 220, 0x334155), this.add.rectangle(0, -80, 130, 24, 0x334155)]);
    roomGroup.add(detector);
    const locker = this.add.rectangle(920, 500, 150, 230, 0x7b8796).setStrokeStyle(5, 0x475569);
    roomGroup.add(locker);
    const lockerText = this.add.text(920, 390, 'LOCKER', { fontSize:'21px', fontStyle:'bold', color:'#334155' }).setOrigin(.5); roomGroup.add(lockerText);
    doorZone = this.add.zone(1180, 520, 100, 200); this.physics.add.existing(doorZone, true); roomGroup.add(doorZone);
    setupSecurityInteraction.call(this, guard);
  }

  function setupSecurityInteraction(guard) {
    this.physics.add.overlap(player, guard, () => {
      showPrompt.call(this, 'E — დაცვასთან საუბარი');
      if (Phaser.Input.Keyboard.JustDown(keyE) && !actionLocked) {
        actionLocked = true;
        showDialog.call(this, 'დაცვა', 'გაქვთ ტელეფონი, ჭკვიანი საათი, ყურსასმენი ან სხვა ელექტრონული ნივთი?', [
          ['დიახ, მაქვს', () => showDialog.call(this, 'დაცვა', 'გთხოვთ, დატოვოთ ნივთები ლოკერში და შემდეგ გაიაროთ მეტალოდეტექტორი.', [['ნივთების დატოვება', () => { closeDialog.call(this); missionEl.textContent='მისია: გაიარე მეტალოდეტექტორი და მიდი შემდეგ ოთახში'; actionLocked=false; }]])],
          ['არა, არ მაქვს', () => { closeDialog.call(this); missionEl.textContent='მისია: გაიარე მეტალოდეტექტორი და მიდი შემდეგ ოთახში'; actionLocked=false; }]
        ]);
      }
    });
  }

  function buildDocuments() {
    missionEl.textContent = 'მისია: ჩააბარე ფოტო, DS-160 და მოსაკრებლის ქვითარი';
    this.cameras.main.setBackgroundColor('#dfe7f0');
    addInterior.call(this, 'DOCUMENTS WINDOW');
    addGround(this, 620, 0xb4bdc8);
    player = makePlayer(this, 110, 560);
    const counter = this.add.rectangle(760, 510, 520, 120, 0x7b4d2c).setStrokeStyle(5, 0x4b2f1b); roomGroup.add(counter);
    const glass = this.add.rectangle(760, 320, 520, 260, 0xdbeafe, .55).setStrokeStyle(5, 0xffffff); roomGroup.add(glass);
    const clerk = makeNpc.call(this, 760, 430, 0x385f8d, 'თანამშრომელი');
    const docs = [
      makeDoc.call(this, 240, 480, '📷', '5×5 ფოტო', 'photo'),
      makeDoc.call(this, 390, 480, '📄', 'DS-160', 'ds160'),
      makeDoc.call(this, 540, 480, '🧾', 'ქვითარი', 'receipt')
    ];
    docs.forEach(d => d.setInteractive({ useHandCursor:true }).on('pointerdown', () => submitDocument.call(this, d)));
    doorZone = this.add.zone(1180, 520, 100, 200); this.physics.add.existing(doorZone, true); roomGroup.add(doorZone);
    showDialog.call(this, 'თანამშრომელი', 'მომაწოდეთ საბუთები.', [['კარგი', () => { closeDialog.call(this); actionLocked=false; }]]);
  }

  function submitDocument(doc) {
    const key = doc.getData('key');
    if (state.documents[key]) return;
    state.documents[key] = true;
    this.tweens.add({ targets: doc, x: 760, y: 420, scale: .35, alpha: .15, angle: 10, duration: 650, onComplete: () => doc.destroy() });
    const all = Object.values(state.documents).every(Boolean);
    if (all) missionEl.textContent = 'მისია: მიჰყევი ისარს მოსაცდელი დარბაზისკენ';
  }

  function buildWaiting() {
    missionEl.textContent = 'მისია: ჩადგი რიგში — შენს წინ მხოლოდ ერთი აპლიკანტია';
    this.cameras.main.setBackgroundColor('#e5eaf0');
    addInterior.call(this, 'WAITING HALL  ➜  INTERVIEW WINDOWS');
    addGround(this, 620, 0xb4bdc8);
    player = makePlayer(this, 120, 560);
    for (let i=0;i<5;i++) {
      const chair = this.add.rectangle(270+i*120, 520, 80, 70, 0x52657a).setStrokeStyle(4,0x334155); roomGroup.add(chair);
    }
    const board = this.add.rectangle(720, 180, 280, 100, 0x0f2f5d).setStrokeStyle(4,0xffffff); roomGroup.add(board);
    const boardText = this.add.text(720, 180, 'A-021', { fontSize:'42px', fontStyle:'bold', color:'#fff' }).setOrigin(.5); roomGroup.add(boardText);
    const personAhead = makePlayer(this, 880, 560); personAhead.setScale(.92); roomGroup.add(personAhead);
    const arrow = this.add.text(1080, 330, '➜', { fontSize:'96px', color:'#1769d2', fontStyle:'bold' }).setOrigin(.5); roomGroup.add(arrow);
    doorZone = this.add.zone(1180, 520, 100, 220); this.physics.add.existing(doorZone, true); roomGroup.add(doorZone);
    this.time.delayedCall(1400, () => {
      boardText.setText('A-022');
      this.tweens.add({ targets: personAhead, x: 1180, duration: 1400, onComplete: () => { personAhead.destroy(); state.queueDone=true; missionEl.textContent='მისია: თქვენი რიგია — მიდით გასაუბრების ფანჯარასთან'; boardText.setText('A-023'); } });
    });
  }

  function buildInterview() {
    missionEl.textContent = 'მისია: მიდი ფანჯარასთან და დაიწყე ინტერვიუ';
    this.cameras.main.setBackgroundColor('#d9e1ea');
    addInterior.call(this, 'NONIMMIGRANT VISA INTERVIEW');
    addGround(this, 620, 0xb4bdc8);
    player = makePlayer(this, 160, 560);
    const backPeople = [270,360,450].map(x=>makeNpc.call(this,x,560,0x4a6788,'')); backPeople.forEach(p=>p.setAlpha(.55));
    const counter = this.add.rectangle(860, 520, 600, 130, 0x6f472d).setStrokeStyle(5,0x452b1c); roomGroup.add(counter);
    const glass = this.add.rectangle(860, 305, 600, 320, 0xdbeafe,.5).setStrokeStyle(5,0xffffff); roomGroup.add(glass);
    const consul = makeNpc.call(this, 860, 430, 0x243b63, 'კონსული');
    doorZone = null;
    this.physics.add.overlap(player, consul, () => {
      showPrompt.call(this, 'E — ინტერვიუს დაწყება');
      if (Phaser.Input.Keyboard.JustDown(keyE) && !state.interviewStarted) {
        state.interviewStarted = true;
        actionLocked = true;
        showDialog.call(this, 'კონსული', 'დილა მშვიდობისა. რა მიზნით მიემგზავრებით ამერიკაში?', [
          ['10-დღიანი ტურისტული მოგზაურობა მაქვს დაგეგმილი', () => showDecision.call(this, true)],
          ['ოჯახის წევრს ვნახავ და გეგმას ადგილზე გადავწყვეტ', () => showDecision.call(this, false)]
        ]);
      }
    });
  }

  function showDecision(approved) {
    showDialog.call(this, 'კონსული', approved ? 'თქვენი ვიზა დამტკიცებულია. პასპორტი საკურიერო სერვისით დაგიბრუნდებათ.' : 'სამწუხაროდ, დღეს თქვენი ვიზის დამტკიცება ვერ შევძელი.', [['დასრულება', () => { closeDialog.call(this); actionLocked=false; missionEl.textContent = approved ? 'შედეგი: ვიზა დამტკიცებულია' : 'შედეგი: ვიზაზე უარია'; }]]);
  }

  function addInterior(title) {
    const wall = this.add.rectangle(640, 300, 1280, 600, 0xe7edf4); roomGroup.add(wall);
    for (let x=80;x<1280;x+=160) roomGroup.add(this.add.rectangle(x, 300, 4, 600, 0xd1dae5));
    const sign = this.add.rectangle(640, 90, 520, 68, 0x173f78); roomGroup.add(sign);
    const text = this.add.text(640, 90, title, { fontSize:'26px', fontStyle:'bold', color:'#fff' }).setOrigin(.5); roomGroup.add(text);
  }

  function addPedestrians() {
    [320,520,700].forEach((x,i)=>{
      const npc = makePlayer(this, x, 560); npc.setScale(.55); npc.setAlpha(.75);
      this.tweens.add({ targets:npc, x:x+180, duration:2800+i*500, yoyo:true, repeat:-1 });
    });
  }

  function makeNpc(x,y,color,label) {
    const npc = this.add.container(x,y);
    const head = this.add.circle(0,-45,16,0xe1ad7a).setStrokeStyle(3,0x3b2d24);
    const body = this.add.rectangle(0,-5,42,70,color).setStrokeStyle(3,0x16243d);
    npc.add([body,head]);
    if (label) npc.add(this.add.text(0,-92,label,{fontSize:'14px',fontStyle:'bold',color:'#13233a',backgroundColor:'#ffffff',padding:{x:7,y:4}}).setOrigin(.5));
    npc.setSize(60,120); this.physics.add.existing(npc,true); roomGroup.add(npc); return npc;
  }

  function makeDoc(x,y,icon,label,key) {
    const c = this.add.container(x,y);
    const card = this.add.rectangle(0,0,130,170,0xffffff).setStrokeStyle(3,0xb9c6d5);
    const ico = this.add.text(0,-28,icon,{fontSize:'46px'}).setOrigin(.5);
    const txt = this.add.text(0,48,label,{fontSize:'17px',fontStyle:'bold',color:'#15243a',align:'center',wordWrap:{width:110}}).setOrigin(.5);
    c.add([card,ico,txt]); c.setSize(130,170); c.setData('key',key); roomGroup.add(c); return c;
  }

  function showPrompt(text) {
    if (this.prompt && this.prompt.text === text) return;
    hidePrompt.call(this);
    this.prompt = this.add.text(640,650,text,{fontSize:'20px',fontStyle:'bold',color:'#fff',backgroundColor:'#071a39',padding:{x:16,y:10}}).setOrigin(.5).setDepth(900);
    uiGroup.add(this.prompt);
  }

  function hidePrompt() { if (this.prompt) { this.prompt.destroy(); this.prompt=null; } }

  function showDialog(title,text,buttons) {
    closeDialog.call(this);
    const panel = this.add.container(640,350).setDepth(950);
    const bg = this.add.rectangle(0,0,720,330,0xffffff).setStrokeStyle(5,0x173f78);
    const t = this.add.text(-310,-125,title,{fontSize:'28px',fontStyle:'bold',color:'#173f78'});
    const p = this.add.text(-310,-70,text,{fontSize:'22px',color:'#24364d',wordWrap:{width:620},lineSpacing:8});
    panel.add([bg,t,p]);
    buttons.forEach((b,i)=>{
      const y = 60 + i*62;
      const r = this.add.rectangle(0,y,620,48,0xf3f7fb).setStrokeStyle(2,0xb8c7d8).setInteractive({useHandCursor:true});
      const tx = this.add.text(-285,y,b[0],{fontSize:'18px',fontStyle:'bold',color:'#17345f'}).setOrigin(0,.5);
      r.on('pointerdown',b[1]); panel.add([r,tx]);
    });
    this.dialogPanel=panel; uiGroup.add(panel);
  }

  function closeDialog() { if (this.dialogPanel) { this.dialogPanel.destroy(true); this.dialogPanel=null; } }
})();