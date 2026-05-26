/**
 * 역량 기반 진로 탐색 시스템
 * 기반 논문: 교육과정 핵심 역량을 통한 학생 맞춤형 진로 탐색 시스템 개발
 * 데이터: KNOW 한국직업정보 재직자조사 (570개 직업)
 */

// ── 교육과정 6대 핵심 역량 ──────────────────────────────────────────
// ── 2022 교육과정 6대 핵심역량 (KEDI 2019 학생역량 조사 원문 문항)
// qs 항목: {q: 문항, r: true} → r:true 는 역방향 채점 (6-점수)
const COMPS = [
  {
    id: 'ac', label: '자기관리 역량', color: '#BA7517', idx: 0,
    qs: [
      // Q4. 자기정체성
      {q:'내가 좋아하는 것(일)이 무엇인지 안다.'},
      {q:'내가 싫어하는 것(일)이 무엇인지 안다.'},
      {q:'내가 관심 있어 하는 것(일)이 무엇인지 안다.'},
      {q:'나의 장·단점이 무엇인지 안다.'},
      {q:'나는 때때로 나 자신에 대해서 잘 모르겠다고 느낀다.', r:true},
      {q:'나는 이 세상에 있으나마나 한 존재이다.', r:true},
      {q:'나는 다른 사람이 하자는 대로 잘 이끌린다.', r:true},
      {q:'나 자신에 대한 생각이 정리되어 있지 않다.', r:true},
      {q:'나에게는 내 꿈을 이루고 싶은 강한 욕구가 없다.', r:true},
      // Q5. 자기조절·목표설정
      {q:'나의 능력보다 조금 어려운 목표를 세운다.'},
      {q:'실제로 이를 수 있을지 생각하면서 목표를 세운다.'},
      {q:'공부가 내 꿈을 이루는 것과 관련이 있는지 생각해 본다.'},
      {q:'꿈을 이루기 위해 필요한 것은 스스로 공부해서 알아낸다.'},
      {q:'해야 할 일이 많으면 순서를 정해서 하나씩 한다.'},
      {q:'미리 계획을 잘 세워서 나중에 어려움을 겪지 않도록 한다.'},
      {q:'해야 할 일에 집중할 수 있도록 주변을 미리 정리한다.'},
      {q:'복잡한 일을 해야 할 때 여러 개로 나누어서 하나씩 해결한다.'},
      {q:'나는 내가 무엇이든 잘 해낼 것이라고 믿는다.'},
      {q:'나는 이 세상에서 하나뿐인 소중한 사람이라고 생각한다.'},
      {q:'어려운 일이 생겨도 잘될 거라고 믿으며 열심히 한다.'},
      {q:'열심히 노력하면 나의 실력이 향상될 것이라고 믿는다.'},
      // Q6. 진로탐색
      {q:'미래에 어떤 직업이 전망 있을 것인가를 생각해 본다.'},
      {q:'원하는 직업(전공)을 갖기 위한 계획을 가지고 있다.'},
      {q:'내 또래에 비해서 뚜렷한 진로 계획을 가지고 있다.'},
      {q:'어른들의 결정보다는 내가 원하는 진로를 택할 것이다.'},
      {q:'진로 선택은 어른들의 결정을 따르는 것이 좋다.', r:true},
      {q:'나의 진로를 결정해 주는 사람이 있었으면 좋겠다.', r:true},
      {q:'진로 선택을 할 때는 다른 사람들의 의견보다 내 생각이 중요하다.'},
      {q:'부모님이 반대하시더라도 내가 원하는 진로를 선택할 것이다.'},
      {q:'내가 관심 있는 직업(전공)에 대한 여러 가지 정보를 수집한다.'},
      {q:'내가 관심 있는 직업(전공)에 대한 구체적인 정보를 알아본다.'},
      {q:'내가 알고 있는 진로 지식이 정확한지 알아본다.'},
      {q:'내가 관심 있는 진로에 대해 인터넷 검색을 한다.'},
      {q:'나의 진로와 관련한 상담을 받는다.'},
      {q:'관심 있는 직업을 가진 사람에게 관련 정보를 얻기 위해 연락한다.'},
    ]
  },
  {
    id: 'a', label: '지식정보처리 역량', color: '#185FA5', idx: 1,
    qs: [
      // Q7. 지식정보처리
      {q:'과제를 해결하는 데 도움이 될 만한 자료나 사람들을 잘 알고 있다.'},
      {q:'여러 자료들 중에서 가장 도움이 되는 것을 먼저 살펴본다.'},
      {q:'필요할 때 손쉽게 찾을 수 있도록 자료를 정리해 둔다.'},
      {q:'자료들을 사용하기 쉽게 내 방식대로 모양이나 순서를 바꾼다.'},
      {q:'글을 그림으로 표현하거나 그림을 글로 설명하는 식으로 새롭고 쓸모 있는 자료들을 만든다.'},
      {q:'컴퓨터와 인터넷을 활용하여 다양한 정보를 얻을 수 있다.'},
      {q:'컴퓨터나 인터넷 상의 다양한 자료를 활용하여 학습할 수 있다.'},
      {q:'내가 가지고 있는 정보를 SNS나 블로그 등을 통해 공유할 수 있다.'},
      {q:'컴퓨터 프로그램을 이용해서 문서·그림·동영상 등을 만들거나 편집할 수 있다.'},
    ]
  },
  {
    id: 'i', label: '창의적 사고 역량', color: '#534AB7', idx: 2,
    qs: [
      // Q8. 창의적 사고
      {q:'다른 친구들이 생각하지 못하는 새로운 생각을 잘한다.'},
      {q:'새로운 문제를 풀 때 도움이 될 만한 내용을 잘 떠올린다.'},
      {q:'부분적인 내용만 듣고도 전체 내용을 상상할 수 있다.'},
      {q:'서로 관련없어 보이는 내용들도 잘 연결지어 생각한다.'},
      {q:'짧은 시간 안에 여러 가지 새로운 생각을 할 수 있다.'},
      {q:'어울릴 것 같지 않은 것들을 결합해서 새로운 것을 만드는 것을 좋아한다.'},
      {q:'종종 주변에 있는 것들을 사용해서 생활에 도움이 되는 것을 만들어 본다.'},
      {q:'때때로 물건을 본래의 용도와 다르게 사용하기도 한다.'},
      {q:'남들이 생각해내지 못하는 기발하고 특이한 발상을 한다.'},
      {q:'하나의 사물이나 현상을 보고 여러 가지 생각을 떠올린다.'},
      {q:'항상 새로운 것을 알려고 한다.'},
      {q:'위험해 보이더라도 궁금한 것은 해본다.'},
      {q:'새로운 것을 해보는 것이 재미있다.'},
      {q:'남들이 포기한 일일수록 해결해 보고 싶은 마음이 강해진다.'},
      {q:'친구들에 비해 관심 분야가 다양하다.'},
      {q:'잘 모르는 것이 있으면 그것에 대해 알고 싶다.'},
      {q:'수업시간에 궁금한 것은 꼭 질문을 한다.'},
      {q:'잘 모르는 것에 대한 해답을 찾아가는 것이 즐겁다.'},
      {q:'풀리지 않는 문제는 몇 시간이고 계속해서 해결될 때까지 매달린다.'},
      {q:'조금 어려운 문제에 부딪혀도 괴롭다는 생각이 들지 않는다.'},
    ]
  },
  {
    id: 're', label: '심미적 감성 역량', color: '#888780', idx: 3,
    qs: [
      // Q9. 독서·예술·스포츠
      {q:'독서는 내가 좋아하는 취미 중 하나이다.'},
      {q:'다른 사람과 책에 대해 이야기 하는 것을 좋아한다.'},
      {q:'서점이나 도서관에 가는 것을 좋아한다.'},
      {q:'책을 선물로 받을 때 기쁘다.'},
      {q:'한 번 읽기 시작한 책은 끝까지 읽는다.'},
      {q:'예술(음악, 미술, 영화, 연극 등) 관람 및 활동은 내가 좋아하는 취미 중 하나이다.'},
      {q:'다른 사람과 예술(음악, 미술, 영화, 연극 등)에 대해 이야기 하는 것을 좋아한다.'},
      {q:'예술 관람(음악회, 콘서트, 미술전시회, 영화관람, 연극공연 등)을 좋아한다.'},
      {q:'예술 활동(노래, 악기연주, 만들기, 그림그리기, 영화제작 등)을 좋아한다.'},
      {q:'스포츠는 내가 좋아하는 취미 중 하나이다.'},
      {q:'다른 사람과 스포츠에 대해 이야기 하는 것을 좋아한다.'},
      {q:'스포츠 경기 관람을 좋아한다.'},
      {q:'가벼운 운동이나 각종 경기에 참여하는 것을 좋아한다.'},
      // Q10. 다문화 감수성
      {q:'한국에 사는 외국사람들도 우리나라 사람들과 똑같은 대우를 받아야 한다.'},
      {q:'우리나라에 살기 위해 온 외국사람들의 전통이나 생활습관도 존중해야 한다.'},
      {q:'외국이주민이나 다문화가정이 늘어나면 우리나라 문화가 더욱 다양해질 것이라고 믿는다.'},
      {q:'인종에 상관없이 누구나 학급임원(회장, 부회장)이 될 수 있다고 생각한다.'},
      {q:'인종이 다르더라도 한국에서 태어나고 자랐으면 우리와 같은 한국 사람이라고 생각한다.'},
      {q:'우리 학교나 학급에 다문화가정의 아이가 있다면 다른 친구들과 똑같은 친구로 대하겠다.'},
      {q:'다문화가정의 아이가 자기 집에 와서 놀자고 하면 그렇게 하겠다.'},
      {q:'기회가 있다면 상대방의 인종·국적·문화권에 상관없이 기꺼이 친구를 사귀겠다.'},
      {q:'내 생일에 친구들을 집에 초대하게 된다면 다문화가정의 아이도 함께 초대하고 싶다.'},
    ]
  },
  {
    id: 'l', label: '협력적 소통 역량', color: '#1D9E75', idx: 4,
    qs: [
      // Q11. 의사소통
      {q:'친구의 기분을 이해하려고 노력한다.'},
      {q:'친구의 마음(생각과 감정)을 잘 알 수 있다.'},
      {q:'친구들의 고민을 잘 들어 준다.'},
      {q:'친구가 선생님께 칭찬을 받으면 나도 기분이 좋아진다.'},
      {q:'친구가 기분이 나쁘면 나도 기분이 나빠진다.'},
      {q:'대화를 할 때 어떻게 말할지 미리 생각하고 말한다.'},
      {q:'듣는 사람이 이해할 수 있도록 쉽고 정확한 말을 골라 이야기한다.'},
      {q:'듣는 사람이 잘 이해할 수 있도록 예를 들어 설명한다.'},
      {q:'상대방의 표정과 몸짓을 살피면서 속마음을 이해한다.'},
      {q:'대화할 때 이야기를 잘 듣고 있다는 것을 말이나 몸짓으로 보여준다.'},
    ]
  },
  {
    id: 'r', label: '공동체 역량', color: '#D85A30', idx: 5,
    qs: [
      // Q12. 공동체·시민의식
      {q:'학급이나 학교에서 일어나는 일들에 관심을 가진다.'},
      {q:'학급이나 학교에서 일어난 일에 대한 내 생각을 말이나 글로 표현한다.'},
      {q:'학급이나 학교에서 일어난 일은 무엇이든 나와 관련이 있다고 생각하고 해결하기 위해 노력한다.'},
      {q:'잘못된 일에 대해서는 다른 사람들이 가만히 있더라도 내 생각을 당당하게 이야기한다.'},
      {q:'과제를 함께 하면서 내가 맡은 일이 마음에 들지 않더라도 최선을 다한다.'},
      {q:'과제를 함께 하는 친구들이 힘들어할 때 힘이 나도록 응원한다.'},
      {q:'과제를 함께 하는 과정에서 친구들과 좀 더 친해지려고 노력한다.'},
      {q:'여럿이 과제를 하다가 다투더라도 양보하며 끝까지 마무리한다.'},
      {q:'과제를 함께 하는 친구들끼리 다투면 서로 화해하도록 나서서 돕는다.'},
      {q:'정해진 공동의 규칙이 내 생각과 다르더라도 준수한다.'},
      {q:'보는 사람이 없어도 규칙을 지킨다.'},
      {q:'공공시설을 이용할 때 급한 일이 있더라도 차례를 지킨다.'},
      {q:'남들이 질서를 지키지 않더라도 나는 질서를 지킨다.'},
      {q:'봉사활동에 적극적으로 참여한다.'},
      {q:'봉사활동을 하면 기분이 좋아진다.'},
      {q:'봉사활동은 내가 원해서 하는 편이다.'},
      {q:'어른이 되어서도 봉사활동을 할 것이다.'},
      // Q13. 세계시민의식
      {q:'다른 나라 사람이기보다는 대한민국 국민이고 싶다.'},
      {q:'현재의 대한민국에 대해 자랑스럽게 느낀다.'},
      {q:'한국 선수들이 국제대회에서 잘할 때면 대한민국 국민인 것이 자랑스럽다.'},
      {q:'남극의 빙하가 사라지고 있는 것은 나에게도 심각한 문제이다.'},
      {q:'먹을 것이 없어 굶어 죽어가고 있는 다른 나라의 어린이들을 생각하면 마음이 아프다.'},
      {q:'세계평화에 기여할 수 있는 일이라면 적극 참여하겠다.'},
      {q:'환경오염을 막기 위해서 세계의 모든 나라들이 협력해야 한다고 생각한다.'},
      {q:'어려운 처지에 있는 다른 나라를 위해서 봉사활동을 할 생각이 있다.'},
    ]
  },
];

