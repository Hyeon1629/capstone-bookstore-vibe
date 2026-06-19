// 앱 셸 — 사이드 패널 + 폰 프레임 + 스타일 가이드 토글
// 모든 화면을 한 캔버스에 묶는다.

const { useState: useStateApp, useEffect: useEffectApp } = React;

const SCREEN_META = [
  { key: "styleguide", id: "—", name: "스타일 가이드", group: "design system" },
  { key: "map", id: "SC-04", name: "지도 홈", group: "core", priority: 1, note: "첫인상. 발견의 와우 모먼트" },
  { key: "detail", id: "SC-05", name: "책방 상세", group: "core", priority: 2, note: "정보 밀도 + 다크 무드 핵심" },
  { key: "bookshelf", id: "SC-07", name: "마이 북쉘프", group: "core", priority: 3, note: "수집의 만족감" },
  { key: "moodInput", id: "SC-06", name: "분위기 입력", group: "core", priority: 4, note: "인증 직후의 기쁜 순간" },
  { key: "onboarding", id: "SC-01", name: "온보딩", group: "auth", priority: 5 },
  { key: "signup", id: "SC-02", name: "회원가입", group: "auth", priority: 6 },
  { key: "login", id: "SC-03", name: "로그인", group: "auth", priority: 7 },
  { key: "mypage", id: "SC-08", name: "마이페이지", group: "profile", priority: 8 },
];

function App() {
  const [screen, setScreen] = useStateApp("map");
  const [history, setHistory] = useStateApp(["map"]);

  const navigate = (next) => {
    setScreen(next);
    setHistory((h) => [...h.slice(-9), next]);
  };

  // 화살표 키 네비게이션 — 우선순위 순서로 prev / next
  useEffectApp(() => {
    const ordered = SCREEN_META.filter((s) => s.key !== "styleguide").map((s) => s.key);
    const handler = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      const idx = ordered.indexOf(screen);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigate(ordered[(idx + 1) % ordered.length] || ordered[0]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigate(ordered[(idx - 1 + ordered.length) % ordered.length] || ordered[0]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        background: "var(--bg-deeper)",
      }}
    >
      <SidePanel current={screen} onSelect={navigate} />
      <main
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          background: screen === "styleguide" ? "var(--bg-midnight)" : "var(--bg-deeper)",
        }}
      >
        {screen === "styleguide" ? (
          <StyleGuide />
        ) : (
          <PhoneStage screen={screen} onNavigate={navigate} />
        )}
      </main>
    </div>
  );
}

function PhoneStage({ screen, onNavigate }) {
  const meta = SCREEN_META.find((s) => s.key === screen);

  const renderScreen = () => {
    switch (screen) {
      case "onboarding": return <OnboardingScreen onNavigate={onNavigate} />;
      case "signup": return <SignupScreen onNavigate={onNavigate} />;
      case "login": return <LoginScreen onNavigate={onNavigate} />;
      case "map": return <MapHomeScreen onNavigate={onNavigate} />;
      case "detail": return <BookstoreDetailScreen onNavigate={onNavigate} />;
      case "moodInput": return <MoodInputScreen onNavigate={onNavigate} />;
      case "bookshelf": return <BookshelfScreen onNavigate={onNavigate} />;
      case "mypage": return <MyPageScreen onNavigate={onNavigate} />;
      default: return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "40px 48px",
        display: "flex",
        gap: 48,
        flexWrap: "wrap",
        alignItems: "flex-start",
        background:
          "radial-gradient(ellipse at 70% 0%, rgba(242,184,114,0.05) 0%, transparent 60%), var(--bg-deeper)",
      }}
    >
      {/* 폰 */}
      <div style={{ flexShrink: 0 }}>
        <PhoneFrame label={`${meta.id} · ${meta.name}`}>{renderScreen()}</PhoneFrame>
      </div>

      {/* 메타 */}
      <ScreenMeta meta={meta} onNavigate={onNavigate} />
    </div>
  );
}

