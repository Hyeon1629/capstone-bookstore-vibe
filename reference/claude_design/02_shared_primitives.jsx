// 공용 프리미티브 — 8개 화면이 공유하는 부품
// 모든 색·폰트·radius는 CSS 변수에서 끌어다 쓴다.

const { useState, useEffect, useRef } = React;

// ---------- 상태바 ----------
function StatusBar({ tint = "paper" }) {
  // tint: 'paper' (다크 위 paper 글자) | 'dark' (밝은 위 dark 글자)
  const color = tint === "dark" ? "#13171E" : "var(--paper)";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px 6px",
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        fontWeight: 600,
        color,
        letterSpacing: 0.2,
        position: "relative",
        zIndex: 30,
      }}
    >
      <span style={{ fontVariantNumeric: "tabular-nums" }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill={color} />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill={color} />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill={color} />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={color} />
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path
            d="M8 10.2a1.4 1.4 0 100-2.8 1.4 1.4 0 000 2.8zM3.4 6.7a6.5 6.5 0 019.2 0M.9 4.2a10 10 0 0114.2 0"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke={color} opacity=".5" />
          <rect x="2.5" y="2.5" width="18" height="7" rx="1.2" fill={color} />
          <rect x="23.5" y="4" width="1.6" height="4" rx="0.6" fill={color} opacity=".5" />
        </svg>
      </div>
    </div>
  );
}

// ---------- 홈 인디케이터 (iOS 하단 바) ----------
function HomeIndicator({ tint = "paper" }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 6,
        left: "50%",
        transform: "translateX(-50%)",
        width: 134,
        height: 5,
        borderRadius: 3,
        background: tint === "dark" ? "#13171E" : "var(--paper)",
        opacity: tint === "dark" ? 0.7 : 0.6,
        zIndex: 50,
        pointerEvents: "none",
      }}
    />
  );
}

// ---------- 폰 프레임 (375×812) ----------
function PhoneFrame({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 396,
          height: 832,
          background: "linear-gradient(180deg, #2A2018 0%, #1A140F 100%)",
          borderRadius: 56,
          padding: 10,
          boxShadow:
            "0 40px 80px -30px rgba(0,0,0,0.7), 0 2px 0 1px rgba(255,220,170,0.05) inset, 0 -2px 0 1px rgba(0,0,0,0.4) inset",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--bg-midnight)",
            borderRadius: 46,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* notch (Dynamic Island style) */}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 32,
              background: "#000",
              borderRadius: 20,
              zIndex: 40,
            }}
          />
          {children}
        </div>
      </div>
      {label && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--paper-mute)",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// ---------- 하단 탭 바 ----------
function BottomNav({ active, onNavigate }) {
  const items = [
    { key: "map", label: "지도", screen: "map", icon: IconMap },
    { key: "bookshelf", label: "북쉘프", screen: "bookshelf", icon: IconShelf },
    { key: "mypage", label: "마이", screen: "mypage", icon: IconUser },
  ];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--surface-01)",
        borderTop: "1px solid var(--hairline)",
        display: "flex",
        paddingBottom: 22,
        paddingTop: 10,
        zIndex: 20,
      }}
    >
      {items.map((it) => {
        const isActive = active === it.key;
        const Icon = it.icon;
        return (
          <button
            key={it.key}
            onClick={() => onNavigate && onNavigate(it.screen)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "6px 4px",
              color: isActive ? "var(--accent-lamp)" : "var(--paper-mute)",
            }}
          >
            <Icon size={22} filled={isActive} />
            <span
              style={{
                fontSize: 10.5,
                fontWeight: isActive ? 600 : 500,
                letterSpacing: 0.3,
                fontFamily: "var(--font-ui)",
              }}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- 헤더 ----------
function ScreenHeader({ title, onBack, right, transparent = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px 14px",
        background: transparent ? "transparent" : "var(--bg-midnight)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <button
        onClick={onBack}
        style={{
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--paper)",
          opacity: onBack ? 1 : 0,
        }}
      >
        {onBack && <IconChevronLeft size={22} />}
      </button>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display-kr)",
          fontSize: 17,
          fontWeight: 700,
          color: "var(--paper)",
          letterSpacing: -0.2,
        }}
      >
        {title}
      </h2>
      <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {right}
      </div>
    </div>
  );
}

