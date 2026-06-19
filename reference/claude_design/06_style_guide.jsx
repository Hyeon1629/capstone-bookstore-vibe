// 스타일 가이드 — A. 단일 화면 정리물
// 컬러 / 타이포 / 스페이싱 / 코너·그림자 / 컴포넌트 / 지도 핀

function StyleGuide() {
  return (
    <div
      style={{
        background: "var(--bg-midnight)",
        color: "var(--paper)",
        padding: "48px 56px 80px",
        minHeight: "100%",
        fontFamily: "var(--font-ui)",
      }}
    >
      <SGHeader />
      <SGColors />
      <SGTypography />
      <SGSpacing />
      <SGRadiusShadow />
      <SGComponents />
      <SGMapPins />
    </div>
  );
}

// ─── HEADER ─────────────────────────────────────────────────────────────
function SGHeader() {
  return (
    <div
      style={{
        marginBottom: 56,
        paddingBottom: 32,
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: TOKENS.color.accentLamp,
            letterSpacing: 3,
          }}
        >
          PHASE 3 · STYLE GUIDE
        </span>
        <span style={{ color: "var(--paper-mute)" }}>·</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: "var(--paper-mute)",
            letterSpacing: 1,
          }}
        >
          v1.0 · 2026.05.21
        </span>
      </div>
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-display-kr)",
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: -1.2,
          lineHeight: 1.15,
        }}
      >
        늦은 책방 — <span style={{ color: TOKENS.color.accentLamp }}>Late Bookshop</span>
      </h1>
      <p
        style={{
          margin: "10px 0 0",
          fontFamily: "var(--font-ui)",
          fontSize: 14,
          color: "var(--paper-dim)",
          maxWidth: 640,
          lineHeight: 1.65,
        }}
      >
        다크 베이스 + 따뜻한 액센트. 서점 골목의 펜던트 조명, 헌책방의 차분한 무게감을 시각 언어로
        정리한 토큰 시스템. 모든 화면에서 동일한 토큰을 사용합니다.
      </p>
    </div>
  );
}

// ─── COLORS ────────────────────────────────────────────────────────────
function SGColors() {
  const groups = [
    {
      title: "Base · 다크 베이스",
      desc: "순검정 ❌. 미세 코발트+따뜻한 그레이의 잉크 톤. 카드·시트는 한 단계씩 밝게.",
      swatches: [
        { name: "bg/midnight", hex: "#13171E", role: "본 배경" },
        { name: "bg/deeper", hex: "#0D1116", role: "스크림·오버레이" },
        { name: "surface/01", hex: "#1D232C", role: "카드" },
        { name: "surface/02", hex: "#2A313C", role: "시트·모달" },
        { name: "surface/03", hex: "#353D4A", role: "Pressed" },
        { name: "hairline", hex: "#2B323D", role: "1px 구분선" },
      ],
    },
    {
      title: "Paper · 종이 전경",
      desc: "약간 누런 종이 화이트. 다크 위 본문 가독성을 담당.",
      swatches: [
        { name: "paper", hex: "#F2EAD9", role: "본문 전경" },
        { name: "paper/soft", hex: "#E8DEC8", role: "강조 카드 위" },
        { name: "paper/dim", hex: "#C3B9A6", role: "보조 텍스트" },
        { name: "paper/mute", hex: "#847D70", role: "캡션·플레이스홀더" },
      ],
    },
    {
      title: "Accent · 펜던트 앰버",
      desc: "책방 조명색. CTA·강조 1개. 동시에 1~2개만 사용.",
      swatches: [
        { name: "accent/lamp", hex: "#F2B872", role: "Primary 액센트" },
        { name: "accent/lamp/deep", hex: "#D99852", role: "Hover·Pressed" },
        { name: "gold/visited", hex: "#F5CD6E", role: "방문 완료 강조 배지" },
      ],
    },
    {
      title: "Category Pin · 카테고리 핀 (색 + 형태)",
      desc: "색약 사용자 구분을 위해 색 + 글리프(book / cup) 동시 사용. 방문 시 같은 색 + 골드 배지.",
      swatches: [
        { name: "pin/bookstore", hex: "#E8804D", role: "서점·헌책방" },
        { name: "pin/library", hex: "#8AB293", role: "도서관·북카페" },
      ],
    },
    {
      title: "Semantic · 시맨틱",
      desc: "영업 상태·폼 검증. 페르소나 무드와 충돌하지 않게 채도를 낮춤.",
      swatches: [
        { name: "ok", hex: "#8AB293", role: "영업 중 / 검증 OK" },
        { name: "error", hex: "#E07A6B", role: "검증 실패 / 영업 종료 강조" },
        { name: "info", hex: "#7AA5C4", role: "현재 위치 / 정보" },
      ],
    },
  ];

  return (
    <SGSection title="01 · COLOR" subtitle="컬러 시스템 — 모든 hex는 토큰 키와 1:1 매핑">
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {groups.map((g) => (
          <div key={g.title}>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontFamily: "var(--font-display-kr)",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: -0.3,
                  marginBottom: 4,
                }}
              >
                {g.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 12.5,
                  color: "var(--paper-dim)",
                  letterSpacing: -0.1,
                  maxWidth: 700,
                }}
              >
                {g.desc}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {g.swatches.map((s) => (
                <Swatch key={s.name} {...s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SGSection>
  );
}

function Swatch({ name, hex, role }) {
  const isDark = isHexDark(hex);
  return (
    <div
      style={{
        border: "1px solid var(--hairline)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--surface-01)",
      }}
    >
      <div
        style={{
          height: 88,
          background: hex,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: isDark ? "rgba(242,234,217,0.65)" : "rgba(20,15,10,0.7)",
            letterSpacing: 0.5,
          }}
        >
          {hex.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--paper)",
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11.5,
            color: "var(--paper-mute)",
            marginTop: 2,
          }}
        >
          {role}
        </div>
      </div>
    </div>
  );
}

function isHexDark(hex) {
  const { r, g, b } = hexToRgbLocal(hex);
  const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return l < 0.55;
}
function hexToRgbLocal(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function SGSection({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: TOKENS.color.accentLamp,
            letterSpacing: 2.5,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display-kr)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--paper)",
            letterSpacing: -0.4,
          }}
        >
          {subtitle}
        </div>
      </div>
      {children}
    </section>
  );
}

