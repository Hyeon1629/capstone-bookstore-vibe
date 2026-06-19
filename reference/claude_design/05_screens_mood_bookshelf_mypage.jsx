// SC-06 분위기 입력, SC-07 마이 북쉘프, SC-08 마이페이지

const { useState: useStateC, useEffect: useEffectC } = React;

// ----------------------------------------------------------------------------
// SC-06 분위기 입력 — 인증 직후의 기쁜 순간 (모달)
// ----------------------------------------------------------------------------
function MoodInputScreen({ onNavigate }) {
  const [selected, setSelected] = useStateC(null);
  const moods = [
    { emoji: "☕", label: "독서" },
    { emoji: "🌧️", label: "비오는" },
    { emoji: "🎶", label: "음악" },
    { emoji: "🤫", label: "한적한" },
    { emoji: "☀️", label: "햇살" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(242,184,114,0.18) 0%, rgba(19,23,30,0) 60%), var(--bg-midnight)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <StatusBar tint="paper" />

      {/* 배경 — 부드럽게 어두워진 지도 그림자 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          background:
            "repeating-linear-gradient(0deg, transparent 0 23px, rgba(242,234,217,0.06) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(242,234,217,0.06) 23px 24px)",
          pointerEvents: "none",
        }}
      />

      {/* 떠있는 작은 별/스파클들 */}
      <Sparkles />

      {/* 핵심 카드 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: "100%",
            background: "var(--surface-01)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 24,
            padding: "28px 24px 24px",
            boxShadow: "var(--shadow-warm), var(--shadow-glow)",
            position: "relative",
          }}
        >
          {/* 황금 스탬프 */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 35% 30%, #FFE0A0, #F5CD6E 35%, #D99852 75%, #A67035 100%)",
              boxShadow: `0 0 32px ${TOKENS.color.goldVisited}66, inset 0 -3px 6px rgba(80,40,10,0.5), inset 0 3px 3px rgba(255,240,200,0.4)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              position: "relative",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#1A1410">
              <path d="M12 2l2.6 6.8 7.4.6-5.6 4.8 1.8 7.2L12 17.5 5.8 21.4l1.8-7.2L2 9.4l7.4-.6L12 2z" />
            </svg>
            {/* glow ring */}
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: 999,
                border: "1px dashed rgba(245,205,110,0.4)",
                animation: "spin 12s linear infinite",
              }}
            />
          </div>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: TOKENS.color.accentLamp,
              letterSpacing: 3,
              textAlign: "center",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            STAMP COLLECTED · #013
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display-kr)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--paper)",
              textAlign: "center",
              letterSpacing: -0.5,
              lineHeight: 1.3,
            }}
          >
            방문 인증 완료
          </h2>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13.5,
              color: "var(--paper-dim)",
              textAlign: "center",
              marginTop: 6,
              letterSpacing: -0.1,
            }}
          >
            <span style={{ color: "var(--paper)", fontWeight: 600 }}>성수 책방</span>
            에 다녀오셨네요.
          </div>

          <div
            style={{
              margin: "22px -4px 18px",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--hairline-strong) 20%, var(--hairline-strong) 80%, transparent)",
            }}
          />

          <div
            style={{
              fontFamily: "var(--font-display-kr)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--paper)",
              textAlign: "center",
              marginBottom: 14,
              letterSpacing: -0.2,
            }}
          >
            오늘 어떤 분위기였어요?
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {moods.map((m, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "12px 4px",
                    background: isSelected
                      ? "linear-gradient(180deg, rgba(242,184,114,0.18), rgba(242,184,114,0.08))"
                      : "var(--surface-02)",
                    border: `1.5px solid ${isSelected ? "var(--accent-lamp)" : "var(--hairline)"}`,
                    borderRadius: 12,
                    transform: isSelected ? "translateY(-2px)" : "none",
                    transition: "all .18s",
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      transform: isSelected ? "scale(1.08)" : "scale(1)",
                      transition: "transform .18s",
                    }}
                  >
                    {m.emoji}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 10.5,
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "var(--accent-lamp)" : "var(--paper-dim)",
                      letterSpacing: -0.1,
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          <PrimaryButton onClick={() => onNavigate("bookshelf")} disabled={selected === null}>
            북쉘프에 기록하기
          </PrimaryButton>
          <button
            onClick={() => onNavigate("bookshelf")}
            style={{
              width: "100%",
              padding: "12px 0 4px",
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--paper-mute)",
              fontWeight: 500,
            }}
          >
            건너뛰기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

function Sparkles() {
  const sparks = [
    { l: "12%", t: "18%", s: 8, d: 0 },
    { l: "82%", t: "22%", s: 10, d: 1.2 },
    { l: "20%", t: "78%", s: 7, d: 0.4 },
    { l: "78%", t: "76%", s: 9, d: 0.8 },
    { l: "50%", t: "10%", s: 6, d: 1.6 },
    { l: "8%", t: "48%", s: 5, d: 0.6 },
    { l: "90%", t: "52%", s: 6, d: 1.4 },
  ];
  return (
    <>
      {sparks.map((sp, i) => (
        <svg
          key={i}
          width={sp.s}
          height={sp.s}
          viewBox="0 0 24 24"
          fill={TOKENS.color.accentLamp}
          style={{
            position: "absolute",
            left: sp.l,
            top: sp.t,
            opacity: 0.6,
            animation: `twinkle 3s ease-in-out ${sp.d}s infinite`,
            zIndex: 2,
          }}
        >
          <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
        </svg>
      ))}
    </>
  );
}

// ----------------------------------------------------------------------------
// SC-07 마이 북쉘프 — "수집의 만족감" 시각화
// ----------------------------------------------------------------------------
function BookshelfScreen({ onNavigate }) {
  const visits = [
    { id: 1, name: "성수 책방", date: "오늘", type: "library", mood: "☕" },
    { id: 2, name: "독립출판 라운지", date: "3일 전", type: "bookstore", mood: "🤫" },
    { id: 3, name: "책 사이 도서관", date: "1주일 전", type: "library", mood: "🌧️" },
    { id: 4, name: "합정 헌책방", date: "2주일 전", type: "bookstore", mood: "🎶" },
    { id: 5, name: "구름책방", date: "3주일 전", type: "bookstore", mood: "☀️" },
    { id: 6, name: "낮잠 북카페", date: "1개월 전", type: "library", mood: "☕" },
  ];

  const totalCount = 13;
  const monthCount = 4;

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
        className="phone-scroll"
        style={{ flex: 1, overflowY: "auto", paddingBottom: 92 }}
      >
        {/* 헤더 */}
        <div style={{ padding: "12px 20px 6px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--paper-mute)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            MY BOOKSHELF
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display-kr)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--paper)",
              letterSpacing: -0.6,
              lineHeight: 1.2,
            }}
          >
            서연 님의 북쉘프
          </h1>
        </div>

        {/* 누적 통계 — 마치 책 등 */}
        <div
          style={{
            margin: "18px 20px 0",
            padding: "20px 20px 22px",
            background:
              "linear-gradient(135deg, #1f2731 0%, #1a212b 100%)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 등받이 같은 누런 띠 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background:
                "linear-gradient(90deg, transparent, var(--accent-lamp) 20%, var(--gold-visited, #F5CD6E) 80%, transparent)",
              opacity: 0.7,
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StatItem value={totalCount} label="누적 방문" accent />
            <StatItem value={monthCount} label="이번 달" />
          </div>
        </div>

        {/* 방문 지도 미니뷰 */}
        <div style={{ padding: "22px 20px 4px" }}>
          <SectionTitle title="내 방문 지도" right="지난 30일" />
          <div
            style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--hairline)",
              background:
                "radial-gradient(ellipse at 50% 50%, #1a212a 0%, #131820 100%)",
              height: 180,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 335 180"
              preserveAspectRatio="xMidYMid slice"
              style={{ position: "absolute", inset: 0 }}
            >
              {/* 잉크 블록 */}
              <g fill="#1d242f" stroke="#272f3a" strokeWidth="1">
                <polygon points="0,0 110,0 110,55 60,75 0,70" />
                <polygon points="120,0 230,0 230,60 170,80 120,55" />
                <polygon points="240,0 335,0 335,75 270,85" />
                <polygon points="0,85 60,85 90,120 50,150 0,140" />
                <polygon points="105,90 200,90 220,130 160,150 105,140" />
                <polygon points="230,95 335,95 335,180 260,180" />
                <polygon points="0,150 70,150 80,180 0,180" />
                <polygon points="90,160 200,160 210,180 90,180" />
              </g>
              {/* 도로 */}
              <g stroke="#3a3328" strokeWidth="0.7" opacity="0.5" fill="none">
                <line x1="0" y1="80" x2="335" y2="92" />
                <line x1="0" y1="155" x2="335" y2="148" />
                <line x1="115" y1="0" x2="120" y2="180" />
                <line x1="230" y1="0" x2="225" y2="180" />
              </g>
            </svg>

            {/* 방문한 핀 — 컬러 + 골드 */}
            {[
              { x: 18, y: 28, type: "bookstore" },
              { x: 42, y: 32, type: "library" },
              { x: 70, y: 25, type: "bookstore" },
              { x: 28, y: 60, type: "library" },
              { x: 55, y: 65, type: "bookstore" },
              { x: 82, y: 55, type: "library" },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -100%)",
                  filter: `drop-shadow(0 0 8px ${
                    p.type === "library" ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore
                  }aa)`,
                }}
              >
                <MapPin type={p.type} visited size={20} />
              </div>
            ))}

            {/* 미방문 핀 — 흐릿한 회색 */}
            {[
              { x: 35, y: 45 },
              { x: 60, y: 40 },
              { x: 12, y: 78 },
              { x: 75, y: 78 },
              { x: 90, y: 28 },
              { x: 48, y: 84 },
              { x: 22, y: 90 },
              { x: 88, y: 88 },
            ].map((p, i) => (
              <div
                key={`u-${i}`}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#3a4250",
                  border: "1.5px solid #4a5260",
                }}
              />
            ))}

            {/* legend */}
            <div
              style={{
                position: "absolute",
                left: 12,
                bottom: 10,
                display: "flex",
                gap: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--paper-dim)",
                letterSpacing: 0.5,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: TOKENS.color.goldVisited }} />
                방문 {totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* 방문 기록 리스트 */}
        <div style={{ padding: "18px 20px 0" }}>
          <SectionTitle title="방문 기록" right={`최신순 · ${visits.length}건`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {visits.map((v, i) => (
              <VisitRow
                key={v.id}
                visit={v}
                index={i}
                onClick={() => onNavigate("detail")}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="bookshelf" onNavigate={onNavigate} />
    </div>
  );
}

function StatItem({ value, label, accent }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-display-kr)",
          fontSize: 28,
          fontWeight: 700,
          color: accent ? "var(--accent-lamp)" : "var(--paper)",
          letterSpacing: -1,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          color: "var(--paper-mute)",
          fontWeight: 500,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SectionTitle({ title, right }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display-kr)",
          fontSize: 15,
          fontWeight: 700,
          color: "var(--paper)",
          letterSpacing: -0.2,
        }}
      >
        {title}
      </div>
      {right && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--paper-mute)",
            letterSpacing: 0.5,
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
}

function VisitRow({ visit, index, onClick }) {
  const color = visit.type === "library" ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 4px",
        borderBottom: "1px solid var(--hairline)",
        textAlign: "left",
      }}
    >
      {/* index — book spine number */}
      <div
        style={{
          width: 36,
          height: 44,
          borderRadius: 4,
          background: `linear-gradient(180deg, ${color}cc, ${color}88)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          flexShrink: 0,
          boxShadow: `inset 2px 0 0 ${color}, inset -1px 0 0 rgba(0,0,0,0.2)`,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            opacity: 0.85,
            letterSpacing: 0.5,
          }}
        >
          NO.
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-kr)",
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {String(13 - index).padStart(2, "0")}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display-kr)",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--paper)",
            letterSpacing: -0.2,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {visit.name}
          <span style={{ fontSize: 14 }}>{visit.mood}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 3,
            fontFamily: "var(--font-ui)",
            fontSize: 11.5,
            color: "var(--paper-mute)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: color,
              display: "inline-block",
            }}
          />
          {visit.type === "library" ? "도서관·북카페" : "서점·헌책방"}
          <span>·</span>
          <span>{visit.date}</span>
        </div>
      </div>
      <IconChevronRight size={16} />
    </button>
  );
}

