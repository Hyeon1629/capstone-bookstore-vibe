// SC-04 지도 홈, SC-05 책방 상세 — 가장 중요한 두 화면

const { useState: useStateMap, useEffect: useEffectMap, useRef: useRefMap, useMemo: useMemoMap } = React;

// ----------------------------------------------------------------------------
// 가짜 책방 데이터
// ----------------------------------------------------------------------------
const BOOKSTORES = [
  { id: "b1", name: "성수 책방", type: "library", x: 52, y: 38, visited: true, district: "성수동1가", distance: "0.3km", hours: "10:00 — 22:00", status: "open", mood: ["☕ 독서하기 좋은 날", "🤫 한적한"] },
  { id: "b2", name: "독립출판 라운지", type: "bookstore", x: 32, y: 28, visited: true, district: "성수동2가", distance: "0.7km", hours: "12:00 — 21:00", status: "open" },
  { id: "b3", name: "골목책방 우리", type: "bookstore", x: 70, y: 32, visited: false, district: "서울숲", distance: "1.1km", hours: "11:00 — 20:00", status: "open" },
  { id: "b4", name: "책 사이 도서관", type: "library", x: 24, y: 55, visited: false, district: "성수동1가", distance: "0.5km", hours: "10:00 — 19:00", status: "open" },
  { id: "b5", name: "야간 독서실", type: "library", x: 58, y: 62, visited: false, district: "뚝섬", distance: "1.4km", hours: "14:00 — 02:00", status: "open" },
  { id: "b6", name: "합정 헌책방", type: "bookstore", x: 78, y: 58, visited: false, district: "합정동", distance: "2.0km", hours: "13:00 — 20:00", status: "closed" },
  { id: "b7", name: "공책점 우물", type: "bookstore", x: 40, y: 70, visited: false, district: "성수동2가", distance: "0.9km", hours: "12:00 — 19:00", status: "open" },
  { id: "b8", name: "낮잠 북카페", type: "library", x: 64, y: 78, visited: false, district: "성수동2가", distance: "1.6km", hours: "11:00 — 23:00", status: "open" },
  { id: "b9", name: "책방 모래", type: "bookstore", x: 18, y: 38, visited: false, district: "성수동1가", distance: "0.8km", hours: "12:00 — 20:00", status: "open" },
  { id: "b10", name: "버드나무 라이브러리", type: "library", x: 86, y: 46, visited: false, district: "서울숲", distance: "1.7km", hours: "10:00 — 22:00", status: "open" },
  { id: "b11", name: "구름책방", type: "bookstore", x: 46, y: 22, visited: false, district: "성수동1가", distance: "0.6km", hours: "11:00 — 21:00", status: "open" },
  { id: "b12", name: "노트 앤 페이지", type: "library", x: 30, y: 84, visited: false, district: "옥수동", distance: "2.2km", hours: "10:00 — 21:00", status: "closed" },
];