// ── 꿈길 연계 체험 프로그램 (API 연동 전 기본 샘플) ────────────────
const PROGRAMS = {
  l: [
    { name: '청소년 리더십 캠프', type: '캠프형', org: '꿈길 체험센터', dur: '2박 3일', kw: '리더십' },
    { name: '학생 자치회 운영 체험', type: '참여형', org: '지역교육청', dur: '1일', kw: '자치' }
  ],
  a: [
    { name: '데이터 사이언스 체험', type: '직업체험', org: '꿈길 IT센터', dur: '4시간', kw: '데이터' },
    { name: '과학수사 추리 워크숍', type: '체험형', org: '진로체험기관', dur: '3시간', kw: '분석' }
  ],
  ac: [
    { name: '청년 도전 챌린지', type: '멘토링', org: '꿈길 지원센터', dur: '4주', kw: '도전' },
    { name: '목표설정 자기계발 워크숍', type: '교육형', org: '진로지원센터', dur: '1일', kw: '자기계발' }
  ],
  r: [
    { name: '사회적 기업 인턴십', type: '현장체험', org: '꿈길 사회적경제', dur: '1주', kw: '사회적기업' },
    { name: '지역사회 봉사 진로체험', type: '봉사형', org: '교육지원청', dur: '4시간', kw: '봉사' }
  ],
  i: [
    { name: '메이커스페이스 창작 체험', type: '창작형', org: '꿈길 창의센터', dur: '하루', kw: '메이커' },
    { name: '스타트업 아이디어톤', type: '경쟁형', org: '청소년창업지원', dur: '1일', kw: '창업' }
  ],
  re: [
    { name: '직업윤리 탐구 프로그램', type: '교육형', org: '꿈길 직업교육', dur: '2시간', kw: '직업윤리' },
    { name: '직장예절 소통 체험', type: '체험형', org: '진로체험기관', dur: '반일', kw: '직장예절' }
  ]
};