// ----------------------------------------------------------------------------
// SC-08 마이페이지
// ----------------------------------------------------------------------------
function MyPageScreen({ onNavigate }) {
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

      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", paddingBottom: 92 }}>
        {/* 헤더 */}
        <div style={{ padding: "12px 20px 6px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--paper-mute)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            PROFILE
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display-kr)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--paper)",
              letterSpacing: -0.6,
            }}
          >
            마이페이지
          </h1>
        </div>

        {/* 프로필 카드 */}
        <div
          style={{
            margin: "18px 20px 0",
            padding: "22px 20px",
            background:
              "linear-gradient(135deg, #1f2731 0%, #1a212b 100%)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 따뜻한 펜던트 글로우 */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 140,
              height: 140,
              borderRadius: 999,
              background:
                "radial-gradient(circle, rgba(242,184,114,0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background:
                  "linear-gradient(135deg, #d99852 0%, #f2b872 60%, #f5cd6e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A1410",
                fontFamily: "var(--font-display-kr)",
                fontSize: 26,
                fontWeight: 700,
                border: "2px solid rgba(255,235,200,0.3)",
                boxShadow: `0 0 24px ${TOKENS.color.accentLamp}55`,
              }}
            >
              서
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-display-kr)",
                  fontSize: 19,
                  fontWeight: 700,
                  color: "var(--paper)",
                  letterSpacing: -0.3,
                }}
              >
                서연
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  color: "var(--paper-mute)",
                  letterSpacing: -0.1,
                }}
              >
                seoyeon@test.com
              </div>
              <div
                style={{
                  marginTop: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  color: TOKENS.color.accentLamp,
                  background: "rgba(242,184,114,0.1)",
                  border: "1px solid rgba(242,184,114,0.3)",
                  padding: "3px 7px",
                  borderRadius: 4,
                  letterSpacing: 0.5,
                }}
              >
                ★ EXPLORER · LV.2
              </div>
            </div>
          </div>

          <Hairline style={{ margin: "18px 0", background: "var(--hairline)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            <MiniStat value="13" label="누적 방문" />
            <MiniStat value="4" label="이번 달" />
          </div>
        </div>

        {/* 메뉴 그룹 1 */}
        <MenuGroup title="설정">
          <MenuItem icon={<IconBell size={17} />} label="알림 설정" right="켜짐" />
          <MenuItem icon={<IconSettings size={17} />} label="앱 정보" right="v1.0.0" />
        </MenuGroup>

        {/* 메뉴 그룹 2 */}
        <MenuGroup title="계정">
          <MenuItem
            icon={<IconLogout size={17} />}
            label="로그아웃"
            danger
            onClick={() => onNavigate("login")}
          />
        </MenuGroup>

        <div
          style={{
            textAlign: "center",
            padding: "24px 20px 8px",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--paper-mute)",
            letterSpacing: 0.5,
          }}
        >
          숨은 책방 · v1.0.0
        </div>
      </div>

      <BottomNav active="mypage" onNavigate={onNavigate} />
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div style={{ textAlign: "center", padding: "0 4px" }}>
      <div
        style={{
          fontFamily: "var(--font-display-kr)",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--paper)",
          letterSpacing: -0.5,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: "var(--font-ui)",
          fontSize: 10.5,
          color: "var(--paper-mute)",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function MenuGroup({ title, children }) {
  return (
    <div style={{ margin: "20px 20px 0" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--paper-mute)",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 8,
          paddingLeft: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: "var(--surface-01)",
          border: "1px solid var(--hairline)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function MenuItem({ icon, label, right, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        padding: "15px 16px",
        borderBottom: "1px solid var(--hairline)",
        textAlign: "left",
        color: danger ? TOKENS.color.error : "var(--paper)",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: danger
            ? "rgba(224,122,107,0.12)"
            : "var(--surface-02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "currentColor",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: "var(--font-ui)",
          fontSize: 14.5,
          fontWeight: 500,
          letterSpacing: -0.1,
        }}
      >
        {label}
      </span>
      {right && (
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            color: "var(--paper-mute)",
            marginRight: 6,
          }}
        >
          {right}
        </span>
      )}
      <IconChevronRight size={15} />
    </button>
  );
}

Object.assign(window, {
  MoodInputScreen,
  BookshelfScreen,
  MyPageScreen,
});