// ─── TYPOGRAPHY ─────────────────────────────────────────────────────────
function SGTypography() {
  const scale = [
    {
      name: "Display / H1",
      font: "Gowun Batang",
      weight: 700,
      size: 28,
      lh: 1.25,
      letter: -0.6,
      sample: "동네에 책방이 이렇게 많았어요",
      family: "var(--font-display-kr)",
    },
    {
      name: "Heading / H2",
      font: "Gowun Batang",
      weight: 700,
      size: 22,
      lh: 1.3,
      letter: -0.5,
      sample: "오늘 어떤 분위기였어요?",
      family: "var(--font-display-kr)",
    },
    {
      name: "Heading / H3",
      font: "Gowun Batang",
      weight: 700,
      size: 17,
      lh: 1.35,
      letter: -0.3,
      sample: "최근 방문자가 느낀 분위기",
      family: "var(--font-display-kr)",
    },
    {
      name: "Display / EN",
      font: "EB Garamond Italic",
      weight: 500,
      size: 16,
      lh: 1.3,
      letter: 0.1,
      sample: "Seongsu Bookshop · Quiet, lamplit",
      family: "var(--font-display-en)",
      style: "italic",
    },
    {
      name: "Subtitle / H4",
      font: "Pretendard",
      weight: 600,
      size: 14,
      lh: 1.5,
      letter: -0.1,
      sample: "독립출판 라운지 · 0.7km",
      family: "var(--font-ui)",
    },
    {
      name: "Body / 14",
      font: "Pretendard",
      weight: 400,
      size: 14,
      lh: 1.65,
      letter: -0.1,
      sample:
        "성수동 골목 안쪽, 조용히 책 한 권에 빠져들 수 있는 작은 책방. 평일 저녁이면 펜던트 조명이 따뜻하게 깜빡인다.",
      family: "var(--font-ui)",
    },
    {
      name: "Body Small / 13",
      font: "Pretendard",
      weight: 400,
      size: 13,
      lh: 1.55,
      letter: -0.05,
      sample: "이메일과 비밀번호만 있으면 시작할 수 있어요.",
      family: "var(--font-ui)",
    },
    {
      name: "Caption / 11.5",
      font: "Pretendard",
      weight: 500,
      size: 11.5,
      lh: 1.45,
      letter: 0.1,
      sample: "현재 위치에서 0.3km · 도보 5분",
      family: "var(--font-ui)",
    },
    {
      name: "Mono / Eyebrow",
      font: "IBM Plex Mono",
      weight: 500,
      size: 10.5,
      lh: 1.3,
      letter: 2.5,
      sample: "STAMP COLLECTED · #013",
      family: "var(--font-mono)",
      upper: true,
    },
  ];

  return (
    <SGSection
      title="02 · TYPOGRAPHY"
      subtitle="페어링 2 · Vintage Warmth — Gowun Batang × Pretendard × IBM Plex Mono"
    >
      {/* 페어링 카드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <FontCard
          family="var(--font-display-kr)"
          role="HEADING"
          name="Gowun Batang"
          desc="한글 손글씨 기미가 도는 따뜻한 명조. 한국 책방의 정서를 직접적으로."
          weights="400 · 700"
        />
        <FontCard
          family="var(--font-display-en)"
          name="EB Garamond"
          role="HEADING — EN"
          desc="이탤릭이 빛나는 클래식 가람. 영문 소제목·인용에 한정."
          weights="400 · 500 · 600 italic"
          italic
        />
        <FontCard
          family="var(--font-ui)"
          name="Pretendard"
          role="BODY / UI"
          desc="한·영 모두 안정적인 모던 산세리프. 본문·버튼·인풋 전부."
          weights="400 · 500 · 600 · 700"
        />
      </div>

      {/* 타이포 스케일 */}
      <div
        style={{
          border: "1px solid var(--hairline)",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--surface-01)",
        }}
      >
        {scale.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr 200px",
              gap: 24,
              padding: "20px 24px",
              borderBottom:
                i === scale.length - 1 ? "none" : "1px solid var(--hairline)",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: TOKENS.color.accentLamp,
                  letterSpacing: 0.8,
                  marginBottom: 4,
                }}
              >
                {row.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11.5,
                  color: "var(--paper-mute)",
                  letterSpacing: 0,
                }}
              >
                {row.font} · {row.weight}
              </div>
            </div>
            <div
              style={{
                fontFamily: row.family,
                fontWeight: row.weight,
                fontSize: row.size,
                lineHeight: row.lh,
                letterSpacing: row.letter,
                color: "var(--paper)",
                fontStyle: row.style || "normal",
                textTransform: row.upper ? "uppercase" : "none",
              }}
            >
              {row.sample}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: "var(--paper-mute)",
                letterSpacing: 0.5,
                textAlign: "right",
                lineHeight: 1.6,
              }}
            >
              {row.size}px / {Math.round(row.size * row.lh)}px
              <br />
              ls {row.letter > 0 ? "+" : ""}
              {row.letter}
            </div>
          </div>
        ))}
      </div>
    </SGSection>
  );
}