// ---------- placeholder 이미지 (사진/일러스트) ----------
function ImagePlaceholder({ label, ratio = "4/3", style, variant = "warm", icon = true }) {
  // variant: warm | sage | ink | paper
  const palettes = {
    warm: { a: "#3a2a1c", b: "#5a3d24", glyph: "#e8a05b" },
    sage: { a: "#243029", b: "#384a40", glyph: "#8ab293" },
    ink: { a: "#1d2330", b: "#2a3142", glyph: "#7aa5c4" },
    paper: { a: "#d8cdb5", b: "#efe6d2", glyph: "#847d70" },
  };
  const p = palettes[variant] || palettes.warm;
  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(135deg, ${p.a} 0%, ${p.b} 100%)`,
        aspectRatio: ratio,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* diagonal stripe placeholder texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage: `repeating-linear-gradient(135deg, ${p.glyph} 0 1px, transparent 1px 14px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: p.glyph,
        }}
      >
        {icon && <IconImage size={22} />}
        {label && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- 칩 ----------
function Chip({ children, active = false, onClick, leftDot, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        flexShrink: 0,
        fontFamily: "var(--font-ui)",
        fontSize: 12.5,
        fontWeight: active ? 600 : 500,
        background: active ? "var(--paper)" : "var(--surface-02)",
        color: active ? "var(--bg-midnight)" : "var(--paper-dim)",
        border: active ? "1px solid var(--paper)" : "1px solid var(--hairline)",
        transition: "all .15s",
        ...style,
      }}
    >
      {leftDot && (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: leftDot,
            display: "inline-block",
          }}
        />
      )}
      {children}
    </button>
  );
}

// ---------- Primary 버튼 ----------
function PrimaryButton({ children, onClick, disabled, full = true, style }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        width: full ? "100%" : "auto",
        padding: "15px 20px",
        borderRadius: "var(--r-btn)",
        background: disabled ? "var(--surface-03)" : "var(--paper)",
        color: disabled ? "var(--paper-mute)" : "var(--bg-midnight)",
        fontFamily: "var(--font-ui)",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: -0.1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all .15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, full = true, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: full ? "100%" : "auto",
        padding: "14px 20px",
        borderRadius: "var(--r-btn)",
        background: "transparent",
        color: "var(--paper)",
        border: "1px solid var(--hairline-strong)",
        fontFamily: "var(--font-ui)",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: -0.1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ---------- 폼 인풋 ----------
function TextInput({ label, placeholder, value, type = "text", validation, onChange, onFocus, focused: focusedProp }) {
  const [internalFocus, setInternalFocus] = useState(false);
  const isFocused = focusedProp !== undefined ? focusedProp : internalFocus;
  const isPassword = type === "password";
  const hasError = validation && validation.status === "error";
  const hasOk = validation && validation.status === "ok";

  let borderColor = "var(--hairline)";
  if (isFocused) borderColor = "var(--accent-lamp)";
  else if (hasError) borderColor = "var(--error)";
  else if (hasOk) borderColor = "var(--ok)";

  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--paper-dim)",
          marginBottom: 8,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "13px 16px",
          background: "var(--surface-01)",
          border: `1.5px solid ${borderColor}`,
          borderRadius: "var(--r-input)",
          transition: "border-color .15s",
        }}
      >
        <span
          style={{
            flex: 1,
            fontFamily: "var(--font-ui)",
            fontSize: 14.5,
            color: value ? "var(--paper)" : "var(--paper-mute)",
            letterSpacing: -0.1,
          }}
        >
          {value || placeholder}
        </span>
        {isPassword && value && (
          <span style={{ color: "var(--paper-mute)", display: "flex" }}>
            <IconEye size={16} />
          </span>
        )}
        {hasOk && (
          <span style={{ color: "var(--ok)", display: "flex", marginLeft: 6 }}>
            <IconCheck size={15} />
          </span>
        )}
      </div>
      {validation && validation.message && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 6,
            fontFamily: "var(--font-ui)",
            fontSize: 11.5,
            fontWeight: 500,
            color:
              validation.status === "ok"
                ? "var(--ok)"
                : validation.status === "error"
                ? "var(--error)"
                : "var(--paper-mute)",
          }}
        >
          {validation.status === "ok" && <IconCheck size={11} />}
          {validation.status === "error" && <IconAlert size={11} />}
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  );
}