function ScreenMeta({ meta, onNavigate }) {
  // 화면별 디자인 노트 — 시연 시 "왜 이렇게 디자인했나"를 설명하기 좋게
  const NOTES = {
    map: {
      headline: '"동네에 이렇게 많았다" 의 와우 모먼트',
      paragraphs: [
        "다크 베이스 위에 따뜻한 펜던트 글로우(앰버)로 핀 주변을 둘러 — 책방 자체가 골목의 작은 등불처럼 느껴지도록 했습니다.",
        "핀은 색(주황·세이지) + 글리프(book·cup) + 방문 시 골드 별 배지의 3단계로 구분돼, 색약 사용자도 카테고리를 형태로 인지할 수 있습니다.",
        "검색바·칩·FAB·BottomNav 까지 IA는 와이어프레임 그대로. 비주얼만 다크 무드로 갈아입혔습니다.",
      ],
      decisions: [
        "지도 배경 — 검정 ❌, 잉크 블루-블랙(#161b23). 도로 라인은 종이 톤(#3a3328)으로 따뜻함 유지",
        "핀 글로우 — radial-gradient + drop-shadow 이중. 시각적 무게감 + 발견의 즐거움",
        "헤더 카피 — 숫자(15곳)에 앰버 액센트를 칠해 '많음'을 정량적으로도 강조",
      ],
    },
    detail: {
      headline: "인스타에 캡처해서 올리고 싶은 정보 페이지",
      paragraphs: [
        "사진 슬라이드를 화면 상단 1/3까지 풀블리드로. 페르소나(서연)에게 가장 중요한 '공간의 분위기' 가 먼저 들어옵니다.",
        "상호 — Gowun Batang 26px 으로 무게감 있게. 영문 부제는 EB Garamond Italic으로 잡지 표지 느낌을 추가.",
        "분위기 태그는 단순 칩이 아니라 emoji + label + count 의 3요소 카드로 — '다른 사람들도 이렇게 느꼈다'를 시각화.",
      ],
      decisions: [
        "하단 액션바 — 길찾기를 Primary 로 격상(시연 시 분위기 입력으로 이어지는 경로)",
        "방문 완료 배지 — 우측 상단에 골드 monospace 캡션 으로 차분하게",
        "사진 더 보기 — 3:1 그리드 + 4px 분리. 인스타 게시판 느낌의 친숙한 그리드",
      ],
    },
    bookshelf: {
      headline: "방문 지도가 한 점씩 채워지는 시각적 만족감",
      paragraphs: [
        "통계 카드 상단 — 책 등받이의 누런 띠 그라데이션을 1픽셀 라인으로. 책방 = 책장 = 컬렉션의 시각적 메타포를 도입.",
        "방문 리스트는 단순 row 가 아니라 책 등(book spine)을 모티프로. NO.13, NO.12 ... 처럼 번호가 새겨진 작은 책이 한 권씩 추가되는 느낌.",
        "방문 지도 미니뷰 — 컬러 핀(방문) vs 회색 점(미방문) 의 대비로 '내가 채워가는 영역'을 즉시 인지.",
      ],
      decisions: [
        "통계 카드 상단 띠 — 책 등받이의 누런 그라데이션. 책장 메타포의 미세한 신호",
        "리스트 책등 — 카테고리 색이 그대로 spine 컬러. 시각 일관성",
        "미니맵 — 골드 핀(방문)만 빛나고 회색 점은 가만히. 압박 없이 '내가 채운 영역'만 강조",
      ],
    },
    moodInput: {
      headline: "방문 인증 후의 가장 기쁜 순간 — 한 호흡 머무는 모달",
      paragraphs: [
        "황금 스탬프 + 점선 회전 링 + 따뜻한 펜던트 글로우. 음향 효과 없이도 '뽑았다' 의 청량감.",
        "이모지 5개는 단순 선택지가 아닌 카드 — 선택 시 보더가 앰버로 빛나고 살짝 위로 올라옵니다(translateY).",
        "CTA 카피는 '완료'가 아닌 '북쉘프에 기록하기' 로. 다음 화면(컬렉션)이 자연스럽게 예고됩니다.",
      ],
      decisions: [
        "스탬프 번호(#013) — monospace 로 컬렉션 카드 느낌. 매 방문마다 +1",
        "건너뛰기 — 텍스트 링크로만, Primary 가 한 개임을 유지",
        "배경 — 미세한 격자 + 반짝이는 별. 분위기지만 정보를 가리지 않음",
      ],
    },
    onboarding: {
      headline: "3슬라이드 — Discovery · Visit · Collection",
      paragraphs: [
        "각 슬라이드는 발견·인증·수집의 메커닉을 한 컷의 일러스트로 보여줍니다. 추상 컬러 블록 + 모티프 조합.",
        "헤드라인은 Gowun Batang 28px / -0.8 letterspacing. 한글 명조의 무게감이 '책' 의 정체성을 즉시 전달.",
        "Eyebrow(01 — DISCOVERY) 는 monospace + 트래킹 3 으로 '챕터' 같은 느낌을 부여.",
      ],
      decisions: [
        "일러스트 — 실제 사진 ❌, 추상 블록 + 모티프. 학교 과제 컨텍스트에 맞춤",
        "페이지 인디케이터 — 활성은 길게(22px), 비활성은 점. 진행률 직관 가능",
        "건너뛰기 — 우측 상단 작게. 자기소개에 강요하지 않음",
      ],
    },
    signup: {
      headline: "입력은 최소화, 검증은 즉시",
      paragraphs: [
        "이메일·비밀번호·닉네임 3개 필드. 모든 인풋이 실시간 검증과 OK 마이크로 인터랙션을 가집니다.",
        "검증 상태는 보더 컬러(앰버=focus, sage=ok, 코랄=error) 와 캡션 텍스트 둘 다로 전달.",
        "동의 영역을 별도 체크 카드로 분리 — 시연 시 '약관에 동의했다'가 시각적으로 보이도록.",
      ],
      decisions: [
        "헤드라인 카피 — '시작하기' 같은 진부함 대신 페르소나(서연)의 책장 만들기로 친밀하게",
        "필드 라벨 — 12px Pretendard 600. 인풋과 충분한 간격(8px)",
        "Primary CTA — paper 컬러(흰색 아님). 다크 위에서 가장 강한 시각 신호",
      ],
    },
    login: {
      headline: "재방문을 환영하는 작은 인사",
      paragraphs: [
        "회원가입과 동일한 폼 패턴을 재사용 — 디자인 시스템의 일관성을 가장 직접적으로 보여주는 화면.",
        "로고 + Eyebrow + 한글 인사 + 영문 부카피의 4단 헤더. 책방의 간판 같은 톤.",
        "자동 로그인 체크박스 + 비밀번호 찾기 링크는 한 줄에 좌우로 — 표준 패턴 유지.",
      ],
      decisions: [
        "로고 — 책 글리프(book) + 앰버 글로우. 펜던트 조명의 메타포",
        "헤드라인 — '오늘은 어느 책방에 들러볼까요?' 로 다음 액션을 자연스럽게 예고",
        "회원가입 링크 — 앰버 컬러. 신규 가입 유입 동선이 보이도록",
      ],
    },
    mypage: {
      headline: "프로필 + 메뉴 — 클래식하지만 따뜻하게",
      paragraphs: [
        "아바타에 페르소나 이름의 첫 글자(서). 골드→앰버 그라데이션 + 펜던트 글로우.",
        "Explorer Lv.2 같은 작은 메타데이터로 컬렉션의 결과를 다시 한 번 상기.",
        "메뉴는 그룹화 — '설정' / '계정'. 로그아웃은 코랄 톤 + 코랄 배경 아이콘으로 위험 액션 명확화.",
      ],
      decisions: [
        "프로필 카드 — 우상단 펜던트 글로우 누설. 카드 한 장이 '책방의 작은 창'처럼",
        "MiniStat — 큰 숫자 + 라벨. 누적 13 / 이번 달 4",
        "Footer 버전 — monospace. 학생 시연 시 v1.0.0 임을 명시",
      ],
    },
  };

  const note = NOTES[meta.key];

  return (
    <div
      style={{
        flex: "1 1 360px",
        minWidth: 340,
        maxWidth: 540,
        background: "var(--surface-01)",
        border: "1px solid var(--hairline)",
        borderRadius: 20,
        padding: 32,
        color: "var(--paper)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: TOKENS.color.accentLamp,
            letterSpacing: 2,
            background: "rgba(242,184,114,0.1)",
            border: "1px solid rgba(242,184,114,0.3)",
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          {meta.id}
        </span>
        {meta.priority && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--paper-mute)",
              letterSpacing: 0.5,
            }}
          >
            우선순위 {meta.priority}
          </span>
        )}
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display-kr)",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: -0.6,
          lineHeight: 1.25,
        }}
      >
        {meta.name}
      </h2>
      {note && (
        <div
          style={{
            marginTop: 6,
            fontFamily: "var(--font-display-en)",
            fontSize: 14.5,
            fontStyle: "italic",
            color: "var(--paper-dim)",
            letterSpacing: 0.1,
          }}
        >
          {note.headline}
        </div>
      )}

      {note && (
        <>
          <div style={{ marginTop: 24 }}>
            <SectionLabel>디자인 노트</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {note.paragraphs.map((p, i) => (
                <p
                  key={i}
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-ui)",
                    fontSize: 13.5,
                    lineHeight: 1.7,
                    color: "var(--paper-dim)",
                    letterSpacing: -0.1,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <SectionLabel>핵심 결정</SectionLabel>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {note.decisions.map((d, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--paper)",
                    paddingLeft: 18,
                    position: "relative",
                    letterSpacing: -0.1,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 8,
                      width: 8,
                      height: 2,
                      background: TOKENS.color.accentLamp,
                    }}
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div style={{ marginTop: 28 }}>
        <SectionLabel>키보드</SectionLabel>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--paper-mute)",
            letterSpacing: 0.3,
          }}
        >
          <KeyHint k="↑ ↓" desc="화면 전환" />
          <KeyHint k="클릭" desc="프로토타입 인터랙션" />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        color: "var(--paper-mute)",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function KeyHint({ k, desc }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          padding: "3px 7px",
          background: "var(--surface-02)",
          border: "1px solid var(--hairline-strong)",
          borderRadius: 4,
          color: "var(--paper)",
        }}
      >
        {k}
      </span>
      <span>{desc}</span>
    </div>
  );
}

