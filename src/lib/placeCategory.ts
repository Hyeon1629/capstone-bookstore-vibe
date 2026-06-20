import type { BookstoreCategory } from '@/data/bookstores';

/**
 * 카카오 Places 결과를 책방·도서관 카테고리로 분류.
 * `category_name` 의 마지막 노드(예: "서점", "도서관", "북카페") 와
 * `category_group_code` 를 기준으로 화이트리스트 매칭.
 * 부적합 (음식점·은행·숙박 등) 은 null 반환 → 호출 측에서 필터링.
 */

// 책방으로 인정할 리프 카테고리
const BOOKSTORE_LEAVES = [
  '서점',
  '책방',
  '중고서점',
  '헌책방',
  '도서판매',
];

// 도서관·북카페로 인정할 리프 카테고리
const LIBRARY_LEAVES = [
  '도서관',
  '북카페',
  '공공도서관',
  '국공립도서관',
  '대학도서관',
  '어린이도서관',
  '작은도서관',
];

// 명백히 부적합한 카테고리 루트 (음식점·금융·숙박 등은 시작부터 거부)
const EXCLUDED_ROOTS = [
  '음식점',
  '금융,보험',
  '숙박',
  '의료',
  '주거시설',
  '주유,충전소',
  '교통,수송',
];

function splitCategoryNodes(categoryName: string): string[] {
  return categoryName
    .split('>')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function classifyPlace(place: {
  category_name: string;
  category_group_code: string;
  place_name: string;
}): BookstoreCategory | null {
  const nodes = splitCategoryNodes(place.category_name);
  const root = nodes[0] ?? '';
  const leaf = nodes[nodes.length - 1] ?? '';

  // 카카오 카테고리 그룹 BK9 (서점) 은 무조건 bookstore
  if (place.category_group_code === 'BK9') return 'bookstore';

  // 리프 단어 매칭을 루트 거부보다 먼저 한다.
  // 카카오가 북카페를 "음식점 > 카페 > 북카페" 로 분류하는 경우가 있어, 루트('음식점')를
  // 먼저 거부하면 의도한 북카페가 통째로 누락된다. 리프가 인정 카테고리면 루트와 무관하게 인정.
  if (LIBRARY_LEAVES.some((kw) => leaf.includes(kw))) return 'library';
  if (BOOKSTORE_LEAVES.some((kw) => leaf.includes(kw))) return 'bookstore';

  // 명백히 부적합한 루트 거부 (음식점·금융·숙박 등)
  if (EXCLUDED_ROOTS.includes(root)) return null;

  // 리프가 일반 단어면 place_name 이 "OO도서관" 으로 끝나는 경우만 보수적으로 library 인정
  if (/도서관$/.test(place.place_name.replace(/\s+/g, ''))) {
    return 'library';
  }

  return null;
}