// ── 앱 상태 ──────────────────────────────────────────────────────────
let answers = {};
let selectedJob = null;
let radarChart = null;
let activeTab = 0;
let dropItems = [];
let dropIdx = -1;

// API 키 설정 (발급 후 여기에 입력)
const API_CONFIG = {
  ggoomgil: '',
  careernet: '9a1be1e329e68eda99343906354a28e8',
};

// ── 유틸 함수 ────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const calcComp = (id) => {
  const comp = COMPS.find(c => c.id === id);
  const vals = comp.qs.map((q, i) => {
    const raw = answers[`${id}_${i}`] || 0;
    return (q.r && raw > 0) ? (6 - raw) : raw;  // 역방향 문항 자동 변환
  });
  const nonZero = vals.filter(v => v > 0);
  if (!nonZero.length) return 0;
  return +(nonZero.reduce((a, b) => a + b, 0) / nonZero.length).toFixed(2);
};
const calcAllScores = () => {
  const s = {};
  COMPS.forEach(c => { s[c.id] = calcComp(c.id); });
  return s;
};
const scoresArr = (sc) => COMPS.map(c => sc[c.id]);

// ── 단계 이동 ────────────────────────────────────────────────────────
function goStep(n) {
  document.querySelectorAll('.step').forEach((s, i) => s.classList.toggle('active', i === n));
  if (n === 1) renderQuestions();
  if (n === 3) renderResult();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── 진행도 바 ────────────────────────────────────────────────────────
function renderProgressBar() {
  const total = COMPS.length * 5;
  const done = Object.keys(answers).length;
  const pct = Math.round(done / total * 100);

  const pb = $('prog-bar');
  if (!pb) return;
  pb.innerHTML = '';
  COMPS.forEach((comp, i) => {
    const dot = document.createElement('div');
    const groupDone = comp.qs.every((_, j) => answers[`${comp.id}_${j}`]);
    dot.className = 'prog-dot' + (groupDone ? ' done' : '');
    dot.title = comp.label;
    pb.appendChild(dot);
  });
  const lbl = document.createElement('span');
  lbl.className = 'prog-label';
  lbl.textContent = `${done}/${total} 완료`;
  pb.appendChild(lbl);

  const fill = $('prog-fill');
  if (fill) fill.style.width = pct + '%';
}

// ── 문항 렌더링 ──────────────────────────────────────────────────────
function renderQuestions() {
  const container = $('q-container');
  if (!container) return;
  container.innerHTML = '';

  COMPS.forEach((comp, ci) => {
    const group = document.createElement('div');
    group.className = 'q-group';

    const title = document.createElement('div');
    title.className = 'q-group-title';
    title.innerHTML = `<span class="q-dot" style="background:${comp.color}"></span>${ci + 1}. ${comp.label}`;
    group.appendChild(title);

    comp.qs.forEach((q, qi) => {
      const key = `${comp.id}_${qi}`;
      // 전체 연속 번호 (1~123)
      const offset = COMPS.slice(0, ci).reduce((sum, c) => sum + c.qs.length, 0);
      const qNum = offset + qi + 1;
      const item = document.createElement('div');
      item.className = 'q-item';

      const stars = [1, 2, 3, 4, 5].map(v =>
        `<button class="star-btn${answers[key] === v ? ' sel' : ''}"
          data-key="${key}" data-val="${v}"
          onclick="setAnswer('${key}', ${v})"
          aria-label="${v}점">${v}</button>`
      ).join('');

      const qText = typeof q === 'object' ? q.q : q;
      const reverseTag = (typeof q === 'object' && q.r)
        ? `<span class="q-reverse-tag">역방향</span>` : '';

      item.innerHTML = `
        <div class="q-text"><span class="q-num">${qNum}.</span>${qText}${reverseTag}</div>
        <div class="rating-row">
          <span class="rating-label">매우 낮음</span>
          <div class="stars">${stars}</div>
          <span class="rating-label right">매우 높음</span>
        </div>`;
      group.appendChild(item);
    });
    container.appendChild(group);
  });

  renderProgressBar();
}

// ── 응답 저장 ────────────────────────────────────────────────────────
function setAnswer(key, val) {
  answers[key] = val;
  document.querySelectorAll(`[data-key="${key}"]`).forEach(btn => {
    btn.classList.toggle('sel', parseInt(btn.dataset.val) === val);
  });
  renderProgressBar();
  $('error-msg')?.classList.remove('show');
}

// ── 검사 제출 ────────────────────────────────────────────────────────
function submitTest() {
  const totalQ = COMPS.reduce((s, c) => s + c.qs.length, 0);
  const answered = Object.keys(answers).length;
  // 50% 미만 응답 시 경고
  if (answered < Math.floor(totalQ * 0.5)) {
    const err = $('error-msg');
    if (err) {
      err.innerHTML = `⚠️ 현재 ${answered}/${totalQ}문항 응답했습니다. 최소 ${Math.floor(totalQ*0.5)}문항 이상 응답해주세요.`;
      err.classList.add('show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  $('error-msg')?.classList.remove('show');
  goStep(2);
}

// ── 직업 검색 (자동완성) ─────────────────────────────────────────────
function onJobSearch() {
  const q = $('job-search').value.trim();
  const dd = $('job-dropdown');
  if (!q) { dd.classList.remove('show'); return; }

  const filtered = JOBS.filter(j => j.n.includes(q)).slice(0, 15);
  dropItems = filtered;
  dropIdx = -1;

  if (!filtered.length) {
    dd.innerHTML = `<div class="drop-empty">검색 결과 없음</div>`;
    dd.classList.add('show');
    return;
  }
  dd.innerHTML = filtered.map((j, i) =>
    `<div class="drop-item" data-idx="${i}" onmousedown="selectJob(${i})">${j.n}</div>`
  ).join('');
  dd.classList.add('show');
}

function onJobKey(e) {
  const dd = $('job-dropdown');
  const items = dd.querySelectorAll('.drop-item');
  if (e.key === 'ArrowDown') {
    dropIdx = Math.min(dropIdx + 1, items.length - 1);
    items.forEach((it, i) => it.classList.toggle('active', i === dropIdx));
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    dropIdx = Math.max(dropIdx - 1, 0);
    items.forEach((it, i) => it.classList.toggle('active', i === dropIdx));
    e.preventDefault();
  } else if (e.key === 'Enter' && dropIdx >= 0) {
    selectJob(dropIdx);
  } else if (e.key === 'Escape') {
    dd.classList.remove('show');
  }
}

function selectJob(i) {
  selectedJob = dropItems[i];
  $('job-search').value = '';
  $('job-dropdown').classList.remove('show');
  $('sel-job-wrap').innerHTML = `
    <div class="selected-job-pill">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
      <span>${selectedJob.n}</span>
      <button onclick="clearJob()" aria-label="선택 취소">×</button>
    </div>`;
}

function clearJob() {
  selectedJob = null;
  $('sel-job-wrap').innerHTML = '';
  $('job-search').value = '';
}

// ── 직업 추천 (최근접 이웃) ──────────────────────────────────────────
function findBestJob(scores) {
  const myArr = scoresArr(scores);
  let best = null, bestDiff = Infinity;
  JOBS.forEach(job => {
    const diff = job.s.reduce((sum, v, i) => sum + Math.abs(v - myArr[i]), 0);
    if (diff < bestDiff) { bestDiff = diff; best = { ...job, diff: +diff.toFixed(2) }; }
  });
  return best;
}

// ── 탭 전환 ──────────────────────────────────────────────────────────
function showTab(n) {
  activeTab = n;
  ['tab-radar', 'tab-gap', 'tab-program', 'tab-map'].forEach((id, i) => {
    const el = $(id);
    if (el) el.style.display = i === n ? 'block' : 'none';
  });
  document.querySelectorAll('.tab-btn').forEach((t, i) => t.classList.toggle('active', i === n));
  if (n === 3) {
    setTimeout(() => {
      const weakComps = window._lastWeakComps || [];
      initMap(activeFilters ? activeFilters.region : '전국', weakComps);
    }, 50);
  }
}

// ── 결과 렌더링 ──────────────────────────────────────────────────────
function renderResult() {
  const scores = calcAllScores();
  const recJob = findBestJob(scores);
  const myArr = scoresArr(scores);

  // 히어로
  $('result-hero').innerHTML = `
    <div class="rh-label">역량 기반 추천 직업</div>
    <div class="rh-name">${recJob.n}</div>
    ${selectedJob
      ? `<div class="rh-sub">희망 직업 <strong>${selectedJob.n}</strong>과(와) 함께 비교합니다</div>`
      : `<div class="rh-sub">역량 유사도 차이값 <strong>${recJob.diff}</strong></div>`
    }
    <div class="rh-btn-row">
      <button class="rh-detail-btn" onclick="openJobModal('${recJob.n.replace(/'/g,"\\'")}')">
        🔍 추천 직업 상세 정보
      </button>
      ${selectedJob
        ? `<button class="rh-detail-btn secondary" onclick="openJobModal('${(selectedJob.n).replace(/'/g,"\\'")}')">
            🔍 ${selectedJob.n} 상세 정보
          </button>`
        : ''}
    </div>`;

  renderRadar(myArr, recJob, scores);
  renderGap(myArr, recJob);
  // 약한 역량 ID 추출 (지도 자동 필터용)
  const weakCompIds = COMPS
    .filter((c, i) => myArr[i] - recJob.s[i] < -0.3)
    .map(c => c.id);
  window._lastWeakComps = weakCompIds;
  window._lastMyArr = myArr;

  renderPrograms(myArr, recJob);
  showTab(0);
}

// ── 레이더 차트 ──────────────────────────────────────────────────────
function renderRadar(myArr, recJob, scores) {
  const labels = COMPS.map(c => c.label);
  const datasets = [
    {
      label: '나의 역량',
      data: myArr,
      borderColor: '#1D9E75',
      backgroundColor: 'rgba(29,158,117,0.12)',
      pointBackgroundColor: '#1D9E75',
      borderWidth: 2.5,
      pointRadius: 5,
      pointHoverRadius: 7
    },
    {
      label: `${recJob.n} 평균`,
      data: recJob.s,
      borderColor: '#185FA5',
      backgroundColor: 'rgba(24,95,165,0.08)',
      pointBackgroundColor: '#185FA5',
      borderWidth: 2,
      pointRadius: 4,
      borderDash: [6, 3]
    }
  ];
  if (selectedJob) {
    datasets.push({
      label: `${selectedJob.n} 평균`,
      data: selectedJob.s,
      borderColor: '#D85A30',
      backgroundColor: 'rgba(216,90,48,0.08)',
      pointBackgroundColor: '#D85A30',
      borderWidth: 2,
      pointRadius: 4,
      borderDash: [3, 3]
    });
  }

  // 범례
  $('radar-legend').innerHTML = datasets.map(d =>
    `<span class="leg">
      <span class="leg-sq" style="background:${d.borderColor}"></span>
      ${d.label}
    </span>`
  ).join('');

  if (radarChart) radarChart.destroy();
  radarChart = new Chart($('radar-chart'), {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 1, max: 5,
          ticks: { stepSize: 1, font: { size: 11 }, backdropColor: 'transparent', color: '#888780' },
          grid: { color: 'rgba(136,135,128,0.2)' },
          angleLines: { color: 'rgba(136,135,128,0.2)' },
          pointLabels: { font: { size: 12, weight: '500' }, color: '#5F5E5A' }
        }
      }
    }
  });
}

