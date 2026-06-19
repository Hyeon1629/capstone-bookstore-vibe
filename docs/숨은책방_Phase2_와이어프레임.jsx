import { useState } from 'react';
import {
  Search, MapPin, Navigation, Coffee, BookOpen, Library, User,
  Bell, Settings, Share2, Phone, ChevronLeft, ChevronRight, X,
  LogOut, Check, AlertCircle, Eye, Image as ImageIcon
} from 'lucide-react';

// =====================================================================
// 데이터
// =====================================================================

const SCREENS = [
  { key: 'onboarding', id: 'SC-01', name: '온보딩' },
  { key: 'signup', id: 'SC-02', name: '회원가입' },
  { key: 'login', id: 'SC-03', name: '로그인' },
  { key: 'map', id: 'SC-04', name: '지도 홈' },
  { key: 'detail', id: 'SC-05', name: '책방 상세' },
  { key: 'moodInput', id: 'SC-06', name: '분위기 입력' },
  { key: 'bookshelf', id: 'SC-07', name: '마이 북쉘프' },
  { key: 'mypage', id: 'SC-08', name: '마이페이지' },
];

const ANNOTATIONS = {
  onboarding: {
    components: [
      '컨셉 일러스트 영역 (Phase 3에서 확정)',
      '핵심 카피 — "동네에 책방이 이렇게 많았어요"',
      '서브 카피',
      '페이지 인디케이터 (2~3 슬라이드)',
      '[다음] 버튼 — 마지막은 [시작하기]'
    ],
    interactions: [
      '좌우 스와이프 또는 [다음] 탭으로 슬라이드 이동',
      '마지막 슬라이드 → 회원가입 화면',
    ],
    features: ['F-02'],
    next: [{ key: 'signup', label: '회원가입 (SC-02)' }]
  },
  signup: {
    components: [
      '뒤로 가기 버튼',
      '이메일 입력 (실시간 형식 검증)',
      '비밀번호 입력 (6자 이상 검증)',
      '닉네임 입력 (실시간 중복 검증, 2~12자)',
      '[가입하기] 버튼 (모든 검증 통과 시 활성화)',
      '하단 — "이미 계정이 있으신가요? 로그인" 링크',
    ],
    interactions: [
      '각 필드 입력 시 실시간 검증',
      '모든 검증 통과 시 [가입하기] 활성화',
      '가입 완료 → 위치 권한 요청 → 지도 홈',
      '"로그인" 링크 → 로그인 화면',
    ],
    features: ['F-01', 'F-02'],
    next: [
      { key: 'map', label: '가입 완료 → 지도 홈 (SC-04)' },
      { key: 'login', label: '로그인 (SC-03)' },
    ]
  },
  login: {
    components: [
      '뒤로 가기 버튼',
      '이메일 입력',
      '비밀번호 입력',
      '[로그인] 버튼',
      '하단 — "계정이 없으신가요? 회원가입" 링크',
    ],
    interactions: [
      '로그인 성공 시 자동 로그인 활성화 후 지도 홈',
      '실패 시 "이메일 또는 비밀번호가 일치하지 않습니다" 안내',
      '"회원가입" 링크 → 회원가입 화면',
    ],
    features: ['F-01'],
    next: [
      { key: 'map', label: '로그인 성공 → 지도 홈 (SC-04)' },
      { key: 'signup', label: '회원가입 (SC-02)' },
    ]
  },
  map: {
    components: [
      '검색 바 (책방 이름 부분 일치)',
      '카테고리 토글 칩 3개 — 전체 / 서점·헌책방 / 도서관·북카페',
      '지도 + 책방 핀 (2색 카테고리)',
      '미방문 vs 방문 완료 핀 시각 차별화 (방문은 채워진 형태 + 골드 배지)',
      '현재 위치 FAB',
      '하단 탭 바 (3개)',
    ],
    interactions: [
      '핀 탭 → 하단 미리보기 시트',
      '시트의 [상세 보기] → 책방 상세',
      '검색바 입력 → 매칭 핀 강조',
      '카테고리 토글 → 해당 색 핀만 표시',
    ],
    features: ['F-03'],
    next: [{ key: 'detail', label: '책방 상세 (SC-05)' }]
  },
  detail: {
    components: [
      '사진 슬라이드 (시연 샘플 2~3장)',
      '기본 정보 — 이름 / 카테고리 / 영업 상태 / 운영시간 / 주소 / 전화',
      '분위기 태그 (최근 사용자 입력 1~2개)',
      '하단 고정 액션 — [전화] [길찾기] [공유]',
    ],
    interactions: [
      '사진 좌우 스와이프',
      '[전화] → 전화 앱 외부 연결',
      '[길찾기] → 외부 지도 앱',
      '[공유] → OS 공유 시트 (카톡 등)',
      '도착 시 자동 GPS 인증 → 분위기 입력 모달',
    ],
    features: ['F-04', 'F-05'],
    next: [
      { key: 'moodInput', label: '방문 인증 후 (SC-06)' },
      { key: 'map', label: '뒤로 — 지도 홈 (SC-04)' },
    ]
  },
  moodInput: {
    components: [
      '인증 완료 헤더 — "방문 인증 완료!"',
      '책방 이름 표시',
      '5개 이모지 선택 — ☕ 🌧️ 🎶 🤫 ☀️',
      '[건너뛰기] 옵션',
    ],
    interactions: [
      '이모지 1개 선택 → 즉시 저장 → 마이 북쉘프로 이동',
      '[건너뛰기] → 마이 북쉘프로 이동',
    ],
    features: ['F-05', 'F-06'],
    next: [{ key: 'bookshelf', label: '마이 북쉘프 (SC-07)' }]
  },
  bookshelf: {
    components: [
      '상단 통계 — 누적 방문 / 이번 달 방문',
      '방문 지도 (방문 책방 = 컬러 핀, 미방문 = 회색)',
      '방문 기록 리스트 — 책방명 + 방문 일자, 최신순',
    ],
    interactions: [
      '리스트 항목 탭 → 해당 책방 상세 페이지',
    ],
    features: ['F-07'],
    next: [{ key: 'detail', label: '책방 상세 (SC-05)' }]
  },
  mypage: {
    components: [
      '프로필 카드 — 닉네임 / 이메일 / 누적 방문 수',
      '메뉴 리스트 — 알림 설정 / 앱 정보 / 로그아웃',
    ],
    interactions: [
      '로그아웃 탭 → 확인 다이얼로그 → 로그인 화면',
    ],
    features: ['F-01'],
    next: [{ key: 'login', label: '로그아웃 후 로그인 (SC-03)' }]
  },
};

