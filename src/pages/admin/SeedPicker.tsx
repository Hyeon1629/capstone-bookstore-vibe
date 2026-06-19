import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/primitives';
import { useKakaoSdk } from '@/hooks/useKakaoSdk';
import { classifyPlace } from '@/lib/placeCategory';

interface Candidate {
  kakaoPlaceId: string;
  name: string;
  category: 'bookstore' | 'library';
  address: string;
  roadAddress: string;
  dong: string;
  lat: number;
  lng: number;
  phone: string;
  categoryName: string;
  placeUrl: string;
  fromQuery: string;
}

const DEFAULT_QUERIES = ['마포 도서관', '신수동 책방', '합정 책방', '서강대'];
const MAX_PICK = 17;
const SEED_CENTER = { lat: 37.5485, lng: 126.943 }; // 마포구립서강도서관

function toCandidate(
  place: kakao.maps.services.PlaceResult,
  query: string,
): Candidate | null {
  const category = classifyPlace(place);
  if (!category) return null;

  const dongMatch = place.address_name.match(/[가-힣]+동/);
  return {
    kakaoPlaceId: place.id,
    name: place.place_name,
    category,
    address: place.address_name,
    roadAddress: place.road_address_name || place.address_name,
    dong: dongMatch ? dongMatch[0] : '',
    lat: parseFloat(place.y),
    lng: parseFloat(place.x),
    phone: place.phone || '',
    categoryName: place.category_name,
    placeUrl: place.place_url,
    fromQuery: query,
  };
}

function normalizeCandidates(
  places: kakao.maps.services.PlaceResult[],
  query: string,
): Candidate[] {
  const out: Candidate[] = [];
  for (const p of places) {
    const c = toCandidate(p, query);
    if (c) out.push(c);
  }
  return out;
}

function searchOnce(query: string, center: { lat: number; lng: number }): Promise<Candidate[]> {
  return new Promise((resolve) => {
    const places = new window.kakao.maps.services.Places();
    const collected: kakao.maps.services.PlaceResult[] = [];
    const cb: Parameters<kakao.maps.services.Places['keywordSearch']>[1] = (
      result,
      status,
      pagination,
    ) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        resolve(normalizeCandidates(collected, query));
        return;
      }
      collected.push(...result);
      if (pagination.hasNextPage && pagination.current < 3) {
        pagination.nextPage();
      } else {
        resolve(normalizeCandidates(collected, query));
      }
    };
    places.keywordSearch(query, cb, {
      location: new window.kakao.maps.LatLng(center.lat, center.lng),
      radius: 5000,
      size: 15,
    });
  });
}

function dedupe(items: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const c of items) {
    if (seen.has(c.kakaoPlaceId)) continue;
    seen.add(c.kakaoPlaceId);
    out.push(c);
  }
  return out;
}

function generateCode(picked: Candidate[]): string {
  const SEED_MOODS_BY_NAME: Record<string, string> = {
    '마포구립서강도서관':
      '    seedMoods: [\n      { emoji: \'quiet\', count: 9 },\n      { emoji: \'coffee\', count: 3 },\n    ],\n',
    '서강대학교 로욜라도서관':
      '    seedMoods: [\n      { emoji: \'quiet\', count: 14 },\n      { emoji: \'rain\', count: 2 },\n    ],\n',
  };

  const items = picked
    .map((c, i) => {
      const tags = c.categoryName
        ? c.categoryName.split('>').slice(-2).map((s) => s.trim()).filter(Boolean)
        : [];
      const seedMoods = SEED_MOODS_BY_NAME[c.name] ?? '';
      const phoneLine = c.phone ? `    phone: '${c.phone}',\n` : '';
      return `  {
    id: 'kakao-${c.kakaoPlaceId}',
    name: '${c.name.replace(/'/g, "\\'")}',
    category: '${c.category}',
    address: '${(c.roadAddress || c.address).replace(/'/g, "\\'")}',
    dong: '${c.dong}',
    lat: ${c.lat},
    lng: ${c.lng},
${phoneLine}    specialtyTags: [${tags.map((t) => `'${t.replace(/'/g, "\\'")}'`).join(', ')}],
    photos: photo('${c.name.replace(/'/g, "\\'")}'),