// ─── 사이드 패널 ─────────────────────────────────────────────────
function SidePanel({ current, onSelect }) {
  const groups = [
    { key: "design system", title: "DESIGN SYSTEM" },
    { key: "core", title: "CORE FLOW · 우선순위 1-4" },
    { key: "auth", title: "AUTH · 5-7" },
    { key: "profile", title: "PROFILE · 8" },
  ];

  return (
    <aside
      style={{
        width: 280,
        background: "var(--surface-01)",
        borderRight: "1px solid var(--hairline)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
      }}
      className="phone-scroll"
    >
      {/* 헤더 */}
      <div
        style={{
          padding: "28px 24px 22px",
          borderBottom: "1px solid var(--hairline)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(242,184,114,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, var(--accent-lamp), var(--accent-lamp-deep))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 16px ${TOKENS.color.accentLamp}55`,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#1A1410">
              <path d="M5 4h11a3 3 0 013 3v13a1 1 0 01-1 1H7a2 2 0 01-2-2V4z" />
              <rect x="3" y="4" width="2.5" height="17" rx="0.5" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display-kr)",
                fontSize: 17,
                fontWeight: 700,
                color: "var(--paper)",
                letterSpacing: -0.3,
                lineHeight: 1.1,
              }}
            >
              숨은 책방
            </div>
            <div
              style={{
                fontFamily: "var(--font-display-en)",
                fontSize: 10.5,
                fontStyle: "italic",
                color: "var(--paper-dim)",
                letterSpacing: 0.2,
                marginTop: 1,
              }}
            >
              Hidden Bookshop
            </div>
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: TOKENS.color.accentLamp,
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          PHASE 3 · VISUAL DESIGN
        </div>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11.5,
            color: "var(--paper-mute)",
            lineHeight: 1.5,
            letterSpacing: -0.05,
          }}
        >
          Late Bookshop · Vintage Warmth
        </div>
      </div>

      {/* 네비 */}
      <div style={{ flex: 1, padding: "16px 12px 24px" }}>
        {groups.map((g) => (
          <div key={g.key} style={{ marginBottom: 22 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                color: "var(--paper-mute)",
                letterSpacing: 1.5,
                padding: "0 12px",
                marginBottom: 6,
              }}
            >
              {g.title}
            </div>
            {SCREEN_META.filter((s) => s.group === g.key).map((s) => (
              <NavItem
                key={s.key}
                meta={s}
                active={current === s.key}
                onClick={() => onSelect(s.key)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div
        style={{
          padding: "16px 24px 22px",
          borderTop: "1px solid var(--hairline)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--paper-mute)",
          letterSpacing: 0.5,
          lineHeight: 1.6,
        }}
      >
        대학 과제 시연용 · v1.0
        <br />
        Phase 3 · 8 screens + guide
      </div>
    </aside>
  );
}

function NavItem({ meta, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        background: active ? "var(--surface-02)" : "transparent",
        textAlign: "left",
        position: "relative",
        transition: "all .15s",
      }}
    >
      {active && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "20%",
            bottom: "20%",
            width: 2,
            background: TOKENS.color.accentLamp,
            borderRadius: 2,
            boxShadow: `0 0 8px ${TOKENS.color.accentLamp}`,
          }}
        />
      )}
      <div
        style={{
          width: 34,
          textAlign: "left",
          fontFamily: "var(--font-mono)",
          fontSize: 9.5,
          color: active ? TOKENS.color.accentLamp : "var(--paper-mute)",
          letterSpacing: 0.3,
          fontWeight: 600,
        }}
      >
        {meta.id}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display-kr)",
            fontSize: 13.5,
            fontWeight: active ? 700 : 600,
            color: active ? "var(--paper)" : "var(--paper-dim)",
            letterSpacing: -0.2,
            lineHeight: 1.25,
          }}
        >
          {meta.name}
        </div>
        {meta.note && (
          <div
            style={{
              marginTop: 2,
              fontFamily: "var(--font-ui)",
              fontSize: 10.5,
              color: "var(--paper-mute)",
              letterSpacing: -0.05,
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {meta.note}
          </div>
        )}
      </div>
      {meta.priority && meta.priority <= 4 && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: TOKENS.color.accentLamp,
            opacity: 0.7,
          }}
        />
      )}
    </button>
  );
}

// ─── MOUNT ────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