// ── GAP 분석 ─────────────────────────────────────────────────────────
function renderGap(myArr, recJob) {
  const gapEl = $('gap-list');
  let html = `
    <div class="gap-legend">
      <span class="gap-leg-item"><span class="gap-leg-dot" style="background:#1D9E75;opacity:.35"></span>추천 직업 평균</span>
      ${selectedJob ? `<span class="gap-leg-item"><span class="gap-leg-dot" style="background:#D85A30;opacity:.45"></span>${selectedJob.n} 평균</span>` : ''}
      <span class="gap-leg-item"><span class="gap-leg-dot" style="background:#1D9E75"></span>나의 역량</span>
    </div>`;

  COMPS.forEach((comp, i) => {
    const me = myArr[i];
    const jobVal = recJob.s[i];
    const gap = +(me - jobVal).toFixed(2);
    const pMe = Math.round(me / 5 * 100);
    const pJob = Math.round(jobVal / 5 * 100);

    const badge = gap < -0.5
      ? `<span class="badge need">향상 필요 (${gap})</span>`
      : gap > 0.5
      ? `<span class="badge good">강점 (+${gap})</span>`
      : `<span class="badge ok">적정 (${gap})</span>`;

    let desiredBar = '';
    if (selectedJob) {
      const dv = selectedJob.s[i];
      const pD = Math.round(dv / 5 * 100);
      desiredBar = `<div class="bar-track" title="${selectedJob.n}: ${dv}점">
        <div class="bar-fill" style="width:${pD}%;background:#D85A30;opacity:.45"></div>
      </div>`;
    }

    html += `
      <div class="gap-item">
        <span class="gap-label">${comp.label}</span>
        <div class="gap-bars">
          <div class="bar-track" title="추천 직업 평균: ${jobVal}점">
            <div class="bar-fill" style="width:${pJob}%;background:${comp.color};opacity:.35"></div>
          </div>
          ${desiredBar}
          <div class="bar-track" title="나의 역량: ${me}점">
            <div class="bar-fill" style="width:${pMe}%;background:${comp.color}"></div>
          </div>
        </div>
        <div class="gap-vals">${me}<br><span style="color:${comp.color};opacity:.6">${jobVal}</span></div>
        ${badge}
      </div>`;
  });

  gapEl.innerHTML = html;
}