function FontCard({ family, name, role, desc, weights, italic }) {
  return (
    <div
      style={{
        background: "var(--surface-01)",
        border: "1px solid var(--hairline)",
        borderRadius: 14,
        padding: 22,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: TOKENS.color.accentLamp,
          letterSpacing: 2,
          marginBottom: 14,
        }}
      >
        {role}
      </div>
      <div
        style={{
          fontFamily: family,
          fontStyle: italic ? "italic" : "normal",
          fontSize: 56,
          fontWeight: 700,
          color: "var(--paper)",
          letterSpacing: italic ? 0 : -2,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {italic ? "Aa" : "가나"}
      </div>
      <div
        style={{
          fontFamily: family,
          fontStyle: italic ? "italic" : "normal",
          fontSize: 17,
          fontWeight: 600,
          color: "var(--paper)",
          marginTop: 14,
          letterSpacing: -0.2,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 11.5,
          color: "var(--paper-dim)",
          marginTop: 6,
          lineHeight: 1.55,
          letterSpacing: -0.1,
        }}
      >
        {desc}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--paper-mute)",
          marginTop: 12,
          letterSpacing: 0.5,
        }}
      >
        {weights}
      </div>
    </div>
  );
}

// ─── SPACING ─────────────────────────────────────────────────────────
function SGSpacing() {
  const tokens = [
    { name: "space/1", px: 4, role: "icon padding" },
    { name: "space/2", px: 8, role: "chip gap, micro" },
    { name: "space/3", px: 12, role: "list row" },
    { name: "space/4", px: 16, role: "card padding S" },
    { name: "space/5", px: 20, role: "screen padding" },
    { name: "space/6", px: 24, role: "card padding M" },
    { name: "space/8", px: 32, role: "section gap" },
    { name: "space/10", px: 40, role: "block gap" },
    { name: "space/12", px: 48, role: "page top" },
  ];

  return (
    <SGSection
      title="03 · SPACING"
      subtitle="8px 베이스 스케일 — 모든 간격 토큰은 8의 배수 (예외: 4, 12)"
    >
      <div
        style={{
          border: "1px solid var(--hairline)",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--surface-01)",
        }}
      >
        {tokens.map((t, i) => (
          <div
            key={t.name}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 80px 1fr 1fr",
              gap: 24,
              alignItems: "center",
              padding: "14px 24px",
              borderBottom: i === tokens.length - 1 ? "none" : "1px solid var(--hairline)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--paper)",
                fontWeight: 600,
              }}
            >
              {t.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: TOKENS.color.accentLamp,
                letterSpacing: 0.5,
              }}
            >
              {t.px}px
            </div>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 12.5,
                color: "var(--paper-dim)",
              }}
            >
              {t.role}
            </div>
            <div>
              <div
                style={{
                  height: 18,
                  width: t.px,
                  background:
                    "linear-gradient(90deg, var(--accent-lamp), var(--accent-lamp-deep))",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </SGSection>
  );
}