// ----------------------------------------------------------------------------
// 다크 무드 지도 배경 — 검정 ❌, 따뜻한 잉크 톤으로 그린다
// ----------------------------------------------------------------------------
function StylizedMap({ pins, focusedId, onPinTap }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 30% 20%, #1f2731 0%, #161b23 45%, #0e1218 100%)",
        overflow: "hidden",
      }}
    >
      {/* 잉크블록 지구 폴리곤 */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 375 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern id="paperGrain" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="transparent" />
            <circle cx="1" cy="1" r="0.4" fill="#3a3528" opacity="0.25" />
          </pattern>
          <linearGradient id="riverG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a242e" />
            <stop offset="100%" stopColor="#161e26" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#f2b872" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#f2b872" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f2b872" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 잉크/세피아 블록 — 동네 블록 영역 */}
        <g fill="#1a212a" stroke="#222a35" strokeWidth="1">
          <polygon points="0,0 130,0 130,80 90,140 0,140" />
          <polygon points="140,0 250,0 250,90 170,110 140,80" />
          <polygon points="260,0 375,0 375,150 290,160 260,90" />
          <polygon points="0,160 70,150 100,200 90,260 0,260" />
          <polygon points="110,165 180,140 230,150 250,230 180,260 110,250" />
          <polygon points="265,170 375,160 375,290 320,310 265,260" />
          <polygon points="0,280 80,275 110,330 80,400 0,400" />
          <polygon points="120,275 230,275 250,360 200,420 130,390" />
          <polygon points="260,320 340,320 375,400 335,470 290,440" />
          <polygon points="0,420 90,420 110,500 60,570 0,560" />
          <polygon points="130,420 230,420 250,520 180,580 130,540" />
          <polygon points="260,490 375,480 375,650 320,680 270,610" />
          <polygon points="0,580 90,590 110,700 0,700" />
          <polygon points="120,600 230,600 250,700 120,700" />
        </g>

        {/* 노이즈 그레인 */}
        <rect width="100%" height="100%" fill="url(#paperGrain)" />

        {/* 강(중랑천 느낌) — 부드러운 곡선 */}
        <path
          d="M 0 320 Q 80 290 130 340 T 260 360 Q 320 380 375 350"
          stroke="url(#riverG)"
          strokeWidth="14"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 0 320 Q 80 290 130 340 T 260 360 Q 320 380 375 350"
          stroke="#5a8aa3"
          strokeWidth="0.5"
          fill="none"
          opacity="0.25"
        />

        {/* 도로 — 따뜻한 종이 톤의 얇은 선 */}
        <g stroke="#3a3328" strokeWidth="1.2" opacity="0.55" fill="none">
          <line x1="0" y1="80" x2="375" y2="120" />
          <line x1="0" y1="260" x2="375" y2="280" />
          <line x1="0" y1="420" x2="375" y2="430" />
          <line x1="0" y1="580" x2="375" y2="600" />
          <line x1="90" y1="0" x2="120" y2="700" />
          <line x1="230" y1="0" x2="250" y2="700" />
          <line x1="335" y1="0" x2="340" y2="700" />
        </g>
        <g stroke="#4a3f30" strokeWidth="2.2" opacity="0.7" fill="none">
          {/* 주요 간선 도로 */}
          <path d="M 0 200 Q 180 230 375 220" />
          <path d="M 180 0 Q 200 350 220 700" />
        </g>

        {/* 핀 주변 따뜻한 펜던트 광원 */}
        {pins.map((p) => (
          <circle
            key={`glow-${p.id}`}
            cx={(p.x / 100) * 375}
            cy={(p.y / 100) * 700}
            r={p.visited ? 38 : 26}
            fill="url(#lampGlow)"
            opacity={focusedId === p.id ? 1 : 0.7}
          />
        ))}
      </svg>

      {/* 핀 */}
      {pins.map((p) => (
        <button
          key={p.id}
          onClick={() => onPinTap && onPinTap(p)}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: "translate(-50%, -100%)",
            zIndex: focusedId === p.id ? 10 : 2,
            padding: 0,
          }}
        >
          <MapPin
            type={p.type}
            visited={p.visited}
            size={p.visited ? 32 : 28}
            focused={focusedId === p.id}
          />
        </button>
      ))}

      {/* 현재 위치 */}
      <div
        style={{
          position: "absolute",
          left: "44%",
          top: "48%",
          transform: "translate(-50%, -50%)",
          width: 16,
          height: 16,
          borderRadius: 999,
          background: TOKENS.color.info,
          border: "3px solid #fff",
          boxShadow: `0 0 0 8px ${TOKENS.color.info}33, 0 0 18px ${TOKENS.color.info}99`,
          zIndex: 5,
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------------
// SC-04 지도 홈 — "동네에 이렇게 많았다" 의 첫인상
// ----------------------------------------------------------------------------
function MapHomeScreen({ onNavigate }) {
  const [category, setCategory] = useStateMap("all");
  const [focusedId, setFocusedId] = useStateMap(null);
  const [searchActive, setSearchActive] = useStateMap(false);

  const filteredPins = useMemoMap(() => {
    if (category === "all") return BOOKSTORES;
    return BOOKSTORES.filter((b) => b.type === category);
  }, [category]);

  const focused = focusedId ? BOOKSTORES.find((b) => b.id === focusedId) : null;

  const visitedCount = BOOKSTORES.filter((b) => b.visited).length;

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

      {/* 헤더 — 상단 인사 + 검색 */}
      <div style={{ padding: "8px 20px 12px", position: "relative", zIndex: 15 }}>
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11.5,
              color: "var(--paper-mute)",
              fontWeight: 500,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            SEONGSU · 성수동
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-kr)",
              fontSize: 19,
              fontWeight: 700,
              color: "var(--paper)",
              letterSpacing: -0.4,
              lineHeight: 1.25,
              wordBreak: "keep-all",
            }}
          >
            반경 2km 안에{" "}
            <span style={{ color: "var(--accent-lamp)", whiteSpace: "nowrap" }}>
              책방 {BOOKSTORES.length}곳
            </span>
          </div>
        </div>

        {/* 검색바 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            background: "var(--surface-01)",
            border: `1px solid ${searchActive ? "var(--accent-lamp)" : "var(--hairline)"}`,
            borderRadius: 14,
            transition: "border-color .15s",
          }}
        >
          <IconSearch size={16} />
          <span
            style={{
              flex: 1,
              fontSize: 13.5,
              fontFamily: "var(--font-ui)",
              color: "var(--paper-mute)",
              letterSpacing: -0.1,
            }}
            onClick={() => setSearchActive(true)}
          >
            책방 이름으로 검색
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--paper-mute)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: 4,
              padding: "1px 5px",
              letterSpacing: 0.5,
            }}
          >
            ⌘ K
          </span>
        </div>
      </div>

      {/* 카테고리 칩 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 20px 14px",
          overflowX: "auto",
          position: "relative",
          zIndex: 15,
        }}
        className="phone-scroll"
      >
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          전체 · {BOOKSTORES.length}
        </Chip>
        <Chip
          active={category === "bookstore"}
          onClick={() => setCategory("bookstore")}
          leftDot={TOKENS.color.pinBookstore}
        >
          서점·헌책방
        </Chip>
        <Chip
          active={category === "library"}
          onClick={() => setCategory("library")}
          leftDot={TOKENS.color.pinLibrary}
        >
          도서관·북카페
        </Chip>
        <Chip leftDot={TOKENS.color.goldVisited}>방문 완료 · {visitedCount}</Chip>
      </div>

      {/* 지도 */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <StylizedMap
          pins={filteredPins}
          focusedId={focusedId}
          onPinTap={(p) => setFocusedId(p.id === focusedId ? null : p.id)}
        />

        {/* FAB — 현재 위치 */}
        <button
          style={{
            position: "absolute",
            right: 16,
            bottom: focused ? 168 : 24,
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "var(--surface-02)",
            border: "1px solid var(--hairline-strong)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--paper)",
            boxShadow: "var(--shadow-soft)",
            transition: "bottom .25s",
          }}
        >
          <IconNav size={18} />
        </button>

        {/* 살짝 어두운 vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(13,17,22,0.55) 100%)",
          }}
        />

        {/* 미리보기 시트 — 핀 탭 시 노출 */}
        {focused && (
          <PreviewSheet
            data={focused}
            onClose={() => setFocusedId(null)}
            onDetail={() => onNavigate("detail")}
          />
        )}
      </div>

      <BottomNav active="map" onNavigate={onNavigate} />
    </div>
  );
}