// ── 체험 프로그램 & 링크 ──────────────────────────────────────────────
function renderPrograms(myArr, recJob) {
  // ── 1. 약한 역량 추출 (GAP 기준) ──────────────────────────────────
  const compIds = COMPS.map(c => c.id);
  const gapArr = COMPS.map((c, i) => ({
    id: c.id, label: c.label, color: c.color,
    gap: myArr[i] - recJob.s[i]
  }));
  const weakIds = gapArr
    .filter(g => g.gap < -0.3)
    .sort((a, b) => a.gap - b.gap)  // 가장 부족한 순
    .map(g => g.id);

  // 약한 역량이 없으면 전체 역량 사용
  const filterIds = weakIds.length > 0 ? weakIds : compIds;

  // ── 2. programs.js에서 역량 매칭 프로그램 필터링 ──────────────────
  let matched = PROGRAMS_DATA.filter(p =>
    p.comp.some(c => filterIds.includes(c))
  );

  // 약한 역량 순서대로 정렬 (가장 부족한 역량 프로그램 우선)
  matched.sort((a, b) => {
    const aScore = Math.min(...a.comp.map(c => {
      const idx = filterIds.indexOf(c);
      return idx >= 0 ? idx : 999;
    }));
    const bScore = Math.min(...b.comp.map(c => {
      const idx = filterIds.indexOf(c);
      return idx >= 0 ? idx : 999;
    }));
    return aScore - bScore;
  });

  // 중복 기관 제거하며 상위 6개 선별
  const seen = new Set();
  const top = [];
  for (const p of matched) {
    if (!seen.has(p.org) && top.length < 6) {
      seen.add(p.org);
      top.push(p);
    }
    if (top.length >= 6) break;
  }
  // 6개 못 채우면 중복 기관 허용해서 채우기
  if (top.length < 6) {
    for (const p of matched) {
      if (!top.includes(p) && top.length < 6) top.push(p);
    }
  }

  // ── 3. 추천 배너 ──────────────────────────────────────────────────
  const weakLabels = weakIds.map(id => COMPS.find(c => c.id === id)?.label).filter(Boolean);
  const bannerEl = $('api-status');
  if (bannerEl) {
    bannerEl.className = 'api-banner connected';
    bannerEl.innerHTML = weakLabels.length > 0
      ? `✅ <strong>${weakLabels.join('·')}</strong> 역량 향상에 도움되는 꿈길 프로그램 ${matched.length}개 중 추천 ${top.length}개`
      : `✅ 꿈길 체험프로그램 ${PROGRAMS_DATA.length}개 중 추천 ${top.length}개`;
  }

  // ── 4. 프로그램 카드 렌더링 ────────────────────────────────────────
  const pg = $('prog-grid');
  pg.innerHTML = top.map(p => {
    const mainComp = p.comp[0] || 'i';
    const ci = COMPS.find(c => c.id === mainComp) || COMPS[4];
    const freeTag = p.free
      ? `<span class="prog-tag free">무료</span>`
      : `<span class="prog-tag paid">유료</span>`;
    const grades = [p.el && '초', p.mid && '중', p.hi && '고']
      .filter(Boolean).join('·') || '전체';
    const url = `https://www.ggoomgil.go.kr/front/index.do`;

    return `<a class="prog-card" href="${url}" target="_blank" rel="noopener">
      <div class="prog-card-top">
        <span class="prog-comp-dot" style="background:${ci.color}"></span>
        <span class="prog-comp-label" style="color:${ci.color}">${ci.label}</span>
        ${freeTag}
      </div>
      <div class="prog-type">${p.type}</div>
      <div class="prog-name">${p.n}</div>
      <div class="prog-meta">${p.org}</div>
      <div class="prog-footer">
        <span>📂 ${p.cat}</span>
        <span>🎓 ${grades}학교 · 📍${p.addr}</span>
      </div>
    </a>`;
  }).join('');

  // ── 5. 외부 링크 ──────────────────────────────────────────────────
  const kw1 = encodeURIComponent(recJob.n);
  const kw2 = encodeURIComponent(weakLabels.join(' ') || recJob.n);
  $('link-row').innerHTML = `
    <a class="ext-btn ggoomgil" href="https://www.ggoomgil.go.kr/front/index.do" target="_blank" rel="noopener">
      🌱 꿈길 체험 더보기
    </a>
    <a class="ext-btn careernet" href="https://www.career.go.kr/cnet/front/web/job/catJobView.do?SEQ=0&jobGbn=job&keyword=${kw1}" target="_blank" rel="noopener">
      🔎 커리어넷 직업 정보
    </a>
    ${selectedJob
      ? `<a class="ext-btn careernet" href="https://www.career.go.kr/cnet/front/web/job/catJobView.do?SEQ=0&jobGbn=job&keyword=${encodeURIComponent(selectedJob.n)}" target="_blank" rel="noopener">
          🔎 ${selectedJob.n} 정보
        </a>`
      : ''}`;
}