// ─── RADIUS + SHADOW ──────────────────────────────────────────────────
function SGRadiusShadow() {
  return (
    <SGSection
      title="04 · RADIUS & SHADOW"
      subtitle="부드러운 코너, 검정 ❌ — 베이스에 따뜻함을 섞은 그림자만"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Radius */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--paper-mute)",
              letterSpacing: 1.5,
              marginBottom: 16,
            }}
          >
            CORNER RADIUS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "r/btn", px: 10, role: "버튼" },
              { name: "r/input", px: 12, role: "인풋·칩 강조" },
              { name: "r/card", px: 16, role: "카드" },
              { name: "r/sheet", px: 24, role: "시트·모달·온보딩 카드" },
              { name: "r/pill", px: 999, role: "칩·FAB·아바타" },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 12,
                  border: "1px solid var(--hairline)",
                  borderRadius: 12,
                  background: "var(--surface-01)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background:
                      "linear-gradient(135deg, var(--surface-02), var(--surface-03))",
                    border: "1px solid var(--hairline-strong)",
                    borderRadius: r.px,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--paper)",
                      fontWeight: 600,
                    }}
                  >
                    {r.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--paper-dim)", marginTop: 2 }}>
                    {r.role}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: TOKENS.color.accentLamp,
                  }}
                >
                  {r.px === 999 ? "full" : `${r.px}px`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shadow */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--paper-mute)",
              letterSpacing: 1.5,
              marginBottom: 16,
            }}
          >
            ELEVATION & GLOW
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ShadowSwatch
              name="shadow/soft"
              role="카드 살짝 띄움"
              shadow="0 8px 24px -10px rgba(30, 20, 12, 0.5)"
            />
            <ShadowSwatch
              name="shadow/warm"
              role="시트·모달 — 따뜻한 잉크 톤"
              shadow="0 18px 36px -16px rgba(30, 20, 12, 0.55), 0 4px 12px -2px rgba(20, 14, 8, 0.4)"
            />
            <ShadowSwatch
              name="shadow/glow"
              role="펜던트 글로우 (스탬프·강조)"
              shadow={`0 0 28px -4px ${TOKENS.color.accentLamp}55`}
              accent
            />
          </div>
        </div>
      </div>
    </SGSection>
  );
}