// =============================================================
// 아이콘 — outline / solid 변형
// =============================================================

function I({ size = 18, children, fill = "none", strokeWidth = 1.6, viewBox = "0 0 24 24" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill === "none" ? "none" : fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const IconChevronLeft = ({ size }) => (
  <I size={size}>
    <polyline points="15 18 9 12 15 6" />
  </I>
);
const IconChevronRight = ({ size }) => (
  <I size={size}>
    <polyline points="9 18 15 12 9 6" />
  </I>
);
const IconSearch = ({ size }) => (
  <I size={size}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </I>
);
const IconCheck = ({ size }) => (
  <I size={size} strokeWidth={2}>
    <polyline points="20 6 9 17 4 12" />
  </I>
);
const IconAlert = ({ size }) => (
  <I size={size}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12" y2="16" />
  </I>
);
const IconEye = ({ size }) => (
  <I size={size}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </I>
);
const IconPhone = ({ size }) => (
  <I size={size}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </I>
);
const IconShare = ({ size }) => (
  <I size={size}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </I>
);
const IconNav = ({ size }) => (
  <I size={size}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </I>
);
const IconLogout = ({ size }) => (
  <I size={size}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </I>
);
const IconBell = ({ size }) => (
  <I size={size}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </I>
);
const IconSettings = ({ size }) => (
  <I size={size}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c0 .39.15.78.43 1.07l.05.05A2 2 0 0121 12a2 2 0 01-1.06 1.76l-.05.05A1.65 1.65 0 0019.4 15z" />
  </I>
);
const IconClose = ({ size }) => (
  <I size={size}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </I>
);
const IconImage = ({ size }) => (
  <I size={size}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </I>
);
const IconHeart = ({ size, filled }) => (
  <I size={size} fill={filled ? "currentColor" : "none"}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </I>
);
const IconBookmark = ({ size, filled }) => (
  <I size={size} fill={filled ? "currentColor" : "none"}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </I>
);

// 책방·도서관 카테고리 글리프 (색맹 보조 — 형태로도 구분)
const IconBook = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 4h11a3 3 0 013 3v13a1 1 0 01-1 1H7a2 2 0 01-2-2V4z" />
    <rect x="3" y="4" width="2.5" height="17" rx="0.5" fill="currentColor" opacity="0.85" />
  </svg>
);
const IconCup = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 8h13v6a5 5 0 01-5 5h-3a5 5 0 01-5-5V8z"
      fill="currentColor"
    />
    <path d="M17 10h2a2.5 2.5 0 010 5h-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M7 3v3M10 3v3M13 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// 하단 탭 바 아이콘 — outline + solid (active)
const IconMap = ({ size = 22, filled }) =>
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8 2 5 5.1 5 8.9c0 5.5 7 12.1 7 12.1s7-6.6 7-12.1C19 5.1 16 2 12 2zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  ) : (
    <I size={size}>
      <path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </I>
  );

const IconShelf = ({ size = 22, filled }) =>
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="3.5" height="18" rx="0.5" />
      <rect x="7.5" y="5" width="3.5" height="16" rx="0.5" />
      <rect x="12" y="3" width="3.5" height="18" rx="0.5" />
      <rect x="16.5" y="6" width="3.5" height="15" rx="0.5" transform="rotate(8 18.25 13.5)" />
    </svg>
  ) : (
    <I size={size}>
      <rect x="3" y="3" width="3.5" height="18" rx="0.5" />
      <rect x="7.5" y="5" width="3.5" height="16" rx="0.5" />
      <rect x="12" y="3" width="3.5" height="18" rx="0.5" />
      <rect x="16.5" y="6" width="3.5" height="15" rx="0.5" transform="rotate(8 18.25 13.5)" />
    </I>
  );

