@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
:root{font-family:'DM Sans',sans-serif;color:#17221f;background:#f4f7f5;font-synthesis:none}*{box-sizing:border-box}body{margin:0;min-width:1180px}button,input,textarea{font:inherit}button{cursor:pointer}.app-shell{display:grid;grid-template-columns:245px 1fr;min-height:100vh}aside{position:sticky;top:0;height:100vh;padding:26px 18px;background:#173c32;color:white;display:flex;flex-direction:column}.logo{display:flex;align-items:center;gap:12px;padding:0 8px 28px}.logo strong{font-family:Manrope;font-size:17px;display:block}.logo span{font-size:12px;color:#b7d0c8}.brand-mark{display:grid;place-items:center;width:54px;height:54px;border-radius:17px;background:#e5b956;color:#173c32;font-family:Manrope;font-weight:800;font-size:24px}.brand-mark.small{width:39px;height:39px;border-radius:12px;font-size:18px}nav button,.ghost{width:100%;display:flex;align-items:center;gap:10px;border:0;border-radius:10px;padding:12px;background:transparent;color:#d6e4df;text-align:left}nav button.active{background:#285449;color:#fff}.aside-bottom{margin-top:auto;display:grid;gap:12px}.connection{font-size:12px;padding:9px 10px;border-radius:8px;background:#21493e}.connection:before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:7px}.connection.live:before{background:#68d391}.connection.local:before{background:#e5b956}.content{padding:34px 42px 60px;max-width:1700px;width:100%;margin:auto}header{display:flex;justify-content:space-between;align-items:flex-start;gap:30px;margin-bottom:26px}.eyebrow{font-size:11px;font-weight:800;color:#65756f;letter-spacing:.13em;margin:0 0 5px}h1{font:800 29px Manrope;margin:0;color:#14352c}header p{margin:6px 0 0;color:#6d7975}.header-actions{display:flex;gap:10px}.primary,.secondary{border:0;border-radius:10px;padding:11px 15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:700}.primary{background:#173c32;color:white}.secondary{background:white;color:#173c32;border:1px solid #d8e0dd}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:18px}.stats button{background:white;border:1px solid #e0e6e3;border-radius:13px;text-align:left;padding:15px 17px;transition:.15s}.stats button:hover,.stats button.selected{border-color:#8aa59c;box-shadow:0 5px 20px #173c3210}.stats strong{display:block;font:800 23px Manrope;color:#173c32}.stats span{font-size:13px;color:#71807b}.stats .green-card{background:#edf8f1;border-color:#9bcbae}.stats .orange-card{background:#fff6e7;border-color:#e6bd74}.toolbar{display:flex;align-items:center;justify-content:space-between;margin:15px 0 11px;color:#71807b;font-size:13px}.search{width:min(650px,60%);display:flex;align-items:center;gap:9px;background:white;border:1px solid #dce4e1;border-radius:11px;padding:0 13px}.search input{width:100%;padding:11px 0;border:0;outline:none;background:transparent}.reservation-list{display:grid;gap:9px}.reservation{background:white;border:1px solid #e1e7e4;border-radius:13px;overflow:hidden;box-shadow:0 2px 8px #173c3205}.reservation.is-ready{border-left:4px solid #46a46a}.row-main{position:relative;display:grid;grid-template-columns:30px minmax(250px,1.3fr) minmax(260px,1.4fr) minmax(300px,1.3fr) 95px 18px;align-items:center;gap:14px;padding:13px 17px;min-height:78px;cursor:pointer}.expand{border:0;background:transparent;color:#799087;padding:0}.identity{display:flex;align-items:center;gap:12px;min-width:0}.avatar{flex:0 0 39px;height:39px;display:grid;place-items:center;border-radius:12px;background:#e9f0ed;color:#315a4e;font-weight:800;font-size:13px}.identity h2{font-size:14px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.identity h2 em{font-style:normal;font-size:10px;margin-left:7px;background:#fff0d2;color:#8d5b00;padding:3px 6px;border-radius:12px}.identity p{display:flex;align-items:center;gap:4px;margin:4px 0 0;color:#7d8985;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.stay{min-width:0;display:grid;gap:6px}.stay span{display:flex;align-items:center;gap:6px;font-size:12px;color:#53635e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges{display:flex;gap:6px;flex-wrap:wrap}.quick-check{display:flex;align-items:center;gap:5px;border:1px solid #e0e5e3;background:#f7f9f8;color:#87918e;border-radius:20px;padding:6px 9px;font-size:11px;font-weight:700}.quick-check.checked{background:#e9f7ee;border-color:#afd4bd;color:#277344}.quick-check.important:not(.checked){background:#fff3df;border-color:#edc885;color:#9b6500}.due{display:grid;grid-template-columns:18px 1fr;align-items:center}.due strong{font-size:13px}.due small{grid-column:2;color:#89938f;font-size:10px}.details{border-top:1px solid #e7ecea;background:#fbfcfb;padding:18px 60px 20px;display:grid;grid-template-columns:1.2fr 1fr;gap:18px 24px}.field label,.detail-grid label{display:block;font-size:11px;font-weight:800;color:#66746f;margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em}.status-picker{display:flex;flex-wrap:wrap;gap:7px}.status-picker button{display:flex;align-items:center;gap:5px;border:1px solid #dfe5e2;border-radius:8px;background:white;padding:8px 10px;font-size:11px;color:#687570}.status-picker button.on{font-weight:800;color:#173c32;border-color:#8da99f;box-shadow:inset 0 0 0 1px #8da99f}.status-picker .green.on{background:#e9f7ee}.status-picker .orange.on{background:#fff0da}.status-picker .purple.on{background:#f2ebfa}.status-picker .blue.on{background:#e8f2fa}.note textarea{width:100%;min-height:78px;resize:vertical;border:1px solid #dce4e1;border-radius:9px;padding:10px;outline:none}.detail-grid{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.detail-grid input{width:100%;border:1px solid #dce4e1;border-radius:8px;padding:9px;background:white}.empty{padding:50px;text-align:center;color:#81908b;background:white;border-radius:13px}.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.login-page{min-height:100vh;display:grid;place-items:center;background:linear-gradient(140deg,#173c32,#2e6657)}.login-card{width:390px;background:white;padding:38px;border-radius:20px;box-shadow:0 30px 80px #09231c66}.login-card .brand-mark{margin-bottom:18px}.login-card h1{margin-bottom:4px}.login-card p{color:#71807b;margin-top:0}.login-card form{display:grid;gap:14px;margin-top:24px}.login-card label{display:grid;gap:6px;font-size:12px;font-weight:700}.login-card input{padding:11px;border:1px solid #d5dfdb;border-radius:9px}.login-card .primary{width:100%;margin-top:4px}.setup-note{background:#fff6e5;color:#765110;padding:11px;border-radius:9px;font-size:12px;margin:20px 0 12px}.error{color:#9d2727;background:#fdecec;padding:9px;border-radius:8px;font-size:12px}.loading{min-height:100vh;display:grid;place-items:center}
@media(max-width:1250px){.row-main{grid-template-columns:30px 1.2fr 1fr 1.2fr 90px 15px}.stay span:first-child{max-width:190px}.content{padding-left:28px;padding-right:28px}}
.session-block{margin-top:20px;border-top:1px solid #ffffff18;padding-top:17px;min-height:0}.session-title{display:flex;justify-content:space-between;align-items:center;padding:0 10px 8px;color:#b9cbc5;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.session-title button{border:0;background:#ffffff12;color:white;width:25px;height:25px;border-radius:7px;display:grid;place-items:center}.session-list{display:grid;gap:4px;max-height:48vh;overflow:auto}.session-list button{border:0;background:transparent;color:#b9cbc5;display:flex;align-items:center;gap:9px;text-align:left;padding:9px 10px;border-radius:8px;font-size:12px}.session-list button:hover,.session-list button.current{background:#ffffff12;color:white}.connection{display:flex!important;align-items:center;gap:7px}.connection:before{display:none!important}.modal-backdrop{position:fixed;inset:0;background:#071a1599;display:grid;place-items:center;padding:20px;z-index:20}.modal{width:min(430px,100%);background:white;border-radius:18px;padding:26px;box-shadow:0 30px 90px #06181255}.modal h2{margin:0;color:#173c32}.modal p{color:#6c7b76;font-size:13px;line-height:1.5}.modal label{display:grid;gap:7px;font-size:12px;font-weight:800;margin-top:22px}.modal input{border:1px solid #d8e2de;border-radius:9px;padding:11px}.modal-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:24px}
@media(max-width:900px){.app-shell{display:block}aside{position:static;width:auto;min-height:auto;padding:16px}.session-block{display:none}.aside-bottom{position:static;margin-top:14px}.content{padding:22px 16px}.stats{grid-template-columns:repeat(2,1fr)}header{display:grid}.header-actions{flex-wrap:wrap}.row-main{grid-template-columns:25px 1fr auto}.stay,.due{display:none}.badges{grid-column:2/4}.details{padding:16px;grid-template-columns:1fr}.detail-grid{grid-template-columns:1fr 1fr}.search{width:100%}}
.danger-button{border:1px solid #e2b8b3;border-radius:10px;padding:10px 13px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:700;background:#fff;color:#9a3029}.danger-button:hover{background:#fff1ef;border-color:#cf8e86}.detail-actions{grid-column:1/-1;display:flex;justify-content:flex-end;padding-top:4px;border-top:1px solid #e7ecea}.header-actions .danger-button{white-space:nowrap}
.toolbar-right{display:flex;align-items:center;gap:16px}.sort-control{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #dce4e1;border-radius:10px;padding:7px 10px;color:#65756f}.sort-control select{border:0;outline:0;background:transparent;color:#374a44}.status-dot{width:9px;height:9px;border-radius:50%;background:#d8e0dd}.reservation.is-ready .status-dot{background:#46a46a}.load-more{margin:8px auto 0;padding:11px 18px;border:1px solid #d5dfdb;background:#fff;border-radius:10px;color:#315a4e;font-weight:700}.drawer-backdrop{position:fixed;inset:0;background:#071a154d;z-index:30;display:flex;justify-content:flex-end}.drawer{width:min(560px,96vw);height:100vh;background:#fbfcfb;color:#17221f;padding:0;overflow:auto;box-shadow:-20px 0 70px #071a1533}.drawer-header{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;gap:20px;padding:24px 26px;background:#fff;border-bottom:1px solid #e1e7e4}.drawer-header h2{margin:4px 0;font:800 22px Manrope;color:#173c32}.drawer-header p{margin:0;color:#71807b;font-size:12px}.drawer-kicker{font-size:10px;letter-spacing:.12em;font-weight:800;color:#72817c}.drawer-close{border:0;background:#f0f4f2;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:#53635e}.drawer-section{padding:22px 26px;border-bottom:1px solid #e4eae7}.drawer-section>label,.drawer-section label{font-size:11px;font-weight:800;color:#66746f;text-transform:uppercase;letter-spacing:.04em}.drawer-checks{display:flex;flex-wrap:wrap;gap:9px;margin-top:10px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.form-grid label{display:grid;gap:7px}.form-grid input,.drawer-section textarea{width:100%;border:1px solid #d8e2de;border-radius:9px;padding:10px;background:#fff;color:#17221f}.drawer-section textarea{min-height:110px;resize:vertical;margin-top:9px}.drawer-danger{padding:20px 26px;display:flex;justify-content:flex-end}.row-main{grid-template-columns:18px minmax(250px,1.3fr) minmax(260px,1.4fr) minmax(300px,1.3fr) 95px 18px}.reservation:hover{border-color:#c7d5d0;box-shadow:0 8px 26px #173c3210}.reservation-list{content-visibility:auto}
@media(max-width:900px){.toolbar{align-items:stretch;gap:10px;flex-direction:column}.toolbar-right{justify-content:space-between}.form-grid{grid-template-columns:1fr}.drawer{width:100vw}.row-main{grid-template-columns:14px 1fr auto}}
.progress-card{display:grid;grid-template-columns:1fr auto;gap:10px 20px;align-items:center;background:linear-gradient(135deg,#173c32,#28584b);color:#fff;border-radius:15px;padding:18px 20px;margin-bottom:14px;box-shadow:0 10px 28px #173c3218}.progress-card span{display:block;color:#cfe0da;font-size:12px;margin-bottom:4px}.progress-card strong{font:700 15px Manrope}.progress-value{font:800 26px Manrope}.progress-track{grid-column:1/-1;height:8px;background:#ffffff25;border-radius:999px;overflow:hidden}.progress-track span{height:100%;display:block;background:#8fd1a7;border-radius:999px;transition:width .25s ease;margin:0}.reservation.is-progress{border-left:4px solid #e1a33e}.reservation.is-todo{border-left:4px solid #d6dedb}.reservation.is-progress .status-dot{background:#e1a33e}.reservation.is-todo .status-dot{background:#c7d1cd}.state-pill{justify-self:end;border-radius:999px;padding:5px 8px;font-size:10px;font-weight:800;white-space:nowrap}.state-pill.ready{background:#e7f6ec;color:#277344}.state-pill.progress{background:#fff2de;color:#976100}.state-pill.todo{background:#eef2f0;color:#66746f}.row-main{grid-template-columns:18px minmax(245px,1.3fr) minmax(230px,1.2fr) minmax(280px,1.2fr) 95px 62px 18px}.call-select-wrap{margin-top:10px;display:flex;align-items:center;gap:10px;border:1px solid #d8e2de;border-radius:10px;background:#fff;padding:0 12px;color:#315a4e}.call-select-wrap select{width:100%;border:0;background:transparent;padding:12px 0;outline:0;color:#263a34;font-weight:700}.reservation-facts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:11px}.reservation-facts>div{display:grid;grid-template-columns:24px 1fr;column-gap:7px;align-items:center;background:#fff;border:1px solid #e1e7e4;border-radius:11px;padding:12px}.reservation-facts svg{grid-row:1/3;color:#57766c}.reservation-facts span{font-size:10px;color:#7a8883;text-transform:uppercase;letter-spacing:.04em}.reservation-facts strong{font-size:13px;color:#263a34;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.drawer-edit{border-bottom:1px solid #e4eae7;background:#f7f9f8}.drawer-edit summary{cursor:pointer;padding:15px 26px;font-size:12px;font-weight:800;color:#536b63}.drawer-edit[open] summary{border-bottom:1px solid #e4eae7}.drawer-edit .drawer-section{border:0}.import-summary{text-align:left}.summary-icon{width:52px;height:52px;display:grid;place-items:center;border-radius:15px;background:#e7f6ec;color:#277344;margin-bottom:16px}.summary-lines{display:grid;gap:10px;margin-top:19px}.summary-lines>div{display:flex;align-items:flex-start;gap:10px;background:#f6f8f7;border:1px solid #e1e7e4;border-radius:10px;padding:11px;color:#3d514a;font-size:13px}.summary-lines>div:last-child{background:#fff8ea;border-color:#eed5a4;color:#765110}.import-summary .modal-actions{justify-content:stretch}.import-summary .modal-actions .primary{width:100%}
@media(max-width:1250px){.row-main{grid-template-columns:18px 1.2fr 1fr 1.2fr 85px 58px 15px}}
@media(max-width:900px){.progress-card{margin-top:8px}.state-pill{grid-column:3}.reservation-facts{grid-template-columns:1fr}.row-main{grid-template-columns:14px 1fr auto}.badges{grid-column:2/4}}

/* V0.4 — suivi des appels directement depuis la liste */
.call-filter-panel{display:grid;grid-template-columns:auto 1fr;align-items:start;gap:14px;background:#fff;border:1px solid #e0e7e4;border-radius:13px;padding:12px 14px;margin-bottom:12px}.call-filter-heading{display:flex;align-items:center;gap:7px;color:#4e665e;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.055em;padding-top:8px;white-space:nowrap}.call-filter-bar{display:flex;flex-wrap:wrap;gap:7px}.call-filter-bar button{border:1px solid #dce4e1;background:#f8faf9;color:#5d6e68;border-radius:999px;padding:7px 10px;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;transition:.15s ease}.call-filter-bar button strong{min-width:20px;padding:2px 6px;border-radius:999px;background:#e9eeec;color:#53645e;font-size:10px}.call-filter-bar button:hover{border-color:#afc2bb;background:#fff}.call-filter-bar button.active{border-color:#557b6e;box-shadow:inset 0 0 0 1px #557b6e;background:#edf5f2;color:#234d40}.call-filter-bar button.orange.active{background:#fff0da;color:#8b5700;border-color:#dda33f;box-shadow:inset 0 0 0 1px #dda33f}.call-filter-bar button.purple.active{background:#f2ebfa;color:#69458e;border-color:#9f7aba;box-shadow:inset 0 0 0 1px #9f7aba}.call-filter-bar button.blue.active{background:#e8f2fa;color:#326785;border-color:#78a9c7;box-shadow:inset 0 0 0 1px #78a9c7}.call-filter-bar button.green.active{background:#e9f7ee;color:#277344;border-color:#74b68c;box-shadow:inset 0 0 0 1px #74b68c}.row-call-status{justify-self:stretch;min-width:142px;display:flex;align-items:center;gap:6px;border:1px solid #dbe3e0;border-radius:9px;padding:0 8px;background:#f7f9f8;color:#52665f;overflow:hidden}.row-call-status select{min-width:0;width:100%;border:0;outline:0;background:transparent;padding:8px 0;color:inherit;font-size:11px;font-weight:800;cursor:pointer}.row-call-status.orange{background:#fff3e2;border-color:#edc886;color:#885800}.row-call-status.purple{background:#f4edfa;border-color:#d3bee5;color:#68428b}.row-call-status.blue{background:#eaf4fb;border-color:#bad6e8;color:#2e6585}.row-call-status.green{background:#eaf7ee;border-color:#b7dfc4;color:#277344}.row-call-status.neutral{background:#f3f5f4;border-color:#d8dfdc;color:#53635e}.row-call-status.unset{background:#fbfcfb;color:#88938f}.row-main{grid-template-columns:18px minmax(230px,1.25fr) minmax(210px,1.05fr) minmax(270px,1.15fr) 90px 148px 58px 18px}.reservation{overflow:visible}.reservation-list{overflow:visible}
@media(max-width:1450px){.row-main{grid-template-columns:18px minmax(220px,1.2fr) minmax(190px,1fr) minmax(240px,1.1fr) 85px 135px 55px 15px}.row-call-status{min-width:130px}}
@media(max-width:1150px){.row-main{grid-template-columns:18px 1.25fr 1fr 1.1fr 130px 56px 15px}.due{display:none}.call-filter-panel{grid-template-columns:1fr}.call-filter-heading{padding-top:0}}
@media(max-width:900px){.row-call-status{grid-column:2/4;min-width:0}.call-filter-bar{flex-wrap:nowrap;overflow-x:auto;padding-bottom:3px}.call-filter-bar button{flex:0 0 auto}.call-filter-panel{padding:11px}.row-main{grid-template-columns:14px 1fr auto}}

/* UI refinement — compact, calm, Notion-inspired */
:root{--ink:#18332b;--muted:#71817b;--line:#e5ebe8;--soft:#f7f9f8;--green:#174b3d;--green-2:#236252;--shadow:0 8px 30px rgba(24,51,43,.06)}
body{background:#f6f8f7;color:var(--ink)}
.content{max-width:1460px;margin:0 auto;padding:28px 34px 54px}
header{align-items:flex-start;margin-bottom:16px}
header h1{font-size:28px;letter-spacing:-.035em}
.header-actions{gap:9px}
.header-actions button{min-height:40px;border-radius:10px}
.progress-card{padding:15px 18px;border-radius:13px;margin-bottom:12px;box-shadow:none;background:linear-gradient(135deg,#174b3d,#245f50)}
.progress-card span{font-size:11px}.progress-card strong{font-size:14px}.progress-value{font-size:24px}.progress-track{height:6px}
.stats{gap:10px;margin-bottom:12px}
.stats button{min-height:72px;padding:14px 16px;border-radius:12px;box-shadow:none;background:#fff;border:1px solid var(--line)}
.stats button:hover{transform:none;border-color:#cdd9d4}.stats button strong{font-size:22px}.stats button span{font-size:11px;color:var(--muted)}
.call-filter-panel{padding:10px 12px;border-radius:12px;box-shadow:none;margin-bottom:10px}
.call-filter-heading{padding-top:7px;font-size:10px}
.call-filter-bar{gap:6px}
.call-filter-bar button{padding:6px 9px;font-size:10px;background:#fff}
.call-filter-bar button strong{min-width:18px;padding:1px 5px}
.toolbar{background:transparent;border:0;padding:0;margin-bottom:10px}
.search{background:#fff;border:1px solid var(--line);border-radius:10px;height:40px}
.search input{font-size:12px}
.sort-control{height:40px;background:#fff;border-color:var(--line)}
.reservation-list{display:grid;gap:7px}
.reservation{border:1px solid var(--line);border-left:3px solid #d9e1de;border-radius:11px;background:#fff;box-shadow:none;transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease}
.reservation:hover{transform:translateY(-1px);border-color:#cbd7d2;box-shadow:var(--shadow)}
.reservation.is-ready{border-left-color:#3da66b}.reservation.is-progress{border-left-color:#e2a33d}.reservation.is-todo{border-left-color:#d7dfdc}
.row-main{min-height:62px;padding:9px 12px;grid-template-columns:10px minmax(235px,1.25fr) minmax(220px,1.05fr) minmax(250px,1.08fr) 92px minmax(124px,142px) 56px 16px;gap:14px}
.status-dot{width:7px;height:7px}
.avatar{width:34px;height:34px;border-radius:10px;background:#eef4f1;color:#315f52;font-size:10px}
.identity{gap:10px}.identity h2{font-size:12px;line-height:1.25;margin-bottom:3px;letter-spacing:-.01em}.identity p{font-size:10px;color:#7a8984;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:235px}
.stay{font-size:10.5px;gap:4px;color:#52645e;min-width:0}.stay span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.stay svg{flex:0 0 auto}
.badges{gap:5px;min-width:0;flex-wrap:nowrap}.quick-check{height:28px;padding:0 8px;border-radius:8px;font-size:9.5px;gap:4px;white-space:nowrap}.quick-check svg{width:12px;height:12px}
.due{font-size:10px}.due strong{font-size:11px}.due small{font-size:8px}
.row-call-status{min-width:0;width:100%;height:32px;border-radius:8px;padding:0 7px}.row-call-status select{font-size:10px;padding:7px 0;text-overflow:ellipsis}.row-call-status svg{flex:0 0 auto}
.state-pill{font-size:9px;padding:5px 7px;min-width:52px;text-align:center}
.drawer{width:min(520px,96vw)}.drawer-header{padding:22px 24px}.drawer-section{padding:20px 24px}.reservation-facts>div{padding:11px}.drawer-checks .quick-check{height:34px;font-size:11px;padding:0 11px}
@media(max-width:1280px){.content{padding:24px 22px}.row-main{grid-template-columns:10px minmax(210px,1.2fr) minmax(185px,.95fr) minmax(220px,1.05fr) 82px minmax(116px,128px) 52px 14px;gap:10px}.quick-check{padding:0 6px}.identity p{max-width:205px}}
@media(max-width:1080px){.badges .quick-check span{display:none}.quick-check{width:30px;justify-content:center}.row-main{grid-template-columns:10px 1.25fr 1fr 112px 52px 14px}.due{display:none}.row-call-status{min-width:0}.state-pill{min-width:48px}}

/* V0.5 — lisibilité renforcée et micro-interactions */
:root{
  --page:#f5f7f6;
  --surface:#ffffff;
  --surface-hover:#fbfcfc;
  --ink:#1d2f2a;
  --muted:#687a74;
  --line:#dde6e2;
  --line-strong:#c9d7d1;
  --brand:#174b3d;
  --brand-soft:#e9f3ef;
  --shadow-soft:0 8px 24px rgba(22,55,45,.07);
  --shadow-float:0 14px 38px rgba(22,55,45,.12);
}
html{font-size:16px}
body{background:var(--page);color:var(--ink);font-size:14px;line-height:1.45}
button,input,select,textarea{font:inherit}
button,select,.row-main,.quick-check{transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease,opacity .18s ease}
button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid rgba(46,117,95,.18);outline-offset:2px}

.content{max-width:1540px;padding:30px 36px 60px}
header{margin-bottom:20px;gap:18px}
header h1{font-size:30px;line-height:1.12;letter-spacing:-.035em}
header>div>p:last-child{font-size:13px;color:var(--muted);margin-top:7px}
.eyebrow{font-size:11px;letter-spacing:.09em;margin-bottom:7px}
.header-actions{flex-wrap:wrap;justify-content:flex-end}
.header-actions button{min-height:42px;padding:0 14px;font-size:13px;font-weight:750;box-shadow:0 1px 2px rgba(22,55,45,.04)}
.header-actions button:hover{transform:translateY(-1px);box-shadow:var(--shadow-soft)}

.progress-card{padding:18px 20px;margin-bottom:14px;border-radius:15px;box-shadow:0 8px 24px rgba(23,75,61,.12)}
.progress-card span{font-size:12px;opacity:.82}
.progress-card strong{font-size:15px;margin-top:3px}
.progress-value{font-size:28px}
.progress-track{height:7px;margin-top:4px}

.stats{gap:11px;margin-bottom:14px}
.stats button{min-height:78px;padding:15px 18px;border-radius:13px}
.stats button:hover{transform:translateY(-1px);border-color:var(--line-strong);box-shadow:var(--shadow-soft)}
.stats button.selected{box-shadow:inset 0 0 0 1px currentColor,var(--shadow-soft)}
.stats button strong{font-size:24px;line-height:1}
.stats button span{font-size:12px;margin-top:7px}

.call-filter-panel{padding:12px 14px;margin-bottom:12px;border-radius:13px}
.call-filter-heading{font-size:11px;padding-top:8px}
.call-filter-bar{gap:7px}
.call-filter-bar button{min-height:32px;padding:6px 11px;font-size:11.5px;background:#fff}
.call-filter-bar button:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(22,55,45,.06)}
.call-filter-bar button strong{font-size:10.5px;min-width:21px;padding:2px 6px}

.toolbar{margin-bottom:12px;gap:12px}
.search{height:43px;border-radius:11px;box-shadow:0 1px 2px rgba(22,55,45,.03)}
.search:focus-within{border-color:#8eb1a5;box-shadow:0 0 0 3px rgba(46,117,95,.10)}
.search input{font-size:13px}
.sort-control{height:43px;border-radius:11px;font-size:12.5px}
.toolbar-right>span{font-size:12px;color:var(--muted);white-space:nowrap}

.reservation-list{gap:9px}
.reservation{border-radius:12px;border-left-width:4px;animation:row-enter .24s ease both;transform-origin:center top}
.reservation:hover{background:var(--surface-hover);transform:translateY(-2px);border-color:var(--line-strong);box-shadow:var(--shadow-float)}
.row-main{min-height:72px;padding:12px 14px;grid-template-columns:10px minmax(250px,1.28fr) minmax(225px,1.05fr) minmax(286px,1.15fr) 98px minmax(154px,174px) 62px 18px;gap:15px;cursor:pointer}
.status-dot{width:8px;height:8px;box-shadow:0 0 0 4px rgba(60,91,81,.08)}
.identity{gap:12px;min-width:0}
.avatar{width:38px;height:38px;border-radius:11px;font-size:11px;font-weight:800;flex:0 0 auto}
.identity h2{font-size:13.5px;line-height:1.3;margin-bottom:4px;letter-spacing:-.012em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.identity h2 em{font-size:9.5px;margin-left:7px;padding:3px 6px;border-radius:999px}
.identity p{font-size:11.5px;max-width:270px;line-height:1.25}
.identity p svg{width:13px;height:13px}
.stay{font-size:12px;gap:6px;line-height:1.3}
.stay svg{width:15px;height:15px}
.badges{gap:6px}
.quick-check{height:32px;padding:0 10px;border-radius:9px;font-size:11px;font-weight:750;letter-spacing:-.01em}
.quick-check:hover{transform:translateY(-1px);box-shadow:0 5px 12px rgba(22,55,45,.07)}
.quick-check svg{width:13px;height:13px}
.due{font-size:11px;line-height:1.15}
.due strong{font-size:12px}
.due small{font-size:9px;margin-top:2px}
.row-call-status{height:36px;min-width:0;padding:0 9px;border-radius:9px;overflow:hidden}
.row-call-status select{font-size:11.5px;font-weight:800;padding:9px 18px 9px 0;white-space:nowrap;text-overflow:ellipsis}
.row-call-status svg{width:14px;height:14px}
.state-pill{font-size:10px;padding:6px 8px;min-width:58px}
.load-more{min-height:44px;font-size:12.5px;border-radius:11px}

.drawer-backdrop{animation:fade-in .18s ease both;background:rgba(18,35,29,.32);backdrop-filter:blur(3px)}
.drawer{width:min(550px,96vw);animation:drawer-in .24s cubic-bezier(.2,.8,.2,1) both;box-shadow:-18px 0 55px rgba(14,38,30,.18)}
.drawer-header{padding:25px 27px}
.drawer-header h2{font-size:22px;letter-spacing:-.025em}
.drawer-header p{font-size:12px;margin-top:5px}
.drawer-section{padding:22px 27px}
.drawer-section>label{font-size:11px;letter-spacing:.055em}
.drawer-checks{gap:8px}
.drawer-checks .quick-check{height:38px;font-size:12px;padding:0 13px}
.call-select-wrap{border-radius:11px}
.call-select-wrap select{font-size:13px}
.reservation-facts>div{padding:13px;border-radius:12px}
.reservation-facts span{font-size:10.5px}
.reservation-facts strong{font-size:13.5px}
.drawer textarea,.drawer input{font-size:13px}

aside .logo strong{font-size:14px}
aside .logo span,.session-title,.aside-bottom{font-size:11px}
.session-list button,aside nav button{font-size:12.5px;min-height:38px}
.connection{font-size:10.5px}

@keyframes row-enter{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes drawer-in{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}

@media(max-width:1380px){
  .content{padding:26px 24px 54px}
  .row-main{grid-template-columns:10px minmax(225px,1.22fr) minmax(195px,.98fr) minmax(245px,1.08fr) 88px minmax(142px,158px) 58px 16px;gap:11px}
  .identity p{max-width:225px}
  .quick-check{padding:0 8px;font-size:10.5px}
}
@media(max-width:1160px){
  .row-main{grid-template-columns:10px minmax(235px,1.25fr) minmax(205px,1fr) minmax(260px,1.1fr) minmax(142px,158px) 58px 16px}
  .due{display:none}
  .badges .quick-check span{display:none}
  .quick-check{width:32px;padding:0;justify-content:center}
}
@media(max-width:900px){
  .content{padding:20px 14px 40px}
  header{align-items:stretch}.header-actions{justify-content:flex-start}
  .stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .call-filter-bar{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px}
  .row-main{grid-template-columns:10px minmax(0,1fr) auto;padding:12px;gap:10px}
  .stay,.badges,.row-call-status{grid-column:2/4}
  .state-pill{grid-column:3;grid-row:1}
  .stay{font-size:11.5px}.badges .quick-check span{display:inline}.quick-check{width:auto;padding:0 9px}
}

/* V0.6 — finition premium Back Office */
.app-shell::before{content:"";position:fixed;inset:0 0 auto 240px;height:220px;pointer-events:none;background:radial-gradient(circle at 72% -30%,rgba(44,125,99,.10),transparent 58%);z-index:-1}
.content{animation:content-in .42s cubic-bezier(.2,.8,.2,1) both}
header{position:relative}
header::after{content:"";position:absolute;left:0;right:0;bottom:-11px;height:1px;background:linear-gradient(90deg,var(--line),transparent 78%)}
.progress-card{position:relative;overflow:hidden;isolation:isolate}
.progress-card::after{content:"";position:absolute;inset:-70% auto -70% -18%;width:38%;transform:rotate(16deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);animation:progress-shine 7s ease-in-out infinite;z-index:-1}
.stats button{position:relative;overflow:hidden}
.stats button::after{content:"";position:absolute;inset:auto 14px 0;height:2px;border-radius:99px;background:currentColor;opacity:0;transform:scaleX(.4);transition:opacity .2s ease,transform .25s ease}
.stats button.selected::after{opacity:.55;transform:scaleX(1)}
.call-filter-panel,.toolbar{animation:section-rise .35s ease both}
.toolbar{position:sticky;top:10px;z-index:8;padding:8px;border:1px solid rgba(221,230,226,.82);border-radius:14px;background:rgba(245,247,246,.82);backdrop-filter:blur(14px);box-shadow:0 7px 22px rgba(24,61,50,.06)}
.reservation{position:relative;overflow:visible;will-change:transform}
.reservation::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;box-shadow:inset 0 1px rgba(255,255,255,.75);opacity:.8}
.reservation:hover .row-chevron{opacity:1;transform:translateX(2px)}
.reservation:hover .avatar{transform:scale(1.04);background:#e6f1ed}
.avatar{transition:transform .2s ease,background-color .2s ease}
.row-main{grid-template-columns:10px minmax(250px,1.24fr) minmax(245px,1.12fr) minmax(286px,1.13fr) 98px minmax(154px,174px) 62px 18px 18px}
.stay{display:grid;grid-template-columns:minmax(0,1fr);gap:5px}
.row-chevron{opacity:.35;color:#80918b;transition:opacity .18s ease,transform .18s ease}
.row-saving{position:absolute;right:8px;top:8px;color:#2e755f}
.quick-check{position:relative;overflow:hidden}
.quick-check::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 25%,rgba(255,255,255,.65) 48%,transparent 72%);transform:translateX(-130%);transition:transform .45s ease}
.quick-check:hover::after{transform:translateX(130%)}
.quick-check:active{transform:translateY(0) scale(.97)}
.state-pill{box-shadow:inset 0 0 0 1px rgba(255,255,255,.6)}
.drawer-section{animation:drawer-section-in .35s ease both}
.drawer-section:nth-of-type(2){animation-delay:.04s}.drawer-section:nth-of-type(3){animation-delay:.08s}.drawer-section:nth-of-type(4){animation-delay:.12s}
.reservation-facts{grid-template-columns:repeat(2,minmax(0,1fr))}
.reservation-facts>div{transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.reservation-facts>div:hover{transform:translateY(-1px);border-color:var(--line-strong);box-shadow:0 7px 18px rgba(22,55,45,.06)}
.modal{animation:modal-pop .22s cubic-bezier(.2,.8,.2,1) both}
@keyframes content-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes section-rise{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes drawer-section-in{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}
@keyframes modal-pop{from{opacity:0;transform:translateY(8px) scale(.985)}to{opacity:1;transform:none}}
@keyframes progress-shine{0%,62%{transform:translateX(-120%) rotate(16deg)}82%,100%{transform:translateX(430%) rotate(16deg)}}
@media(max-width:1380px){.row-main{grid-template-columns:10px minmax(225px,1.2fr) minmax(220px,1.05fr) minmax(245px,1.08fr) 88px minmax(142px,158px) 58px 16px 16px}}
@media(max-width:1160px){.row-main{grid-template-columns:10px minmax(235px,1.25fr) minmax(220px,1fr) minmax(260px,1.1fr) minmax(142px,158px) 58px 16px 16px}}
@media(max-width:900px){.app-shell::before{left:0}.toolbar{top:6px}.row-main{grid-template-columns:10px minmax(0,1fr) auto 16px}.row-chevron{grid-column:4;grid-row:1}.stay,.badges,.row-call-status{grid-column:2/5}.state-pill{grid-column:3;grid-row:1}.reservation-facts{grid-template-columns:1fr}}

/* Menu de statut personnalisé — évite le menu gris natif du navigateur */
.custom-call-select{position:relative;padding:0;overflow:visible;z-index:2}
.custom-call-select.is-open{z-index:40;box-shadow:0 0 0 3px rgba(62,122,101,.11)}
.call-status-trigger{width:100%;height:100%;display:grid;grid-template-columns:14px minmax(0,1fr) 14px;align-items:center;gap:7px;padding:0 9px;border:0;background:transparent;color:inherit;font:800 11.5px 'DM Sans',sans-serif;text-align:left;cursor:pointer}
.call-status-trigger span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.call-status-chevron{transition:transform .18s ease;opacity:.7}
.custom-call-select.is-open .call-status-chevron{transform:rotate(180deg)}
.call-status-menu{position:absolute;top:calc(100% + 7px);left:-1px;width:max(175px,100%);padding:6px;background:rgba(255,255,255,.98);border:1px solid #dce5e1;border-radius:11px;box-shadow:0 16px 40px rgba(17,48,38,.18),0 3px 10px rgba(17,48,38,.08);backdrop-filter:blur(14px);animation:call-menu-in .16s cubic-bezier(.2,.8,.2,1) both}
.call-status-menu button{width:100%;min-height:34px;display:grid;grid-template-columns:10px minmax(0,1fr) 15px;align-items:center;gap:9px;padding:7px 9px;border:0;border-radius:8px;background:transparent;color:#40524c;font:700 11.5px 'DM Sans',sans-serif;text-align:left;transition:background-color .14s ease,color .14s ease,transform .14s ease}
.call-status-menu button:hover{background:#f1f5f3;color:#193e32;transform:translateX(1px)}
.call-status-menu button.selected{background:#edf4f1;color:#173f33}
.call-status-menu button.purple:hover,.call-status-menu button.purple.selected{background:#f3ecf9;color:#68428b}
.call-status-menu button.orange:hover,.call-status-menu button.orange.selected{background:#fff2df;color:#885800}
.call-status-menu button.blue:hover,.call-status-menu button.blue.selected{background:#eaf4fb;color:#2e6585}
.call-status-menu button.green:hover,.call-status-menu button.green.selected{background:#eaf7ee;color:#277344}
.call-option-dot{width:8px;height:8px;border-radius:50%;background:#b8c4c0;box-shadow:0 0 0 3px rgba(184,196,192,.18)}
.call-option-dot.purple{background:#9470b4;box-shadow:0 0 0 3px rgba(148,112,180,.14)}
.call-option-dot.orange{background:#d7962e;box-shadow:0 0 0 3px rgba(215,150,46,.14)}
.call-option-dot.blue{background:#5794b8;box-shadow:0 0 0 3px rgba(87,148,184,.14)}
.call-option-dot.green{background:#4b9b68;box-shadow:0 0 0 3px rgba(75,155,104,.14)}
.call-option-dot.unset{background:#c4ceca}
@keyframes call-menu-in{from{opacity:0;transform:translateY(-5px) scale(.98)}to{opacity:1;transform:none}}

/* Corrige l'empilement du menu de statut au-dessus des lignes suivantes */
.reservation-list{content-visibility:visible;overflow:visible}
.reservation{z-index:1}
.reservation.has-open-call-menu{z-index:100}
.reservation.has-open-call-menu:hover{z-index:100}
.call-status-menu{z-index:110}

/* Front Office */
.front-shell .content { background: #f5f7f6; }
.front-workspace { display: grid; gap: 16px; min-width: 0; animation: frontFadeIn .35s ease both; }
.front-hero { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 18px; border: 1px solid #dbe5e1; border-radius: 14px; background: rgba(255,255,255,.9); box-shadow: 0 10px 28px rgba(20,61,50,.06); }
.front-hero > div:first-child { display: grid; gap: 3px; }
.front-hero span { color: #71817b; font-size: 12px; font-weight: 700; }
.front-hero strong { color: #183e34; font-size: 15px; }
.front-search { width: min(420px, 48%); display: flex; align-items: center; gap: 10px; padding: 0 13px; border: 1px solid #d6e0dc; border-radius: 10px; background: #fff; transition: .2s ease; }
.front-search:focus-within { border-color: #72a693; box-shadow: 0 0 0 3px rgba(63,128,105,.1); }
.front-search input { width: 100%; height: 42px; border: 0; outline: 0; background: transparent; font: inherit; }
.front-setup-warning { display: flex; align-items: flex-start; gap: 12px; padding: 13px 15px; border: 1px solid #efd9a4; border-radius: 12px; color: #725719; background: #fffaf0; }
.front-setup-warning > div { display: grid; gap: 3px; }
.front-setup-warning strong { font-size: 13px; }
.front-setup-warning span { font-size: 12px; }
.front-setup-warning code { padding: 2px 5px; border-radius: 5px; background: rgba(114,87,25,.08); }
.front-boards { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 16px; align-items: start; }
.front-board { min-width: 0; border: 1px solid #dce5e1; border-radius: 15px; background: #fff; box-shadow: 0 12px 34px rgba(25,63,52,.06); overflow: hidden; }
.front-board > header { display: flex; justify-content: space-between; align-items: center; padding: 16px 17px; border-bottom: 1px solid #e5ebe8; background: linear-gradient(180deg,#fff,#fafcfb); }
.front-board > header > div { display: flex; align-items: center; gap: 10px; min-width: 0; }
.front-board-dot { width: 10px; height: 10px; flex: 0 0 auto; border-radius: 999px; box-shadow: 0 0 0 5px rgba(50,134,103,.1); background: #328667; }
.front-board.pending .front-board-dot { box-shadow: 0 0 0 5px rgba(207,139,38,.1); background: #cf8b26; }
.front-board h2 { margin: 0; color: #193f35; font-size: 17px; }
.front-board p { margin: 2px 0 0; color: #7b8984; font-size: 11px; }
.front-board > header > strong { display: grid; place-items: center; min-width: 34px; height: 28px; padding: 0 9px; border-radius: 999px; color: #24684f; background: #eaf5f0; font-size: 13px; }
.front-board.pending > header > strong { color: #8a5b13; background: #fff3dd; }
.front-board-columns { display: grid; grid-template-columns: minmax(180px, .72fr) minmax(330px, 1.28fr); gap: 14px; padding: 9px 16px; border-bottom: 1px solid #edf1ef; color: #84908c; background: #fbfcfc; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
.front-board-list { max-height: calc(100vh - 285px); overflow: auto; scrollbar-width: thin; }
.front-row { display: grid; grid-template-columns: minmax(180px, .72fr) minmax(330px, 1.28fr); gap: 14px; align-items: center; min-height: 92px; padding: 12px 15px; border-bottom: 1px solid #edf1ef; transition: background .18s ease, transform .18s ease, box-shadow .18s ease; animation: frontRowIn .28s ease both; }
.front-row:hover { position: relative; z-index: 1; background: #fbfdfc; box-shadow: inset 3px 0 #8bbcab; }
.front-client { display: flex; align-items: center; gap: 10px; min-width: 0; }
.front-client .avatar { flex: 0 0 auto; }
.front-client > div:last-child { min-width: 0; }
.front-client h3 { margin: 0; overflow: hidden; color: #263d36; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.front-client p,.front-client span { display: flex; align-items: center; gap: 4px; margin: 3px 0 0; overflow: hidden; color: #7a8883; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.front-checks { display: grid; grid-template-columns: repeat(3,minmax(92px,1fr)); gap: 6px; }
.front-check { position: relative; display: flex; align-items: center; gap: 6px; min-width: 0; height: 32px; padding: 0 9px; border: 1px solid #dbe3e0; border-radius: 9px; color: #687872; background: #f8faf9; font: inherit; font-size: 10px; font-weight: 700; cursor: pointer; transition: transform .15s ease,border-color .15s ease,background .15s ease,color .15s ease,box-shadow .15s ease; }
.front-check:hover:not(:disabled) { transform: translateY(-1px); border-color: #9bbdaf; color: #2d6652; background: #fff; box-shadow: 0 5px 12px rgba(30,78,62,.08); }
.front-check.checked { border-color: #8ec0ad; color: #22684f; background: #eaf6f1; }
.front-check.clean { border-color: #cfdad6; background: #fff; }
.front-check.clean.checked { border-color: #82b9a4; background: linear-gradient(135deg,#e7f6f0,#f5fbf8); }
.front-check:disabled { cursor: default; opacity: .72; }
.front-check span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.front-check-tick { margin-left: auto; flex: 0 0 auto; }
.front-empty { padding: 34px 20px; color: #87938f; text-align: center; font-size: 12px; }
@keyframes frontFadeIn { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:none } }
@keyframes frontRowIn { from { opacity:0; transform:translateY(3px) } to { opacity:1; transform:none } }
@media (max-width: 1350px) { .front-boards { grid-template-columns: 1fr; } .front-board-list { max-height: 540px; } }
@media (max-width: 850px) { .front-hero { align-items: stretch; flex-direction: column; } .front-search { width: 100%; } .front-board-columns { display:none; } .front-row { grid-template-columns: 1fr; } .front-checks { grid-template-columns: repeat(3,minmax(0,1fr)); } }
.front-board-actions { display:flex; align-items:center; gap:9px; }
.front-board-actions > button { display:flex; align-items:center; gap:6px; height:30px; padding:0 10px; border:1px solid #d5e0dc; border-radius:8px; color:#4f6760; background:#fff; font:inherit; font-size:10px; font-weight:800; cursor:pointer; transition:.18s ease; }
.front-board-actions > button:hover:not(:disabled) { transform:translateY(-1px); border-color:#86ad9e; color:#225d49; box-shadow:0 5px 13px rgba(28,72,58,.09); }
.front-board-actions > button:disabled { opacity:.45; cursor:default; }
.front-board-actions > strong { display:grid; place-items:center; min-width:34px; height:28px; padding:0 9px; border-radius:999px; color:#24684f; background:#eaf5f0; font-size:13px; }
.front-board.pending .front-board-actions > strong { color:#8a5b13; background:#fff3dd; }
.front-preparation { display:grid; grid-template-columns:minmax(145px,.55fr) minmax(0,1.45fr); gap:7px; align-items:center; }
.clean-status { display:grid; grid-template-columns:auto 1fr; grid-template-rows:auto auto; column-gap:7px; align-items:center; min-width:0; height:70px; padding:9px 10px; border:1px solid #dce4e1; border-radius:10px; color:#65756f; background:#f8faf9; }
.clean-status svg { grid-row:1/3; }
.clean-status span { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; }
.clean-status strong { overflow:hidden; font-size:11px; color:#53645e; text-overflow:ellipsis; white-space:nowrap; }
.clean-status.propre { border-color:#9fcbb9; color:#277258; background:#eaf7f1; }
.clean-status.propre strong { color:#1d674c; }
.clean-status.a_controler { border-color:#e5c986; color:#9a6917; background:#fff8e7; }
.clean-status.a_controler strong { color:#835810; }
.clean-status.en_cours { border-color:#a9c9dc; color:#397493; background:#edf7fc; }
.clean-status.en_cours strong { color:#326780; }
.clean-status.non_propre { border-color:#e4aaa5; color:#a64f48; background:#fff0ef; }
.clean-status.non_propre strong { color:#923f39; }
.front-preparation .front-checks { grid-template-columns:repeat(3,minmax(82px,1fr)); }
@media (max-width:850px){.front-preparation{grid-template-columns:1fr}.clean-status{height:auto;grid-template-columns:auto auto 1fr;grid-template-rows:1fr}.clean-status svg{grid-row:auto}.front-board-actions>button span{display:none}}

/* Répartition compacte et colorée des statuts d'appel */
.call-filter-bar button.all-status{background:#f7f9f8;border-color:#d9e2de;color:#4f635c}
.call-filter-bar button.all-status strong{background:#e8eeeb;color:#4c5f58}
.call-filter-bar button.amber{background:#fff8e9;border-color:#efd89f;color:#855d0d}
.call-filter-bar button.amber strong{background:#f8e8bb;color:#75500a}
.call-filter-bar button.purple{background:#f8f3fc;border-color:#decdea;color:#6d4b8c}
.call-filter-bar button.purple strong{background:#eadff3;color:#62407f}
.call-filter-bar button.orange{background:#fff3ea;border-color:#efc8ad;color:#945526}
.call-filter-bar button.orange strong{background:#f8dfce;color:#83481e}
.call-filter-bar button.blue{background:#eef7fc;border-color:#c8e0ee;color:#356d8b}
.call-filter-bar button.blue strong{background:#dbeef8;color:#2f627d}
.call-filter-bar button.green{background:#eef8f1;border-color:#c8e4d1;color:#2f7548}
.call-filter-bar button.green strong{background:#dcefe2;color:#28653d}
.call-filter-bar button.amber:hover{border-color:#d8b65b;background:#fff3d6}
.call-filter-bar button.purple:hover{border-color:#b999d0;background:#f3eafa}
.call-filter-bar button.orange:hover{border-color:#db9d73;background:#ffeadc}
.call-filter-bar button.blue:hover{border-color:#91bfd7;background:#e5f3fa}
.call-filter-bar button.green:hover{border-color:#91c7a2;background:#e5f4ea}
.call-filter-bar button.amber.active{background:#e9b949;color:#493400;border-color:#d6a42f;box-shadow:0 5px 14px rgba(176,126,20,.18)}
.call-filter-bar button.amber.active strong{background:rgba(255,255,255,.48);color:#493400}
.call-filter-bar button.purple.active{background:#9d78ba;color:#fff;border-color:#8c67aa;box-shadow:0 5px 14px rgba(105,69,142,.18)}
.call-filter-bar button.purple.active strong{background:rgba(255,255,255,.2);color:#fff}
.call-filter-bar button.orange.active{background:#dc8a4e;color:#fff;border-color:#ca783d;box-shadow:0 5px 14px rgba(148,85,38,.18)}
.call-filter-bar button.orange.active strong{background:rgba(255,255,255,.2);color:#fff}
.call-filter-bar button.blue.active{background:#5c9ec1;color:#fff;border-color:#4c8eaf;box-shadow:0 5px 14px rgba(53,109,139,.18)}
.call-filter-bar button.blue.active strong{background:rgba(255,255,255,.2);color:#fff}
.call-filter-bar button.green.active{background:#4f9b68;color:#fff;border-color:#428b5a;box-shadow:0 5px 14px rgba(47,117,72,.18)}
.call-filter-bar button.green.active strong{background:rgba(255,255,255,.2);color:#fff}
.row-call-status.amber{background:#fff7e6;border-color:#ead39a;color:#805a0c}
.call-status-menu button.amber{color:#805a0c}

/* Filtres métier façon Excel */
.work-filter-wrap{position:relative}
.work-filter-trigger{height:43px;display:inline-flex;align-items:center;gap:7px;border:1px solid #dce4e1;border-radius:11px;padding:0 11px;background:#fff;color:#40564f;font-size:12px;font-weight:750;transition:.16s ease;white-space:nowrap}
.work-filter-trigger:hover,.work-filter-trigger.active{border-color:#7fa093;background:#f2f7f5;box-shadow:0 5px 16px rgba(22,55,45,.08)}
.work-filter-trigger strong{display:grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#245c4c;color:#fff;font-size:10px}
.work-filter-menu{position:absolute;right:0;top:calc(100% + 8px);z-index:80;width:300px;padding:12px;background:rgba(255,255,255,.99);border:1px solid #dce5e1;border-radius:13px;box-shadow:0 20px 48px rgba(17,48,38,.18),0 4px 12px rgba(17,48,38,.07);animation:call-menu-in .16s cubic-bezier(.2,.8,.2,1) both}
.work-filter-title{display:flex;align-items:center;justify-content:space-between;padding:2px 2px 10px;border-bottom:1px solid #edf1ef}
.work-filter-title span{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.055em;color:#52675f}
.work-filter-title button{border:0;background:transparent;color:#73827d;font-size:10.5px;padding:3px}
.work-filter-title button:hover{color:#245c4c}
.work-filter-group{display:grid;grid-template-columns:95px 1fr;align-items:center;gap:8px;padding:10px 2px;border-bottom:1px solid #f0f3f2}
.work-filter-group:last-child{border-bottom:0;padding-bottom:2px}
.work-filter-group>span{font-size:11.5px;font-weight:750;color:#40564f}
.work-filter-group>div{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.work-filter-group button{min-height:33px;display:flex;align-items:center;justify-content:center;gap:5px;border:1px solid #dce4e1;border-radius:8px;background:#f8faf9;color:#61716c;font-size:11px;font-weight:700;transition:.14s ease}
.work-filter-group button:hover{border-color:#a9bdb5;background:#fff}
.work-filter-group button.selected.todo{background:#fff3df;border-color:#dfb86d;color:#855a0a}
.work-filter-group button.selected.done{background:#eaf6ee;border-color:#8dc09e;color:#286b42}
.active-work-filters{display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin:-3px 0 11px;padding:0 3px;animation:section-rise .2s ease both}
.active-work-filters button{display:inline-flex;align-items:center;gap:6px;border:1px solid #cbd9d4;border-radius:999px;background:#fff;color:#40564f;padding:6px 9px;font-size:10.8px;font-weight:700;transition:.14s ease}
.active-work-filters button:hover{border-color:#8ca99f;background:#f3f8f6}
.active-work-filters button.clear-all{border-color:transparent;background:transparent;color:#71817b;font-weight:650}
@media(max-width:900px){.work-filter-menu{right:auto;left:0;width:min(300px,calc(100vw - 28px))}.toolbar-right{flex-wrap:wrap}.active-work-filters{overflow-x:auto;flex-wrap:nowrap;padding-bottom:3px}.active-work-filters button{flex:0 0 auto}}

/* Mise à jour des états de logement — Front Office */
.front-hero-actions { display:flex; align-items:center; gap:10px; min-width:0; }
.front-clean-import { display:inline-flex; align-items:center; justify-content:center; gap:7px; min-height:40px; padding:0 13px; border:1px solid #bfd5cb; border-radius:10px; color:#24664e; background:#f4faf7; font-size:12px; font-weight:750; white-space:nowrap; cursor:pointer; transition:transform .16s ease, box-shadow .16s ease, border-color .16s ease, background .16s ease; }
.front-clean-import:hover:not(:disabled) { transform:translateY(-1px); border-color:#83b49f; background:#eaf6f0; box-shadow:0 5px 16px rgba(37,91,69,.10); }
.front-clean-import:disabled { opacity:.55; cursor:not-allowed; }
.clean-status.clean, .clean-status.propre { border-color:#9fcbb9; color:#277258; background:#eaf7f1; }
.clean-status.clean strong, .clean-status.propre strong { color:#1d674c; }
.clean-status.to_be_cleaned, .clean-status.non_propre { border-color:#e4aaa5; color:#a64f48; background:#fff0ef; }
.clean-status.to_be_cleaned strong, .clean-status.non_propre strong { color:#923f39; }
.clean-status.in_progress, .clean-status.en_cours { border-color:#a9c9dc; color:#397493; background:#edf7fc; }
.clean-status.in_progress strong, .clean-status.en_cours strong { color:#326780; }
.clean-status.postponed { border-color:#c8b7dc; color:#76568f; background:#f6f0fb; }
.clean-status.postponed strong { color:#68467f; }
.clean-status.to_be_checked, .clean-status.a_controler { border-color:#e5c986; color:#9a6917; background:#fff8e7; }
.clean-status.to_be_checked strong, .clean-status.a_controler strong { color:#835810; }
.clean-status.touch_up { border-color:#e4b8cf; color:#975477; background:#fff2f8; }
.clean-status.touch_up strong { color:#864568; }
@media (max-width:1100px){.front-hero{align-items:stretch}.front-hero-actions{flex-wrap:wrap}.front-clean-import{flex:1}.front-search{flex:1 1 280px}}

/* Suivi des changements Clean, tri et impression Front Office */
.front-track-toggle,.front-clear-changes{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:0 12px;border:1px solid #d1ddd8;border-radius:10px;background:#fff;color:#52665f;font:inherit;font-size:11.5px;font-weight:750;cursor:pointer;white-space:nowrap;transition:.16s ease}
.front-track-toggle:hover,.front-track-toggle.active{border-color:#8eb2a3;background:#edf7f2;color:#24664e;box-shadow:0 5px 15px rgba(37,91,69,.08)}
.front-clear-changes{border-color:#dfc68d;background:#fff8e9;color:#855d13}
.front-sort{display:flex;align-items:center;gap:7px;min-height:40px;padding:0 10px;border:1px solid #d7e1dd;border-radius:10px;background:#fff;color:#52665f}
.front-sort select{border:0;outline:0;background:transparent;color:inherit;font:inherit;font-size:11.5px;font-weight:750;cursor:pointer}
.front-tracking-info{display:flex;align-items:center;gap:8px;margin:0 0 12px;padding:10px 12px;border:1px solid #bdd8cc;border-radius:10px;background:#f0f8f4;color:#386b57;font-size:11.5px;font-weight:650}
.front-row.clean-changed{border-color:#e2b457;background:linear-gradient(90deg,#fffaf0 0,#fff 18%);box-shadow:inset 3px 0 0 #e2b457}
.clean-change-badge{display:inline-flex;align-items:center;gap:4px;margin-left:7px;padding:3px 6px;border-radius:999px;background:#fff0c9;color:#875e0e;font-size:8.5px;font-weight:850;letter-spacing:.02em;vertical-align:middle}
.front-print-wrap{position:relative}
.front-print-options{position:absolute;right:0;top:calc(100% + 8px);z-index:100;width:235px;padding:12px;border:1px solid #d8e2de;border-radius:12px;background:#fff;box-shadow:0 18px 45px rgba(19,54,43,.18);display:grid;gap:8px}
.front-print-options>strong{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#486058}
.front-print-options>label:not(.print-check){display:grid;grid-template-columns:60px 1fr;align-items:center;gap:8px;font-size:11px;font-weight:700;color:#566a63}
.front-print-options select{height:32px;border:1px solid #d7e1dd;border-radius:8px;padding:0 7px;background:#f9fbfa;color:#40564f;font:inherit;font-size:11px}
.front-print-options .print-check{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:650;color:#4e625b}
.front-print-options input{accent-color:#24664e}
.front-print-options .print-confirm{display:flex;align-items:center;justify-content:center;gap:6px;min-height:34px;margin-top:3px;border:0;border-radius:8px;background:#245c4c;color:#fff;font:inherit;font-size:11px;font-weight:800;cursor:pointer}
@media(max-width:1100px){.front-sort{flex:1}.front-track-toggle,.front-clear-changes{flex:1}}

/* Contrôle journée Front Office */
.front-changes-summary{display:inline-flex;align-items:center;gap:7px;padding:9px 11px;border-radius:10px;background:#fff3da;color:#8a5b00;font-size:12px;font-weight:800;border:1px solid #efd59b}
.day-check-workspace{display:grid;gap:14px}
.day-check-hero{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:20px 22px;background:#fff;border:1px solid var(--line);border-radius:15px;box-shadow:var(--shadow-soft)}
.day-check-hero>div:first-child{display:grid;gap:4px}.day-check-hero span{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);font-weight:800}.day-check-hero strong{font-size:20px;color:#173c31}.day-check-hero p{font-size:12px;color:var(--muted)}
.day-check-actions{display:flex;gap:9px;flex-wrap:wrap}.day-check-actions button{min-height:40px}
.day-check-alert{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid #edc66f;background:#fff6df;color:#78500a;border-radius:12px;font-size:12px}.day-check-alert button{margin-left:auto;border:0;background:transparent;color:#78500a;text-decoration:underline;font-weight:800;cursor:pointer}
.day-check-toolbar{display:flex;align-items:center;gap:10px;padding:9px;background:#f7f9f8;border:1px solid var(--line);border-radius:13px;position:sticky;top:10px;z-index:7}.day-check-filters{display:flex;gap:6px;flex:1}.day-check-filters button{border:1px solid var(--line);background:#fff;border-radius:9px;padding:8px 10px;font-size:11.5px;font-weight:750;color:#5f716b;cursor:pointer}.day-check-filters button strong{margin-left:5px}.day-check-filters button.active{background:#e7f1ed;border-color:#8eb4a6;color:#1d624d}.day-check-filters button.changed.active,.day-check-filters button.changed:hover{background:#fff2d7;border-color:#e4bd67;color:#805400}.day-check-toolbar>label{display:flex;align-items:center;gap:6px;height:38px;padding:0 9px;background:#fff;border:1px solid var(--line);border-radius:9px}.day-check-toolbar select{border:0;background:transparent;font-size:12px;font-weight:700;color:#52655f}
.day-check-list{background:#fff;border:1px solid var(--line);border-radius:15px;overflow:hidden;box-shadow:var(--shadow-soft)}.day-check-columns,.day-check-row{display:grid;grid-template-columns:minmax(320px,1.3fr) minmax(220px,.85fr) 145px;gap:18px;align-items:center}.day-check-columns{padding:12px 18px;background:#f8faf9;border-bottom:1px solid var(--line);font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#87958f;font-weight:850}.day-check-row{padding:13px 18px;border-bottom:1px solid var(--line);transition:background .18s ease,box-shadow .18s ease}.day-check-row:last-child{border-bottom:0}.day-check-row:hover{background:#fbfdfc}.day-check-row.is-ok{background:#f7fbf9}.day-check-row.is-changed{box-shadow:inset 4px 0 #e2a72e;background:#fffaf0}
.day-check-client{display:flex;align-items:center;gap:12px;min-width:0}.day-check-client h3{font-size:13px;margin-bottom:3px}.day-check-client p,.day-check-client span{display:flex;align-items:center;gap:5px;color:var(--muted);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.day-check-clean{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.day-check-clean .clean-status{min-width:150px}.status-change-label{display:flex!important;align-items:center;gap:5px;color:#98630b!important;background:#fff0cc;padding:4px 7px;border-radius:999px;font-size:9px!important}.day-check-clean small{display:flex;align-items:center;gap:4px;width:100%;font-size:10px;color:#8b6a27}.day-ok-button{height:44px;border-radius:11px;border:1px solid #cfdad6;background:#fff;color:#687a74;display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;font-weight:800;cursor:pointer}.day-ok-button:hover{border-color:#79a895;transform:translateY(-1px)}.day-ok-button.checked{background:#e5f2ed;border-color:#78a895;color:#21644f}.empty-check{width:18px;height:18px;border:2px solid #aab8b3;border-radius:6px}
@media(max-width:1050px){.day-check-hero{align-items:flex-start;flex-direction:column}.day-check-toolbar{flex-wrap:wrap}.day-check-filters{overflow-x:auto}.day-check-columns{display:none}.day-check-row{grid-template-columns:1fr auto}.day-check-clean{grid-column:1}.day-ok-button{grid-column:2;grid-row:1/3}.front-search{min-width:240px}}

.day-last-minute{display:inline-flex;margin-left:7px;padding:3px 6px;border-radius:999px;background:#fff0cc;color:#98630b;font-size:9px;font-style:normal;font-weight:850;vertical-align:middle}.modal .danger-button{justify-content:center}


/* Statut Back Office : CIF pas possible */
.call-filter-bar button.red{background:#fff0f0;border-color:#efc1c1;color:#9a3434}
.call-filter-bar button.red strong{background:#f8dada;color:#872b2b}
.call-filter-bar button.red:hover{border-color:#d98d8d;background:#ffe5e5}
.call-filter-bar button.red.active{background:#c94d4d;color:#fff;border-color:#b83f3f;box-shadow:0 5px 14px rgba(154,52,52,.18)}
.call-filter-bar button.red.active strong{background:rgba(255,255,255,.2);color:#fff}
.row-call-status.red{background:#fff0f0;border-color:#efbcbc;color:#963535}
.call-status-menu button.red:hover,.call-status-menu button.red.selected{background:#fff0f0;color:#963535}
.status-picker .red.on{background:#fff0f0}

/* Statut CIF impossible */
.reservation.is-impossible{border-left:4px solid #dc2626}
.reservation.is-impossible .status-dot{background:#dc2626}
.state-pill.impossible{background:#fee2e2;color:#b91c1c;border:1px solid #fecaca}