// =====================================================================
// 와이어프레임 프리미티브
// =====================================================================

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-medium text-gray-700">
      <span>9:41</span>
      <div className="flex items-center gap-1 text-gray-500">
        <span>●●●●</span>
        <span>📶</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function BottomNav({ active = 'map', onNavigate }) {
  const items = [
    { key: 'map', icon: MapPin, label: '지도', screen: 'map' },
    { key: 'bookshelf', icon: BookOpen, label: '북쉘프', screen: 'bookshelf' },
    { key: 'mypage', icon: User, label: '마이', screen: 'mypage' },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 flex border-t border-gray-200 bg-white">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate && onNavigate(item.screen)}
            className={`flex-1 flex flex-col items-center justify-center pt-2 pb-3 ${
              isActive ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.25 : 1.5} />
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ScreenHeader({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-gray-700">
        {onBack ? <ChevronLeft size={22} /> : null}
      </button>
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      <div className="w-8 h-8 flex items-center justify-center text-gray-700">{right}</div>
    </div>
  );
}

function ImagePlaceholder({ label, className = '', aspectRatio = '4/3' }) {
  return (
    <div
      className={`relative bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#D1D5DB" strokeWidth="1" />
      </svg>
      {label && (
        <span className="relative text-[10px] bg-gray-100 px-2 py-0.5">{label}</span>
      )}
    </div>
  );
}

function Chip({ children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap border flex-shrink-0 ${
        active
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-700 border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}

function ValidationHint({ status, message }) {
  if (!message) return null;
  const config = {
    ok: { icon: Check, color: 'text-green-600' },
    error: { icon: AlertCircle, color: 'text-red-500' },
    info: { icon: null, color: 'text-gray-500' },
  }[status];
  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-1 mt-1 text-[10px] ${config.color}`}>
      {Icon && <Icon size={10} />}
      <span>{message}</span>
    </div>
  );
}

// =====================================================================
// 화면 컴포넌트
// =====================================================================

function OnboardingScreen({ onNavigate }) {
  return (
    <div className="relative h-full bg-white flex flex-col">
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <ImagePlaceholder
          label="컨셉 일러스트"
          className="w-56 h-56 rounded-2xl mb-12"
          aspectRatio="1/1"
        />
        <h1 className="text-2xl font-bold text-gray-900 text-center leading-snug mb-3">
          동네에 책방이<br />이렇게 많았어요
        </h1>
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          지도에서 발견하고, 가서 인증하고,<br />
          내 동네 책방 지도를 채워보세요.
        </p>
      </div>
      <div className="px-6 pb-10">
        <div className="flex justify-center gap-1.5 mb-6">
          <span className="w-6 h-1.5 rounded-full bg-gray-900" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
        <button
          onClick={() => onNavigate('signup')}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold"
        >
          다음
        </button>
      </div>
    </div>
  );
}

function SignupScreen({ onNavigate }) {
  return (
    <div className="relative h-full bg-white flex flex-col">
      <StatusBar />
      <ScreenHeader title="회원가입" onBack={() => onNavigate('onboarding')} />
      <div className="flex-1 px-5 py-6 overflow-y-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-1">시작하기</h1>
        <p className="text-xs text-gray-500 mb-8">간단한 정보만으로 가입할 수 있어요.</p>

        <FormField
          label="이메일"
          placeholder="example@email.com"
          value="seoyeon@test.com"
          validation={{ status: 'ok', message: '사용 가능한 이메일' }}
        />
        <FormField
          label="비밀번호"
          placeholder="6자 이상"
          value="••••••••"
          type="password"
          validation={{ status: 'ok', message: '6자 이상 입력됨' }}
        />
        <FormField
          label="닉네임"
          placeholder="2~12자, 한글/영문/숫자"
          value="서연"
          validation={{ status: 'ok', message: '사용 가능한 닉네임' }}
        />
      </div>
      <div className="px-5 pb-6 pt-3 border-t border-gray-100">
        <button
          onClick={() => onNavigate('map')}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold mb-3"
        >
          가입하기
        </button>
        <p className="text-center text-xs text-gray-500">
          이미 계정이 있으신가요?{' '}
          <button onClick={() => onNavigate('login')} className="text-gray-900 font-semibold underline">
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginScreen({ onNavigate }) {
  return (
    <div className="relative h-full bg-white flex flex-col">
      <StatusBar />
      <ScreenHeader title="로그인" onBack={() => onNavigate('onboarding')} />
      <div className="flex-1 px-5 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">다시 오신 걸 환영해요</h1>
        <p className="text-xs text-gray-500 mb-8">이메일과 비밀번호를 입력해주세요.</p>

        <FormField
          label="이메일"
          placeholder="example@email.com"
          value=""
        />
        <FormField
          label="비밀번호"
          placeholder="비밀번호 입력"
          value=""
          type="password"
        />
      </div>
      <div className="px-5 pb-6 pt-3 border-t border-gray-100">
        <button
          onClick={() => onNavigate('map')}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold mb-3"
        >
          로그인
        </button>
        <p className="text-center text-xs text-gray-500">
          계정이 없으신가요?{' '}
          <button onClick={() => onNavigate('signup')} className="text-gray-900 font-semibold underline">
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, value, type = 'text', validation }) {
  const isPassword = type === 'password';
  return (
    <div className="mb-5">
      <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="flex items-center px-3.5 py-2.5 border border-gray-300 rounded-lg">
        <span className={`flex-1 text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value || placeholder}
        </span>
        {isPassword && value && <Eye size={14} className="text-gray-400" />}
      </div>
      {validation && <ValidationHint {...validation} />}
    </div>
  );
}

function MapHomeScreen({ onNavigate }) {
  const pins = [
    { x: 28, y: 22, type: 'a', visited: false },
    { x: 58, y: 30, type: 'b', visited: true },
    { x: 42, y: 45, type: 'b', visited: false },
    { x: 72, y: 55, type: 'a', visited: false },
    { x: 22, y: 65, type: 'b', visited: false },
    { x: 55, y: 70, type: 'a', visited: false },
    { x: 78, y: 38, type: 'b', visited: true },
    { x: 35, y: 35, type: 'a', visited: false },
    { x: 65, y: 80, type: 'a', visited: false },
    { x: 48, y: 60, type: 'b', visited: false },
  ];

  const pinColor = (type, visited) => {
    if (visited) return 'bg-gray-900 border-yellow-400';
    if (type === 'a') return 'bg-gray-700 border-white';
    return 'bg-gray-400 border-white';
  };

  const pinIcon = type => (type === 'a' ? BookOpen : Coffee);

  return (
    <div className="relative h-full bg-white">
      <StatusBar />
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-full border border-gray-200">
          <Search size={15} className="text-gray-400" />
          <span className="text-xs text-gray-400">책방 이름 검색</span>
        </div>
      </div>
      <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto">
        <Chip active>전체</Chip>
        <Chip>서점·헌책방</Chip>
        <Chip>도서관·북카페</Chip>
      </div>
      <div
        className="relative mx-3 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden"
        style={{ height: '440px' }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute top-1/3 left-0 right-0 h-1 bg-white opacity-80" />
        <div className="absolute top-2/3 left-0 right-0 h-2 bg-white opacity-80" />
        <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-white opacity-80" />
        <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-white opacity-80" />
        {pins.map((pin, i) => {
          const Icon = pinIcon(pin.type);
          return (
            <button
              key={i}
              onClick={() => onNavigate('detail')}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                pin.visited ? 'scale-110' : ''
              } transition-transform`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <div
                className={`w-7 h-7 rounded-full ${pinColor(
                  pin.type,
                  pin.visited
                )} border-2 shadow-md flex items-center justify-center`}
              >
                <Icon size={13} className="text-white" />
              </div>
              {pin.visited && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white" />
              )}
            </button>
          );
        })}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md ring-4 ring-blue-500/20" />
        <button className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center">
          <Navigation size={18} className="text-gray-700" />
        </button>
      </div>
      <div className="px-4 pt-2 text-[10px] text-gray-400 text-center">
        반경 2km 내 책방 15곳 · 핀을 탭하면 상세 페이지로 이동
      </div>
      <BottomNav active="map" onNavigate={onNavigate} />
    </div>
  );
}

function BookstoreDetailScreen({ onNavigate }) {
  return (
    <div className="relative h-full bg-white overflow-y-auto pb-20">
      <StatusBar />
      <div className="absolute top-7 left-0 right-0 z-10 flex items-center justify-between px-3 py-2">
        <button
          onClick={() => onNavigate('map')}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
          <Share2 size={16} className="text-gray-800" />
        </button>
      </div>
      <ImagePlaceholder label="사진 1 / 3" className="w-full h-52" aspectRatio="16/9" />
      <div className="px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">성수 책방</h1>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] text-gray-500">도서관·북카페</span>
          <span className="text-[11px] text-green-600 font-medium">● 영업 중</span>
          <span className="text-[11px] text-gray-400">~ 21:00</span>
        </div>
        <div className="text-[11px] text-gray-500 mt-2">
          서울시 성동구 성수동1가 · 0.3km
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
          <Phone size={11} /> 02-1234-5678
        </div>
      </div>
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-2.5">최근 사용자가 느낀 분위기</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg">
            <span className="text-base">☕</span>
            <span className="text-[11px] text-gray-700">독서하기 좋은 날</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg">
            <span className="text-base">🤫</span>
            <span className="text-[11px] text-gray-700">한적한</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2.5">사진 더 보기</h3>
        <div className="grid grid-cols-3 gap-1">
          <ImagePlaceholder label="" className="w-full" aspectRatio="1/1" />
          <ImagePlaceholder label="" className="w-full" aspectRatio="1/1" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 border-t border-gray-200 bg-white">
        <button className="flex items-center justify-center gap-1 py-4 border-r border-gray-200">
          <Phone size={14} className="text-gray-700" />
          <span className="text-xs font-semibold text-gray-800">전화</span>
        </button>
        <button
          onClick={() => onNavigate('moodInput')}
          className="flex items-center justify-center gap-1 py-4 border-r border-gray-200"
        >
          <Navigation size={14} className="text-gray-700" />
          <span className="text-xs font-semibold text-gray-800">길찾기</span>
        </button>
        <button className="flex items-center justify-center gap-1 py-4">
          <Share2 size={14} className="text-gray-700" />
          <span className="text-xs font-semibold text-gray-800">공유</span>
        </button>
      </div>
    </div>
  );
}

function MoodInputScreen({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const moods = [
    { emoji: '☕', label: '독서' },
    { emoji: '🌧️', label: '비오는' },
    { emoji: '🎶', label: '음악' },
    { emoji: '🤫', label: '한적한' },
    { emoji: '☀️', label: '햇살' },
  ];
  return (
    <div className="relative h-full bg-gray-50 flex flex-col">
      <StatusBar />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl w-full p-6 shadow-lg">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-900 mx-auto mb-4">
            <Check size={28} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 text-center mb-1">방문 인증 완료!</h2>
          <p className="text-xs text-gray-500 text-center mb-6">
            성수 책방의 스탬프가 적립되었어요.
          </p>
          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-semibold text-gray-800 text-center mb-4">
              오늘 분위기는 어땠어요?
            </p>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {moods.map((mood, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`flex flex-col items-center py-3 rounded-xl border-2 transition-colors ${
                    selected === i
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-[9px] mt-1 text-gray-600">{mood.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => onNavigate('bookshelf')}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold mb-2"
              disabled={selected === null}
              style={{ opacity: selected === null ? 0.4 : 1 }}
            >
              완료
            </button>
            <button
              onClick={() => onNavigate('bookshelf')}
              className="w-full py-2 text-center text-xs text-gray-500"
            >
              건너뛰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookshelfScreen({ onNavigate }) {
  return (
    <div className="relative h-full bg-white pb-20">
      <StatusBar />
      <div className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">마이 북쉘프</h1>
      </div>
      <div className="grid grid-cols-2 px-4 py-4 border-b border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-[10px] text-gray-500 mt-0.5">누적 방문</div>
        </div>
        <div className="text-center border-l border-gray-100">
          <div className="text-2xl font-bold text-gray-900">4</div>
          <div className="text-[10px] text-gray-500 mt-0.5">이번 달 방문</div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">방문 지도</h3>
        <div className="relative rounded-xl bg-gray-50 border border-gray-200 overflow-hidden h-44">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {/* 방문한 핀 (컬러) */}
          {[
            { x: 30, y: 30 },
            { x: 55, y: 25 },
            { x: 45, y: 55 },
            { x: 70, y: 50 },
          ].map((pin, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-900 border-2 border-white shadow-sm"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            />
          ))}
          {/* 미방문 핀 (회색) */}
          {[
            { x: 20, y: 60 },
            { x: 78, y: 70 },
            { x: 35, y: 75 },
            { x: 60, y: 80 },
          ].map((pin, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gray-300 border border-white"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            />
          ))}
        </div>
      </div>
      <div className="px-4 py-3 overflow-y-auto" style={{ maxHeight: '220px' }}>
        <h3 className="text-xs font-semibold text-gray-500 mb-2">방문 기록</h3>
        {[
          { name: '성수 책방', date: '오늘', category: '도서관·북카페' },
          { name: '독립출판 라운지', date: '3일 전', category: '서점·헌책방' },
          { name: '책 사이 도서관', date: '1주일 전', category: '도서관·북카페' },
          { name: '합정 헌책방', date: '2주일 전', category: '서점·헌책방' },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate('detail')}
            className="w-full flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <MapPin size={14} className="text-gray-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[13px] font-medium text-gray-900">{item.name}</div>
              <div className="text-[10px] text-gray-500">{item.category} · {item.date}</div>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </button>
        ))}
      </div>
      <BottomNav active="bookshelf" onNavigate={onNavigate} />
    </div>
  );
}

function MyPageScreen({ onNavigate }) {
  return (
    <div className="relative h-full bg-white pb-20 overflow-y-auto">
      <StatusBar />
      <div className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">마이페이지</h1>
      </div>
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={26} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-gray-900">서연</div>
            <div className="text-[11px] text-gray-500 mt-0.5">seoyeon@test.com</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">12</div>
            <div className="text-[10px] text-gray-500">누적 방문</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">4</div>
            <div className="text-[10px] text-gray-500">이번 달</div>
          </div>
        </div>
      </div>
      <div className="py-2">
        <MenuItem icon={Bell} label="알림 설정" />
        <MenuItem icon={Settings} label="앱 정보" />
        <MenuItem
          icon={LogOut}
          label="로그아웃"
          danger
          onClick={() => onNavigate('login')}
        />
      </div>
      <BottomNav active="mypage" onNavigate={onNavigate} />
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 ${
        danger ? 'text-red-500' : 'text-gray-800'
      }`}
    >
      <Icon size={18} className={danger ? 'text-red-500' : 'text-gray-600'} />
      <span className="flex-1 text-left text-sm">{label}</span>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
}

// =====================================================================
// 레이아웃
// =====================================================================

function PhoneFrame({ children }) {
  return (
    <div className="relative" style={{ width: '380px', height: '760px' }}>
      <div
        className="relative w-full h-full bg-gray-900 rounded-[3rem] p-2.5"
        style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}
      >
        <div className="relative w-full h-full bg-white rounded-[2.4rem] overflow-hidden">
          {children}
        </div>
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-20" />
      </div>
    </div>
  );
}

function ScreenSelector({ current, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SCREENS.map(s => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
            current === s.key
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
          }`}
        >
          <span className="font-mono text-[10px] opacity-60 mr-1.5">{s.id}</span>
          {s.name}
        </button>
      ))}
    </div>
  );
}

function InfoPanel({ screenKey, onNavigate }) {
  const screen = SCREENS.find(s => s.key === screenKey);
  const ann = ANNOTATIONS[screenKey];

  return (
    <div
      className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl p-6 overflow-y-auto"
      style={{ maxHeight: '760px' }}
    >
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-[10px] font-mono text-gray-400 px-2 py-0.5 bg-gray-100 rounded">
          {screen.id}
        </span>
        <h2 className="text-xl font-bold text-gray-900">{screen.name}</h2>
      </div>

      <Section title="주요 컴포넌트">
        <ul className="space-y-1.5">
          {ann.components.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-gray-400 font-mono text-xs mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="핵심 인터랙션">
        <ul className="space-y-1.5">
          {ann.interactions.map((it, i) => (
            <li key={i} className="text-sm text-gray-700 leading-relaxed">
              · {it}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="관련 기능 ID">
        <div className="flex flex-wrap gap-1.5">
          {ann.features.map(f => (
            <span
              key={f}
              className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded border border-gray-200"
            >
              {f}
            </span>
          ))}
        </div>
      </Section>

      <Section title="연결 화면">
        <div className="space-y-1.5">
          {ann.next.map((n, i) => (
            <button
              key={i}
              onClick={() => onNavigate(n.key)}
              className="block w-full text-left text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
            >
              → {n.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5 pb-5 border-b border-gray-100 last:border-b-0">
      <h3 className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

// =====================================================================
// 메인
// =====================================================================

export default function Wireframe() {
  const [screen, setScreen] = useState('map');

  const renderScreen = () => {
    switch (screen) {
      case 'onboarding': return <OnboardingScreen onNavigate={setScreen} />;
      case 'signup': return <SignupScreen onNavigate={setScreen} />;
      case 'login': return <LoginScreen onNavigate={setScreen} />;
      case 'map': return <MapHomeScreen onNavigate={setScreen} />;
      case 'detail': return <BookstoreDetailScreen onNavigate={setScreen} />;
      case 'moodInput': return <MoodInputScreen onNavigate={setScreen} />;
      case 'bookshelf': return <BookshelfScreen onNavigate={setScreen} />;
      case 'mypage': return <MyPageScreen onNavigate={setScreen} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">숨은 책방</h1>
            <span className="text-sm text-gray-500">Phase 2 — 와이어프레임 (v3.1)</span>
          </div>
          <p className="text-xs text-gray-500">
            저해상도 와이어프레임 · 시각 디자인은 Phase 3에서 확정 · 핀·버튼·메뉴 클릭으로 화면 전환
          </p>
        </div>

        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-3">
            화면 선택
          </div>
          <ScreenSelector current={screen} onChange={setScreen} />
        </div>

        <div className="flex gap-6 items-start flex-wrap">
          <div className="flex-shrink-0">
            <PhoneFrame>{renderScreen()}</PhoneFrame>
          </div>
          <InfoPanel screenKey={screen} onNavigate={setScreen} />
        </div>
      </div>
    </div>
  );
}
