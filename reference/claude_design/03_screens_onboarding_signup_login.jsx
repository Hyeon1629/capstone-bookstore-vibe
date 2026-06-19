// SC-01 온보딩, SC-02 회원가입, SC-03 로그인

const { useState: useStateA } = React;

// ----------------------------------------------------------------------------
// SC-01 온보딩 — 첫 진입 인상
// ----------------------------------------------------------------------------
const ONBOARDING_SLIDES = [
  {
    eyebrow: "DISCOVERY",
    title: "동네에 책방이\n이렇게 많았어요",
    body: "성수동에만 28곳, 합정에 47곳.\n반경 2km, 지도에서 찾아드릴게요.",
    art: "discovery",
  },
  {
    eyebrow: "VISIT",
    title: "다녀온 책방의\n스탬프를 모아요",
    body: "GPS로 자동 인증되는 스탬프.\n오늘의 분위기 한 줄까지 같이.",
    art: "stamp",
  },
  {
    eyebrow: "COLLECTION",
    title: "내 동네 책방 지도를\n한 점씩 채워가요",
    body: "방문 기록은 사라지지 않는\n나만의 작은 큐레이션이 됩니다.",
    art: "shelf",
  },
];

function OnboardingScreen({ onNavigate }) {
  const [idx, setIdx] = useStateA(0);
  const slide = ONBOARDING_SLIDES[idx];
  const isLast = idx === ONBOARDING_SLIDES.length - 1;

  const next = () => {
    if (isLast) onNavigate("signup");
    else setIdx(idx + 1);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "var(--bg-midnight)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <StatusBar tint="paper" />

      {/* warm vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(242,184,114,0.16) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(232,128,77,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Top bar — 건너뛰기 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display-en)",
            fontSize: 14,
            fontStyle: "italic",
            color: "var(--paper-dim)",
            letterSpacing: 0.3,
          }}
        >
          숨은책방
        </div>
        <button
          onClick={() => onNavigate("login")}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12.5,
            color: "var(--paper-mute)",
            padding: "6px 4px",
            fontWeight: 500,
          }}
        >
          건너뛰기
        </button>
      </div>

      {/* 일러스트 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
          position: "relative",
          zIndex: 5,
          minHeight: 280,
        }}
      >
        <OnboardingArt kind={slide.art} />
      </div>

      {/* 카피 */}
      <div style={{ padding: "0 32px 8px", position: "relative", zIndex: 5 }}>
        <div
          key={`eye-${idx}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: TOKENS.color.accentLamp,
            letterSpacing: 3,
            marginBottom: 12,
            animation: "fadeUp .35s ease",
          }}
        >
          0{idx + 1} — {slide.eyebrow}
        </div>
        <h1
          key={`t-${idx}`}
          style={{
            margin: 0,
            fontFamily: "var(--font-display-kr)",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--paper)",
            letterSpacing: -0.8,
            lineHeight: 1.28,
            whiteSpace: "pre-line",
            animation: "fadeUp .4s ease",
          }}
        >
          {slide.title}
        </h1>
        <p
          key={`b-${idx}`}
          style={{
            margin: "16px 0 0",
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--paper-dim)",
            whiteSpace: "pre-line",
            letterSpacing: -0.15,
            animation: "fadeUp .45s ease",
          }}
        >
          {slide.body}
        </p>
      </div>

      {/* 페이지 인디케이터 + 버튼 */}
      <div style={{ padding: "28px 24px 36px", position: "relative", zIndex: 5 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 22 }}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 22 : 6,
                height: 6,
                borderRadius: 999,
                background:
                  i === idx ? "var(--accent-lamp)" : "var(--hairline-strong)",
                transition: "all .25s",
                padding: 0,
              }}
            />
          ))}
        </div>
        <PrimaryButton onClick={next}>{isLast ? "시작하기" : "다음"}</PrimaryButton>
        {isLast && (
          <button
            onClick={() => onNavigate("login")}
            style={{
              display: "block",
              width: "100%",
              marginTop: 14,
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--paper-mute)",
            }}
          >
            이미 계정이 있어요{" "}
            <span style={{ color: "var(--paper)", fontWeight: 600 }}>로그인</span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// 일러스트 — placeholder 가이드에 따라 추상 컬러 블록 + 모티프
function OnboardingArt({ kind }) {
  if (kind === "discovery") {
    return (
      <div style={{ width: "100%", maxWidth: 280, aspectRatio: "1/1", position: "relative" }}>
        {/* 다크 지도 카드 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            background:
              "radial-gradient(ellipse at 30% 30%, #2a3340 0%, #161b23 80%)",
            border: "1px solid var(--hairline-strong)",
            overflow: "hidden",
            boxShadow: "var(--shadow-warm)",
          }}
        >
          {/* 블록 */}
          <svg viewBox="0 0 280 280" width="100%" height="100%">
            <g fill="#1d242f" stroke="#272f3a" strokeWidth="1">
              <polygon points="0,0 100,0 100,60 50,90 0,80" />
              <polygon points="110,0 220,0 220,70 160,90 110,55" />
              <polygon points="230,0 280,0 280,80 240,90" />
              <polygon points="0,95 80,95 110,150 60,200 0,180" />
              <polygon points="125,100 220,100 240,160 180,200 130,170" />
              <polygon points="250,100 280,100 280,220 260,200" />
              <polygon points="0,220 80,220 100,280 0,280" />
              <polygon points="115,210 200,210 220,280 110,280" />
              <polygon points="230,230 280,230 280,280 240,280" />
            </g>
            <g stroke="#3a3328" strokeWidth="0.8" opacity="0.6" fill="none">
              <line x1="0" y1="90" x2="280" y2="105" />
              <line x1="0" y1="210" x2="280" y2="225" />
              <line x1="110" y1="0" x2="115" y2="280" />
              <line x1="225" y1="0" x2="230" y2="280" />
            </g>
          </svg>

          {/* 핀들 */}
          {[
            { x: 22, y: 25, type: "bookstore" },
            { x: 58, y: 35, type: "library", visited: true },
            { x: 75, y: 60, type: "bookstore" },
            { x: 35, y: 68, type: "library" },
            { x: 80, y: 22, type: "bookstore" },
            { x: 18, y: 50, type: "bookstore" },
            { x: 50, y: 80, type: "library" },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -100%)",
                filter: `drop-shadow(0 0 12px ${
                  p.type === "library" ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore
                }aa)`,
                animation: `float 3s ease-in-out ${i * 0.3}s infinite`,
              }}
            >
              <MapPin type={p.type} visited={p.visited} size={26} />
            </div>
          ))}

          {/* 사용자 위치 */}
          <div
            style={{
              position: "absolute",
              left: "45%",
              top: "48%",
              transform: "translate(-50%, -50%)",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: TOKENS.color.info,
              border: "3px solid #fff",
              boxShadow: `0 0 0 8px ${TOKENS.color.info}33`,
            }}
          />
        </div>
      </div>
    );
  }

  if (kind === "stamp") {
    return (
      <div style={{ width: "100%", maxWidth: 280, aspectRatio: "1/1", position: "relative" }}>
        {/* 종이 노트 카드 */}
        <div
          style={{
            position: "absolute",
            inset: "8% 14%",
            borderRadius: 12,
            background: "linear-gradient(135deg, #f2ead9, #e8dec8)",
            transform: "rotate(-3deg)",
            boxShadow: "var(--shadow-warm)",
            padding: "24px 22px",
            color: "#3a2d1c",
            fontFamily: "var(--font-display-kr)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-en)",
              fontStyle: "italic",
              fontSize: 13,
              color: "#7a5a35",
              letterSpacing: 0.5,
            }}
          >
            Visit Stamp
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>
              성수 책방
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                color: "#7a5a35",
                letterSpacing: 0.5,
                marginTop: 2,
              }}
            >
              2026.05.21 · #013
            </div>
          </div>
          {/* 빈 줄 노트 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ height: 1, background: "#c2b59c" }} />
            <div style={{ height: 1, background: "#c2b59c" }} />
            <div style={{ height: 1, background: "#c2b59c", width: "70%" }} />
          </div>
        </div>

        {/* 황금 스탬프 */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "12%",
            width: 92,
            height: 92,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 35% 30%, #FFE0A0, #F5CD6E 35%, #D99852 75%, #A67035 100%)",
            boxShadow: `0 0 32px ${TOKENS.color.goldVisited}66, inset 0 -4px 8px rgba(80,40,10,0.5), inset 0 4px 4px rgba(255,240,200,0.4)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(8deg)",
            border: "3px solid rgba(255,240,200,0.3)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-en)",
              fontStyle: "italic",
              fontSize: 14,
              fontWeight: 600,
              color: "#3a2410",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            VISIT
            <br />
            <span style={{ fontSize: 9, letterSpacing: 1.5 }}>NO.013</span>
          </div>
        </div>
      </div>
    );
  }

  // shelf
  return (
    <div style={{ width: "100%", maxWidth: 280, aspectRatio: "1/1", position: "relative" }}>
      {/* 책장 */}
      <div
        style={{
          position: "absolute",
          inset: "12% 6% 12%",
          background:
            "linear-gradient(180deg, #2a212a 0%, #1d1820 100%)",
          borderRadius: 8,
          border: "1px solid var(--hairline-strong)",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxShadow: "var(--shadow-warm)",
        }}
      >
        {/* 책 행 1 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: "33%" }}>
          {[
            { c: TOKENS.color.pinBookstore, h: "85%", w: 14 },
            { c: TOKENS.color.pinLibrary, h: "100%", w: 16 },
            { c: TOKENS.color.accentLamp, h: "75%", w: 12, gold: true },
            { c: TOKENS.color.pinBookstore, h: "90%", w: 18 },
            { c: TOKENS.color.pinLibrary, h: "70%", w: 14 },
            { c: TOKENS.color.pinBookstore, h: "95%", w: 16, gold: true },
            { c: TOKENS.color.pinLibrary, h: "80%", w: 14 },
            { c: "#3a4250", h: "60%", w: 13 },
            { c: "#3a4250", h: "70%", w: 14 },
          ].map((b, i) => (
            <BookSpine key={i} {...b} />
          ))}
        </div>
        <div style={{ height: 1, background: "var(--hairline-strong)" }} />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: "33%" }}>
          {[
            { c: TOKENS.color.pinLibrary, h: "100%", w: 14, gold: true },
            { c: TOKENS.color.pinBookstore, h: "85%", w: 16 },
            { c: TOKENS.color.pinLibrary, h: "70%", w: 12 },
            { c: TOKENS.color.pinBookstore, h: "95%", w: 18, gold: true },
            { c: TOKENS.color.pinLibrary, h: "80%", w: 14 },
            { c: "#3a4250", h: "65%", w: 13 },
            { c: "#3a4250", h: "70%", w: 14 },
            { c: "#3a4250", h: "60%", w: 12 },
            { c: "#3a4250", h: "78%", w: 14 },
          ].map((b, i) => (
            <BookSpine key={i} {...b} />
          ))}
        </div>
        <div style={{ height: 1, background: "var(--hairline-strong)" }} />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: "33%" }}>
          {[
            { c: TOKENS.color.pinBookstore, h: "85%", w: 16 },
            { c: TOKENS.color.pinLibrary, h: "100%", w: 14, gold: true },
            { c: "#3a4250", h: "70%", w: 12 },
            { c: "#3a4250", h: "85%", w: 18 },
            { c: "#3a4250", h: "75%", w: 14 },
            { c: "#3a4250", h: "65%", w: 13 },
            { c: "#3a4250", h: "80%", w: 14 },
            { c: "#3a4250", h: "65%", w: 14 },
            { c: "#3a4250", h: "78%", w: 13 },
          ].map((b, i) => (
            <BookSpine key={i} {...b} />
          ))}
        </div>
      </div>

      {/* 펜던트 조명 */}
      <div
        style={{
          position: "absolute",
          top: "0%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 36,
          background: "#3a3328",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 50,
          height: 30,
          borderRadius: "0 0 25px 25px / 0 0 24px 24px",
          background:
            "linear-gradient(180deg, #2a2018 0%, #1a140f 100%)",
          border: "1px solid #3a3328",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 120,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(242,184,114,0.4) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function BookSpine({ c, h, w, gold }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        background: `linear-gradient(180deg, ${c}, ${darken(c, 0.18)})`,
        borderRadius: "1px 1px 0 0",
        borderTop: gold ? `2px solid ${TOKENS.color.goldVisited}` : "none",
        boxShadow: gold ? `0 0 6px ${TOKENS.color.goldVisited}77` : "none",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 1,
          right: 1,
          top: "20%",
          height: 1,
          background: "rgba(255,235,200,0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1,
          right: 1,
          bottom: "20%",
          height: 1,
          background: "rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------------
// SC-02 회원가입 — 폼 디자인 패턴
// ----------------------------------------------------------------------------
function SignupScreen({ onNavigate }) {
  const [email, setEmail] = useStateA("seoyeon@test.com");
  const [pw, setPw] = useStateA("••••••••");
  const [nick, setNick] = useStateA("서연");

  const allOk = email && pw && nick;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "var(--bg-midnight)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StatusBar tint="paper" />

      {/* 따뜻한 펜던트 글로우 */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -40,
          width: 320,
          height: 320,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(242,184,114,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <ScreenHeader title="" onBack={() => onNavigate("onboarding")} transparent />

      <div
        className="phone-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "8px 24px 16px", position: "relative", zIndex: 5 }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: TOKENS.color.accentLamp,
            letterSpacing: 3,
            marginBottom: 10,
          }}
        >
          SIGN UP · 02
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display-kr)",
            fontSize: 26,
            fontWeight: 700,
            color: "var(--paper)",
            letterSpacing: -0.6,
            lineHeight: 1.25,
          }}
        >
          작은 책방의 발견,
          <br />
          서연 님의 책장을 만들어요.
        </h1>
        <p
          style={{
            margin: "10px 0 28px",
            fontFamily: "var(--font-ui)",
            fontSize: 13.5,
            color: "var(--paper-dim)",
            letterSpacing: -0.1,
            lineHeight: 1.6,
          }}
        >
          이메일과 비밀번호만 있으면 시작할 수 있어요.
        </p>

        <TextInput
          label="이메일"
          placeholder="example@email.com"
          value={email}
          validation={{ status: "ok", message: "사용 가능한 이메일이에요" }}
        />
        <TextInput
          label="비밀번호"
          placeholder="6자 이상"
          value={pw}
          type="password"
          validation={{ status: "ok", message: "6자 이상 입력됐어요" }}
        />
        <TextInput
          label="닉네임"
          placeholder="2~12자, 한글/영문/숫자"
          value={nick}
          validation={{ status: "ok", message: "사용 가능한 닉네임이에요" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "12px 14px",
            background: "var(--surface-01)",
            border: "1px solid var(--hairline)",
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: TOKENS.color.accentLamp,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TOKENS.color.bgMidnight,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <IconCheck size={11} />
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: "var(--font-ui)",
              fontSize: 11.5,
              color: "var(--paper-dim)",
              lineHeight: 1.55,
              letterSpacing: -0.05,
            }}
          >
            <span style={{ color: "var(--paper)" }}>이용약관</span> 및{" "}
            <span style={{ color: "var(--paper)" }}>개인정보처리방침</span>에 동의합니다.
            <br />
            가입 후 위치 권한을 요청해요.
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "12px 24px 28px",
          background: "var(--bg-midnight)",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <PrimaryButton onClick={() => onNavigate("map")} disabled={!allOk}>
          가입하고 시작하기
        </PrimaryButton>
        <p
          style={{
            margin: "14px 0 0",
            textAlign: "center",
            fontFamily: "var(--font-ui)",
            fontSize: 12.5,
            color: "var(--paper-mute)",
          }}
        >
          이미 계정이 있나요?{" "}
          <button
            onClick={() => onNavigate("login")}
            style={{
              color: "var(--accent-lamp)",
              fontWeight: 700,
              fontSize: 12.5,
            }}
          >
            로그인 →
          </button>
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// SC-03 로그인
// ----------------------------------------------------------------------------
function LoginScreen({ onNavigate }) {
  const [email, setEmail] = useStateA("");
  const [pw, setPw] = useStateA("");

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "var(--bg-midnight)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StatusBar tint="paper" />

      <div
        style={{
          position: "absolute",
          top: -80,
          left: -40,
          width: 320,
          height: 320,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(242,184,114,0.16) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <ScreenHeader title="" onBack={() => onNavigate("onboarding")} transparent />

      <div
        className="phone-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "16px 24px 16px", position: "relative", zIndex: 5 }}
      >
        {/* 로고 */}
        <div
          style={{
            margin: "8px 0 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, var(--accent-lamp), var(--accent-lamp-deep))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 28px ${TOKENS.color.accentLamp}66`,
              marginBottom: 14,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#1A1410">
              <path d="M5 4h11a3 3 0 013 3v13a1 1 0 01-1 1H7a2 2 0 01-2-2V4z" />
              <rect x="3" y="4" width="2.5" height="17" rx="0.5" />
            </svg>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: TOKENS.color.accentLamp,
              letterSpacing: 3,
            }}
          >
            LOG IN · 03
          </div>
          <h1
            style={{
              margin: "8px 0 0",
              fontFamily: "var(--font-display-kr)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--paper)",
              letterSpacing: -0.6,
              lineHeight: 1.25,
            }}
          >
            다시 오신 걸 환영해요
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontFamily: "var(--font-ui)",
              fontSize: 13.5,
              color: "var(--paper-dim)",
              letterSpacing: -0.1,
            }}
          >
            오늘은 어느 책방에 들러볼까요?
          </p>
        </div>

        <TextInput label="이메일" placeholder="example@email.com" value={email} />
        <TextInput label="비밀번호" placeholder="비밀번호 입력" value={pw} type="password" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -8 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-ui)",
              fontSize: 12.5,
              color: "var(--paper-dim)",
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: "var(--surface-02)",
                border: "1px solid var(--hairline-strong)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconCheck size={11} />
            </span>
            자동 로그인
          </label>
          <button
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12.5,
              color: "var(--paper-dim)",
              fontWeight: 500,
            }}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "12px 24px 28px",
          background: "var(--bg-midnight)",
        }}
      >
        <PrimaryButton onClick={() => onNavigate("map")}>로그인</PrimaryButton>
        <p
          style={{
            margin: "14px 0 0",
            textAlign: "center",
            fontFamily: "var(--font-ui)",
            fontSize: 12.5,
            color: "var(--paper-mute)",
          }}
        >
          계정이 없나요?{" "}
          <button
            onClick={() => onNavigate("signup")}
            style={{
              color: "var(--accent-lamp)",
              fontWeight: 700,
              fontSize: 12.5,
            }}
          >
            회원가입 →
          </button>
        </p>
      </div>
    </div>
  );
}

Object.assign(window, {
  OnboardingScreen,
  SignupScreen,
  LoginScreen,
});