function ShadowSwatch({ name, role, shadow, accent }) {
  return (
    <div
      style={{
        padding: 24,
        background: "var(--bg-midnight)",
        border: "1px solid var(--hairline)",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          width: 80,
          height: 56,
          borderRadius: 12,
          background: accent
            ? "linear-gradient(135deg, var(--accent-lamp), var(--accent-lamp-deep))"
            : "var(--surface-02)",
          border: accent ? "none" : "1px solid var(--hairline-strong)",
          boxShadow: shadow,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--paper)",
            fontWeight: 600,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 12, color: "var(--paper-dim)", marginTop: 2 }}>{role}</div>
      </div>
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────
function SGComponents() {
  return (
    <SGSection
      title="05 · COMPONENTS"
      subtitle="핵심 컴포넌트 — Buttons · Inputs · Chips · Cards · Pins"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ComponentCard title="Primary Button">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PrimaryButton>가입하고 시작하기</PrimaryButton>
            <PrimaryButton disabled>비활성 상태</PrimaryButton>
          </div>
        </ComponentCard>
        <ComponentCard title="Secondary Button">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SecondaryButton>건너뛰기</SecondaryButton>
            <button
              style={{
                width: "100%",
                padding: "13px 20px",
                background: "var(--accent-lamp)",
                color: "var(--bg-midnight)",
                borderRadius: 10,
                fontFamily: "var(--font-ui)",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Accent · Lamp
            </button>
          </div>
        </ComponentCard>

        <ComponentCard title="Input · 검증 상태">
          <TextInput label="이메일" value="seoyeon@test.com" validation={{ status: "ok", message: "사용 가능" }} />
          <TextInput label="비밀번호" value="abc" type="password" validation={{ status: "error", message: "6자 이상 입력해주세요" }} />
        </ComponentCard>

        <ComponentCard title="Chip · 필터">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Chip active>전체 · 12</Chip>
            <Chip leftDot={TOKENS.color.pinBookstore}>서점·헌책방</Chip>
            <Chip leftDot={TOKENS.color.pinLibrary}>도서관·북카페</Chip>
            <Chip leftDot={TOKENS.color.goldVisited}>방문 완료</Chip>
          </div>
        </ComponentCard>

        <ComponentCard title="Card · 책방 미리보기" full>
          <div
            style={{
              background: "var(--surface-01)",
              border: "1px solid var(--hairline)",
              borderRadius: 20,
              boxShadow: "var(--shadow-warm)",
              padding: 14,
              display: "flex",
              gap: 12,
            }}
          >
            <ImagePlaceholder
              ratio="1/1"
              variant="warm"
              label=""
              icon={false}
              style={{ width: 72, height: 72, borderRadius: 12 }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10.5, color: "var(--paper-mute)", letterSpacing: 0.3, textTransform: "uppercase", fontWeight: 500, marginBottom: 3 }}>
                  서점·헌책방
                </div>
                <div style={{ fontFamily: "var(--font-display-kr)", fontWeight: 700, fontSize: 16, letterSpacing: -0.3, color: "var(--paper)" }}>
                  독립출판 라운지
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: TOKENS.color.ok, fontWeight: 600 }}>
                ● 영업 중 · 0.7km
              </div>
            </div>
            <button
              style={{
                alignSelf: "stretch",
                padding: "0 14px",
                background: "var(--paper)",
                color: "var(--bg-midnight)",
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              상세 →
            </button>
          </div>
        </ComponentCard>
      </div>
    </SGSection>
  );
}

function ComponentCard({ title, children, full }) {
  return (
    <div
      style={{
        background: "var(--surface-01)",
        border: "1px solid var(--hairline)",
        borderRadius: 14,
        padding: 20,
        gridColumn: full ? "1 / -1" : "auto",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: "var(--paper-mute)",
          letterSpacing: 1.5,
          marginBottom: 14,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── MAP PINS — 핵심 ───────────────────────────────────────────────────
function SGMapPins() {
  const cells = [
    { label: "서점·헌책방 — 미방문", type: "bookstore", visited: false },
    { label: "서점·헌책방 — 방문 완료", type: "bookstore", visited: true },
    { label: "도서관·북카페 — 미방문", type: "library", visited: false },
    { label: "도서관·북카페 — 방문 완료", type: "library", visited: true },
  ];

  return (
    <SGSection
      title="06 · MAP PINS"
      subtitle="2종 카테고리 × 미방문 / 방문 완료 — 색약 사용자도 글리프(book / cup)로 구분"
    >
      <div
        style={{
          padding: "32px 24px",
          background:
            "radial-gradient(ellipse at 30% 20%, #1f2731 0%, #161b23 100%)",
          borderRadius: 18,
          border: "1px solid var(--hairline-strong)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {cells.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              padding: "20px 12px",
              background: "rgba(13, 17, 22, 0.4)",
              border: "1px solid var(--hairline)",
              borderRadius: 14,
            }}
          >
            <div style={{ height: 56, display: "flex", alignItems: "flex-end" }}>
              <MapPin type={c.type} visited={c.visited} size={48} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11.5,
                color: "var(--paper-dim)",
                textAlign: "center",
                letterSpacing: -0.05,
                fontWeight: 500,
                lineHeight: 1.45,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: c.type === "library" ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore,
                letterSpacing: 0.5,
              }}
            >
              {c.type === "library" ? "#8AB293" : "#E8804D"}
              {c.visited && <span style={{ color: TOKENS.color.goldVisited }}> + ★</span>}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 18,
          padding: "16px 20px",
          background: "var(--surface-01)",
          border: "1px solid var(--hairline)",
          borderRadius: 12,
          display: "flex",
          gap: 24,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: TOKENS.color.pinBookstore }} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--paper)" }}>
            서점·헌책방 — book glyph
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: TOKENS.color.pinLibrary }} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--paper)" }}>
            도서관·북카페 — cup glyph
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: TOKENS.color.goldVisited }} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--paper)" }}>
            방문 완료 — 같은 색 + 골드 별 배지
          </span>
        </div>
      </div>
    </SGSection>
  );
}

window.StyleGuide = StyleGuide;
window.SGSection = SGSection;