// ---- 핀 미리보기 시트 ----
function PreviewSheet({ data, onClose, onDetail }) {
  const variant = data.type === "library" ? "sage" : "warm";
  return (
    <div
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 86,
        background: "var(--surface-01)",
        border: "1px solid var(--hairline)",
        borderRadius: 20,
        boxShadow: "var(--shadow-warm)",
        padding: 14,
        display: "flex",
        gap: 12,
        zIndex: 16,
        animation: "sheetIn 0.25s ease",
      }}
    >
      <ImagePlaceholder
        ratio="1/1"
        variant={variant}
        label=""
        icon={false}
        style={{ width: 72, height: 72, borderRadius: 12 }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: data.type === "library" ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore,
              }}
            />
            <span
              style={{
                fontSize: 10.5,
                color: "var(--paper-mute)",
                fontFamily: "var(--font-ui)",
                letterSpacing: 0.3,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {data.type === "library" ? "도서관·북카페" : "서점·헌책방"}
            </span>
            {data.visited && (
              <span
                style={{
                  fontSize: 9.5,
                  fontFamily: "var(--font-mono)",
                  color: TOKENS.color.goldVisited,
                  background: "rgba(245,205,110,0.12)",
                  border: "1px solid rgba(245,205,110,0.35)",
                  padding: "1px 6px",
                  borderRadius: 4,
                  letterSpacing: 0.4,
                }}
              >
                ★ VISITED
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-kr)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--paper)",
              letterSpacing: -0.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
            <span
              style={{
                fontSize: 11.5,
                color: data.status === "open" ? TOKENS.color.ok : TOKENS.color.paperMute,
                fontWeight: 600,
                fontFamily: "var(--font-ui)",
              }}
            >
              ● {data.status === "open" ? "영업 중" : "영업 종료"}
            </span>
            <span style={{ fontSize: 11, color: "var(--paper-mute)" }}>· {data.distance}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onDetail}
        style={{
          alignSelf: "stretch",
          padding: "0 14px",
          background: "var(--paper)",
          color: "var(--bg-midnight)",
          borderRadius: 10,
          fontFamily: "var(--font-ui)",
          fontSize: 12.5,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        상세 <IconChevronRight size={14} />
      </button>
      <style>{`@keyframes sheetIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ----------------------------------------------------------------------------
// SC-05 책방 상세 — 인스타에 캡처해서 자랑하고 싶은 디테일 페이지
// ----------------------------------------------------------------------------
function BookstoreDetailScreen({ onNavigate }) {
  const [photoIdx, setPhotoIdx] = useStateMap(0);
  const [bookmarked, setBookmarked] = useStateMap(false);
  const photos = [
    { label: "외관 · 펜던트 조명", variant: "warm" },
    { label: "내부 · 책장", variant: "ink" },
    { label: "창가 좌석", variant: "sage" },
  ];

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

      {/* 스크롤 영역 */}
      <div
        className="phone-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 92,
        }}
      >
        {/* 사진 슬라이드 영역 */}
        <div style={{ position: "relative", width: "100%", height: 320, marginTop: -52 }}>
          {photos.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                opacity: photoIdx === i ? 1 : 0,
                transition: "opacity .3s",
              }}
            >
              <ImagePlaceholder
                ratio="auto"
                variant={p.variant}
                label={p.label}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
          {/* gradient bottom for readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(19,23,30,0.55) 0%, rgba(19,23,30,0.2) 18%, rgba(19,23,30,0) 50%, rgba(19,23,30,0.85) 100%)",
            }}
          />
          {/* nav buttons over image */}
          <div
            style={{
              position: "absolute",
              top: 52,
              left: 0,
              right: 0,
              padding: "0 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => onNavigate("map")}
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background: "rgba(20,15,10,0.55)",
                backdropFilter: "blur(8px)",
                color: "var(--paper)",
                border: "1px solid rgba(255,235,210,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconChevronLeft size={20} />
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  background: "rgba(20,15,10,0.55)",
                  backdropFilter: "blur(8px)",
                  color: bookmarked ? TOKENS.color.accentLamp : "var(--paper)",
                  border: "1px solid rgba(255,235,210,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconBookmark size={17} filled={bookmarked} />
              </button>
              <button
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  background: "rgba(20,15,10,0.55)",
                  backdropFilter: "blur(8px)",
                  color: "var(--paper)",
                  border: "1px solid rgba(255,235,210,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconShare size={16} />
              </button>
            </div>
          </div>

          {/* photo dots */}
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 6,
            }}
          >
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                style={{
                  width: photoIdx === i ? 18 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: photoIdx === i ? "var(--paper)" : "rgba(242,234,217,0.4)",
                  transition: "all .2s",
                  padding: 0,
                }}
              />
            ))}
          </div>
          {/* photo count */}
          <div
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--paper)",
              background: "rgba(20,15,10,0.55)",
              padding: "3px 8px",
              borderRadius: 6,
              letterSpacing: 0.4,
              border: "1px solid rgba(255,235,210,0.15)",
            }}
          >
            {photoIdx + 1} / {photos.length}
          </div>
        </div>

        {/* 헤더 정보 */}
        <div style={{ padding: "20px 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: TOKENS.color.pinLibrary,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11.5,
                fontWeight: 500,
                color: "var(--paper-dim)",
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              도서관 · 북카페
            </span>
            <span style={{ flex: 1 }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: TOKENS.color.goldVisited,
                background: "rgba(245,205,110,0.12)",
                border: "1px solid rgba(245,205,110,0.35)",
                padding: "2px 7px",
                borderRadius: 6,
                letterSpacing: 0.5,
              }}
            >
              ★ 방문 완료
            </span>
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
            성수 책방
          </h1>
          <div
            style={{
              marginTop: 4,
              fontFamily: "var(--font-display-en)",
              fontSize: 13,
              color: "var(--paper-dim)",
              fontStyle: "italic",
              letterSpacing: 0.1,
            }}
          >
            Seongsu Bookshop
          </div>

          {/* 메타 정보 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-ui)",
                fontSize: 12.5,
                fontWeight: 600,
                color: TOKENS.color.ok,
              }}
            >
              <span
                style={{ width: 6, height: 6, borderRadius: 999, background: TOKENS.color.ok }}
              />
              영업 중
            </span>
            <span style={{ color: "var(--paper-mute)" }}>·</span>
            <span style={{ fontSize: 12.5, color: "var(--paper-dim)", fontFamily: "var(--font-ui)" }}>
              오늘 10:00 — 22:00
            </span>
          </div>
        </div>

        <Hairline style={{ marginLeft: 20, marginRight: 20, background: "var(--hairline)" }} />

        {/* 주소·전화 */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          <DetailRow
            icon={<IconNav size={14} />}
            primary="서울시 성동구 성수동1가 685"
            secondary="현재 위치에서 0.3km · 도보 5분"
          />
          <DetailRow
            icon={<IconPhone size={14} />}
            primary="02-1234-5678"
            secondary="문의 가능 시간 10:00 — 21:00"
          />
        </div>

        <Hairline style={{ marginLeft: 20, marginRight: 20, background: "var(--hairline)" }} />

        {/* 분위기 태그 */}
        <div style={{ padding: "18px 20px" }}>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--paper-mute)",
              letterSpacing: 0.4,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            최근 방문자가 느낀 분위기
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <MoodPill emoji="☕" label="독서하기 좋은 날" count={12} />
            <MoodPill emoji="🤫" label="한적한" count={8} />
            <MoodPill emoji="🌧️" label="비오는 날" count={4} muted />
          </div>
        </div>

        <Hairline style={{ marginLeft: 20, marginRight: 20, background: "var(--hairline)" }} />

        {/* 사진 더 보기 */}
        <div style={{ padding: "18px 20px" }}>
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
                fontFamily: "var(--font-ui)",
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--paper-mute)",
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              사진 더 보기
            </div>
            <button
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11.5,
                color: "var(--accent-lamp)",
                fontWeight: 600,
              }}
            >
              전체 보기 →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
            <ImagePlaceholder ratio="1/1" variant="warm" label="" icon={false} style={{ borderRadius: 6 }} />
            <ImagePlaceholder ratio="1/1" variant="ink" label="" icon={false} style={{ borderRadius: 6 }} />
            <ImagePlaceholder ratio="1/1" variant="sage" label="" icon={false} style={{ borderRadius: 6 }} />
          </div>
        </div>
      </div>

      {/* 하단 고정 액션 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(19, 23, 30, 0.85)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid var(--hairline)",
          padding: "14px 16px 26px",
          display: "flex",
          gap: 8,
          zIndex: 20,
        }}
      >
        <ActionBtn icon={<IconPhone size={16} />} label="전화" />
        <ActionBtn
          icon={<IconNav size={16} />}
          label="길찾기"
          primary
          onClick={() => onNavigate("moodInput")}
        />
        <ActionBtn icon={<IconShare size={16} />} label="공유" />
      </div>
    </div>
  );
}

function DetailRow({ icon, primary, secondary }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "var(--surface-02)",
          color: "var(--paper-dim)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            color: "var(--paper)",
            fontWeight: 500,
            letterSpacing: -0.1,
          }}
        >
          {primary}
        </div>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11.5,
            color: "var(--paper-mute)",
            marginTop: 2,
          }}
        >
          {secondary}
        </div>
      </div>
    </div>
  );
}

function MoodPill({ emoji, label, count, muted }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px 10px 10px",
        background: muted ? "var(--surface-01)" : "var(--surface-02)",
        border: muted ? "1px solid var(--hairline)" : "1px solid var(--hairline-strong)",
        borderRadius: 12,
      }}
    >
      <span style={{ fontSize: 17 }}>{emoji}</span>
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 12.5,
          fontWeight: 500,
          color: muted ? "var(--paper-mute)" : "var(--paper)",
          letterSpacing: -0.1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: muted ? "var(--paper-mute)" : "var(--paper-dim)",
          opacity: 0.85,
        }}
      >
        {count}
      </span>
    </div>
  );
}

function ActionBtn({ icon, label, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "13px 8px",
        background: primary ? "var(--paper)" : "var(--surface-02)",
        color: primary ? "var(--bg-midnight)" : "var(--paper)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: "var(--font-ui)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: -0.1,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

Object.assign(window, {
  MapHomeScreen,
  BookstoreDetailScreen,
  BOOKSTORES,
});