const IconUser = ({ size = 22, filled }) =>
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ) : (
    <I size={size}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </I>
  );

// ============================
// 지도 핀 (2종 카테고리 × 미방문/방문 완료)
// 색약 사용자 구분: 색 + 형태(book/cup) + 방문 시 별 배지
// ============================
function MapPin({ type = "bookstore", visited = false, size = 36, focused = false }) {
  const color = type === "bookstore" ? TOKENS.color.pinBookstore : TOKENS.color.pinLibrary;
  const Glyph = type === "bookstore" ? IconBook : IconCup;
  const w = size;
  const h = size * 1.18;

  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        filter: focused
          ? `drop-shadow(0 4px 14px ${color}88) drop-shadow(0 0 16px ${color}55)`
          : "drop-shadow(0 4px 8px rgba(15,10,5,0.55))",
        transform: focused ? "translateY(-4px) scale(1.08)" : "none",
        transition: "all .2s",
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 40 47"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id={`pinG-${type}-${visited}`} cx="0.5" cy="0.35" r="0.7">
            <stop offset="0%" stopColor={lighten(color, 0.18)} />
            <stop offset="60%" stopColor={color} />
            <stop offset="100%" stopColor={darken(color, 0.2)} />
          </radialGradient>
        </defs>
        {/* drop shape */}
        <path
          d="M20 2 C 30 2 36 9 36 18 C 36 27 28 36 20 45 C 12 36 4 27 4 18 C 4 9 10 2 20 2 Z"
          fill={`url(#pinG-${type}-${visited})`}
          stroke={visited ? TOKENS.color.goldVisited : "rgba(255,235,210,0.9)"}
          strokeWidth={visited ? 2 : 1.5}
        />
        {/* inner halo */}
        <circle cx="20" cy="18" r="11" fill="rgba(255,240,220,0.12)" />
      </svg>
      {/* glyph */}
      <div
        style={{
          position: "absolute",
          top: w * 0.18,
          left: 0,
          width: w,
          display: "flex",
          justifyContent: "center",
          color: visited ? TOKENS.color.bgMidnight : "#fff",
        }}
      >
        <Glyph size={w * 0.42} />
      </div>
      {/* gold visited badge */}
      {visited && (
        <div
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            width: w * 0.36,
            height: w * 0.36,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${TOKENS.color.goldVisited}, ${TOKENS.color.accentLampDeep})`,
            border: "1.5px solid #1A1410",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1A1410",
            boxShadow: `0 0 10px ${TOKENS.color.goldVisited}88`,
          }}
        >
          <svg width={w * 0.2} height={w * 0.2} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.6 6.8 7.4.6-5.6 4.8 1.8 7.2L12 17.5 5.8 21.4l1.8-7.2L2 9.4l7.4-.6L12 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

// color helpers
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function lighten(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: clamp(Math.round(r + (255 - r) * amt), 0, 255),
    g: clamp(Math.round(g + (255 - g) * amt), 0, 255),
    b: clamp(Math.round(b + (255 - b) * amt), 0, 255),
  });
}
function darken(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: clamp(Math.round(r * (1 - amt)), 0, 255),
    g: clamp(Math.round(g * (1 - amt)), 0, 255),
    b: clamp(Math.round(b * (1 - amt)), 0, 255),
  });
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

// ---------- Section divider with hairline ----------
function Hairline({ style }) {
  return <div style={{ height: 1, background: "var(--hairline)", ...style }} />;
}

// expose
Object.assign(window, {
  StatusBar,
  HomeIndicator,
  PhoneFrame,
  BottomNav,
  ScreenHeader,
  ImagePlaceholder,
  Chip,
  PrimaryButton,
  SecondaryButton,
  TextInput,
  MapPin,
  Hairline,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconCheck,
  IconAlert,
  IconEye,
  IconPhone,
  IconShare,
  IconNav,
  IconLogout,
  IconBell,
  IconSettings,
  IconClose,
  IconImage,
  IconHeart,
  IconBookmark,
  IconBook,
  IconCup,
  IconMap,
  IconShelf,
  IconUser,
  lighten,
  darken,
});