${seedMoods}  }${i < picked.length - 1 ? ',' : ''}`;
    })
    .join('\n');

  return `// 시연 시드 — ${new Date().toISOString().slice(0, 10)} · 카카오 실 데이터 기반
export const BOOKSTORES: Bookstore[] = [
${items}
];

export const SEED_CENTER = { lat: ${SEED_CENTER.lat}, lng: ${SEED_CENTER.lng} };`;
}

export function SeedPicker() {
  const { isReady, error } = useKakaoSdk();
  const [query, setQuery] = useState('마포 책방');
  const [results, setResults] = useState<Candidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<Map<string, Candidate>>(new Map());
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const runSearch = async (q: string) => {
    if (!isReady) return;
    setSearching(true);
    try {
      const items = await searchOnce(q, SEED_CENTER);
      setResults(dedupe([...results, ...items]));
    } finally {
      setSearching(false);
    }
  };

  // 초기 1회 — 핵심 두 도서관 자동 검색·선택
  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    (async () => {
      const seeds = await Promise.all([
        searchOnce('마포구립서강도서관', SEED_CENTER),
        searchOnce('서강대 로욜라도서관', SEED_CENTER),
        searchOnce('마포 책방', SEED_CENTER),
      ]);
      if (cancelled) return;
      const flat = dedupe(seeds.flat());
      setResults(flat);
      // 자동 선택: 두 핵심
      const auto = new Map<string, Candidate>();
      for (const c of flat) {
        if (c.name.includes('마포구립서강도서관') || c.name.includes('로욜라')) {
          auto.set(c.kakaoPlaceId, c);
        }
      }
      setPicked(auto);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady]);

  const toggle = (c: Candidate) => {
    setPicked((prev) => {
      const next = new Map(prev);
      if (next.has(c.kakaoPlaceId)) {
        next.delete(c.kakaoPlaceId);
      } else {
        if (next.size >= MAX_PICK) return prev;
        next.set(c.kakaoPlaceId, c);
      }
      return next;
    });
  };

  const pickedList = useMemo(() => Array.from(picked.values()), [picked]);
  const code = useMemo(() => generateCode(pickedList), [pickedList]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyMsg('복사됨!');
    } catch {
      setCopyMsg('복사 실패 — textarea 에서 직접 선택해주세요');
    }
    window.setTimeout(() => setCopyMsg(null), 2_000);
  };

  return (
    <div className="min-h-screen bg-bg-deeper text-paper py-10 px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <div className="font-mono text-[10.5px] text-lamp tracking-[3px] mb-1">
            DEV ONLY · SEED PICKER
          </div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.6px] m-0">
            카카오 실 데이터로 시드 생성
          </h1>
          <p className="font-ui text-[13.5px] text-paper-dim mt-2 leading-relaxed">
            카카오 맵에서 실제 등록된 책방·도서관을 검색해 17곳까지 선택 → 우측 코드 복사 → <code className="font-mono text-lamp">src/data/bookstores.ts</code> 의 BOOKSTORES 배열 교체.
            <br />
            마포구립서강도서관과 서강대 로욜라도서관은 자동 선택돼요.
          </p>
        </header>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-card border border-error/40 bg-error/10 text-error font-ui text-[13px]">
            SDK 로드 실패: {error}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                runSearch(query);
              }
            }}
            placeholder="검색어 (예: 마포 도서관 / 합정 책방 / 인사동 헌책)"
            className="flex-1 bg-surface-01 border border-hairline rounded-input px-4 py-3 font-ui text-[14px] text-paper placeholder:text-paper-mute outline-none focus:border-lamp"
          />
          <button
            onClick={() => runSearch(query)}
            disabled={!isReady || searching}
            className="px-5 py-3 rounded-btn bg-lamp text-bg-midnight font-ui text-[14px] font-bold disabled:opacity-40"
          >
            {searching ? '검색 중...' : '검색'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="font-mono text-[10.5px] text-paper-mute self-center mr-1">빠른 검색:</span>
          {DEFAULT_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                runSearch(q);
              }}
              disabled={!isReady || searching}
              className="px-3 py-1.5 rounded-full border border-hairline-strong text-paper-dim font-ui text-[12px] hover:border-lamp hover:text-lamp transition-colors disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section>
            <div className="flex items-baseline justify-between mb-2.5">
              <h2 className="font-display text-[16px] font-bold tracking-[-0.2px]">
                검색 결과 ({results.length}건)
              </h2>
              <span className="font-mono text-[10.5px] text-paper-mute">
                선택 {picked.size}/{MAX_PICK}
              </span>
            </div>
            <div className="bg-surface-01 border border-hairline rounded-card overflow-hidden max-h-[600px] overflow-y-auto">
              {results.length === 0 && !searching && (
                <div className="p-6 text-center font-ui text-[13px] text-paper-mute">
                  검색어를 입력하거나 빠른 검색 칩을 눌러보세요
                </div>
              )}
              {results.map((c) => {
                const isPicked = picked.has(c.kakaoPlaceId);
                const isDisabled = !isPicked && picked.size >= MAX_PICK;
                const categoryColor = c.category === 'library' ? 'text-pin-library' : 'text-pin-bookstore';
                return (
                  <label
                    key={c.kakaoPlaceId}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-hairline cursor-pointer hover:bg-surface-02 transition-colors ${isPicked ? 'bg-lamp/5' : ''} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isPicked}
                      onChange={() => toggle(c)}
                      disabled={isDisabled}
                      className="mt-1 accent-lamp"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-ui text-[14px] font-semibold text-paper truncate">
                        {c.name}
                      </div>
                      <div className="font-ui text-[11.5px] text-paper-dim mt-0.5 truncate">
                        {c.roadAddress || c.address}
                      </div>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-paper-mute">
                        <span className={categoryColor}>● {c.category === 'library' ? '도서관·북카페' : '서점·헌책방'}</span>
                        {c.phone && <span>· {c.phone}</span>}
                      </div>
                      {c.categoryName && (
                        <div className="font-mono text-[9.5px] text-paper-mute mt-0.5 truncate">
                          {c.categoryName}
                        </div>
                      )}
                    </div>
                    <a
                      href={c.placeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-[10px] text-lamp shrink-0 self-center"
                    >
                      카카오 ↗
                    </a>
                  </label>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-baseline justify-between mb-2.5">
              <h2 className="font-display text-[16px] font-bold tracking-[-0.2px]">
                생성될 코드
              </h2>
              <div className="flex gap-2">
                {copyMsg && <span className="font-mono text-[10.5px] text-lamp">{copyMsg}</span>}
                <Button onClick={onCopy} fullWidth={false}>
                  복사
                </Button>
              </div>
            </div>
            <textarea
              readOnly
              value={code}
              className="w-full h-[600px] bg-surface-01 border border-hairline rounded-card p-4 font-mono text-[11px] text-paper-dim resize-none outline-none focus:border-lamp"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <p className="mt-3 font-ui text-[12px] text-paper-mute leading-relaxed">
              ※ <code className="font-mono text-paper-dim">src/data/bookstores.ts</code> 의{' '}
              <code className="font-mono text-paper-dim">BOOKSTORES</code> 배열과{' '}
              <code className="font-mono text-paper-dim">SEED_CENTER</code> 만 교체하세요.
              상단 <code className="font-mono text-paper-dim">photo()</code> 헬퍼와 인터페이스는 그대로 유지.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