// ── 꿈길 API 연동 (API 키 발급 후 사용) ──────────────────────────────
async function fetchGgoomgilPrograms(keyword) {
  if (!API_CONFIG.ggoomgil) return null;
  try {
    const url = `https://www.ggoomgil.go.kr/front/openApi/actSchoolProgmList.do`
              + `?serviceKey=${API_CONFIG.ggoomgil}`
              + `&searchText=${encodeURIComponent(keyword)}`
              + `&pageIndex=1&pageSize=8`;
    const res = await fetch(url);
    const data = await res.json();
    return data.list || [];
  } catch (e) {
    console.warn('꿈길 API 오류:', e);
    return null;
  }
}

// ── 커리어넷 API 연동 (API 키 발급 후 사용) ──────────────────────────
async function fetchCareernetJob(jobName) {
  if (!API_CONFIG.careernet) return null;
  try {
    const url = `https://www.career.go.kr/cnet/openapi/getOpenApi.json`
              + `?apiKey=${API_CONFIG.careernet}`
              + `&svcType=api&svcCode=JOB`
              + `&contentType=json`
              + `&gubun=job_dic_list`
              + `&searchWord=${encodeURIComponent(jobName)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.dataSearch?.content || [];
  } catch (e) {
    console.warn('커리어넷 API 오류:', e);
    return null;
  }
}

// ── 초기화 ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 검색창 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) {
      $('job-dropdown')?.classList.remove('show');
    }
  });

  // 초기 문항 렌더링
  renderQuestions();
});


// ── CareerNet API 직업 상세 팝업 ─────────────────────────────────────
const CAREERNET_KEY = API_CONFIG.careernet;

async function openJobModal(jobName) {
  const existing = document.getElementById('job-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'job-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <span class="modal-title">${jobName}</span>
        <button class="modal-close" onclick="document.getElementById('job-modal').remove()">✕</button>
      </div>
      <div class="modal-body" id="modal-body">
        <div class="modal-loading">
          <div class="modal-spinner"></div>
          <span>직업 정보를 불러오는 중...</span>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  // 1차: 커리어넷 API 시도
  if (CAREERNET_KEY) {
    try {
      const [encycRes, infoRes] = await Promise.allSettled([
        fetchCareernetEncy(jobName),
        fetchCareernetInfo(jobName)
      ]);
      const encycData = encycRes.status === 'fulfilled' ? encycRes.value : null;
      const infoData  = infoRes.status  === 'fulfilled' ? infoRes.value  : null;
      if (encycData || infoData) {
        renderModalContent(jobName, encycData, infoData);
        return;
      }
    } catch(e) {
      console.warn('CareerNet API 실패, Claude AI로 전환:', e);
    }
  }

  // 2차: Claude AI로 직업 정보 생성
  await fetchJobInfoFromClaude(jobName);
}

// Claude AI로 직업 정보 가져오기 (CORS 우회)
async function fetchJobInfoFromClaude(jobName) {
  const body = document.getElementById('modal-body');
  if (!body) return;
  body.innerHTML = `<div class="modal-loading"><div class="modal-spinner"></div><span>AI로 직업 정보 생성 중...</span></div>`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `"${jobName}"에 대해 다음 항목을 JSON으로 답해줘. 반드시 JSON만, 설명 없이:
{"desc":"직업 한 줄 설명","work":"하는 일 2-3문장","edu":"필요한 교육·자격","salary":"평균 연봉 수준","outlook":"고용 전망","relate":"관련 직업 3-5개(쉼표 구분)"}`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const info = JSON.parse(clean);

    body.innerHTML = `
      <div class="modal-ai-badge">🤖 AI 생성 정보</div>
      <div class="modal-section"><div class="modal-tag">📋 직업 설명</div><p class="modal-text">${info.desc || ''}</p></div>
      <div class="modal-section"><div class="modal-tag">💼 하는 일</div><p class="modal-text">${info.work || ''}</p></div>
      <div class="modal-section"><div class="modal-tag">🎓 필요 교육·자격</div><p class="modal-text">${info.edu || ''}</p></div>
      <div class="modal-section"><div class="modal-tag">💰 임금 정보</div><p class="modal-text">${info.salary || ''}</p></div>
      <div class="modal-section"><div class="modal-tag">📈 고용 전망</div><p class="modal-text">${info.outlook || ''}</p></div>
      <div class="modal-section"><div class="modal-tag">🔗 관련 직업</div><p class="modal-text">${info.relate || ''}</p></div>
      <div class="modal-footer">
        <a href="https://www.career.go.kr/cnet/front/web/job/catJobView.do?SEQ=0&jobGbn=job&keyword=${encodeURIComponent(jobName)}"
           target="_blank" rel="noopener" class="modal-link-btn">커리어넷에서 자세히 보기 →</a>
      </div>`;
  } catch(e) {
    console.warn('Claude API 실패:', e);
    renderModalFallback(jobName);
  }
}

// 직업백과 API
async function fetchCareernetEncy(jobName) {
  const url = `https://www.career.go.kr/cnet/front/openapi/jobs.json`
    + `?apiKey=${CAREERNET_KEY}&searchJobNm=${encodeURIComponent(jobName)}&pageIndex=1`;
  const res = await fetch(url);
  const data = await res.json();
  // 첫 번째 결과 반환
  const list = data.jobs || data.dataSearch?.content || [];
  return list.length > 0 ? list[0] : null;
}

// 직업정보 API
async function fetchCareernetInfo(jobName) {
  const url = `https://www.career.go.kr/cnet/front/openapi/job.json`
    + `?apiKey=${CAREERNET_KEY}&searchJobNm=${encodeURIComponent(jobName)}`;
  const res = await fetch(url);
  const data = await res.json();
  const list = data.jobs || data.dataSearch?.content || [];
  return list.length > 0 ? list[0] : null;
}

// 모달 내용 렌더링
function renderModalContent(jobName, ency, info) {
  const body = $('modal-body');
  if (!body) return;

  const job = ency || info || {};
  const name    = job.job_nm  || job.jobNm  || jobName;
  const desc    = job.job_dc  || job.jobDc  || job.summary || '';
  const work    = job.work_dc || job.workDc || job.work    || '';
  const edu     = job.edu_nm  || job.eduNm  || '';
  const salary  = job.wage    || job.salaryInfo || '';
  const outlook = job.employ_form || job.employForm || job.prospect || '';
  const relate  = job.relate_job_nm || job.relateJobNm || '';

  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-tag">📋 직업 설명</div>
      <p class="modal-text">${desc || '커리어넷에서 확인하세요.'}</p>
    </div>
    ${work ? `<div class="modal-section">
      <div class="modal-tag">💼 하는 일</div>
      <p class="modal-text">${work}</p>
    </div>` : ''}
    ${edu ? `<div class="modal-section">
      <div class="modal-tag">🎓 필요 교육·자격</div>
      <p class="modal-text">${edu}</p>
    </div>` : ''}
    ${salary ? `<div class="modal-section">
      <div class="modal-tag">💰 임금 정보</div>
      <p class="modal-text">${salary}</p>
    </div>` : ''}
    ${outlook ? `<div class="modal-section">
      <div class="modal-tag">📈 고용 전망</div>
      <p class="modal-text">${outlook}</p>
    </div>` : ''}
    ${relate ? `<div class="modal-section">
      <div class="modal-tag">🔗 관련 직업</div>
      <p class="modal-text">${relate}</p>
    </div>` : ''}
    <div class="modal-footer">
      <a href="https://www.career.go.kr/cnet/front/web/job/catJobView.do?SEQ=0&jobGbn=job&keyword=${encodeURIComponent(jobName)}"
         target="_blank" rel="noopener" class="modal-link-btn">
        커리어넷에서 자세히 보기 →
      </a>
    </div>`;
}

// API 실패 시 폴백
function renderModalFallback(jobName) {
  const body = $('modal-body');
  if (!body) return;
  body.innerHTML = `
    <div class="modal-section">
      <p class="modal-text" style="color:var(--text-secondary)">
        ${API_CONFIG.careernet
          ? 'API 응답을 불러오지 못했습니다. 커리어넷에서 직접 확인해주세요.'
          : 'API 키가 설정되지 않았습니다. app.js의 API_CONFIG에 키를 입력해주세요.'}
      </p>
    </div>
    <div class="modal-footer">
      <a href="https://www.career.go.kr/cnet/front/web/job/catJobView.do?SEQ=0&jobGbn=job&keyword=${encodeURIComponent(jobName)}"
         target="_blank" rel="noopener" class="modal-link-btn">
        커리어넷에서 직접 확인하기 →
      </a>
    </div>`;
}
