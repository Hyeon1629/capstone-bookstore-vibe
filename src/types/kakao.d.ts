// 카카오 맵 SDK 최소 타입 선언 — 본 프로젝트에서 실제 사용하는 API 만 명시.
// 전체 타입은 https://apis.map.kakao.com/web/documentation/ 참조.

export {};

declare global {
  interface Window {
    kakao: typeof kakao;
  }

  namespace kakao.maps {
    function load(cb: () => void): void;

    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    interface MapOptions {
      center: LatLng;
      level?: number;
      draggable?: boolean;
      scrollwheel?: boolean;
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(level: number): void;
      getLevel(): number;
      relayout(): void;
    }

    interface CustomOverlayOptions {
      position: LatLng;
      content: HTMLElement | string;
      yAnchor?: number;
      xAnchor?: number;
      zIndex?: number;
      clickable?: boolean;
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
      extend(latlng: LatLng): void;
      contain(latlng: LatLng): boolean;
    }

    interface MapWithBounds extends Map {
      getBounds(): LatLngBounds;
    }

    namespace event {
      function addListener(target: unknown, type: string, handler: (...args: unknown[]) => void): void;
      function removeListener(target: unknown, type: string, handler: (...args: unknown[]) => void): void;
    }

    namespace services {
      type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';
      const Status: { OK: 'OK'; ZERO_RESULT: 'ZERO_RESULT'; ERROR: 'ERROR' };

      interface Pagination {
        current: number;
        last: number;
        totalCount: number;
        hasNextPage: boolean;
        nextPage: () => void;
      }

      interface PlaceResult {
        id: string;
        place_name: string;
        category_name: string;
        category_group_code: string;
        category_group_name: string;
        phone: string;
        address_name: string;
        road_address_name: string;
        x: string; // lng
        y: string; // lat
        place_url: string;
        distance: string;
      }

      interface SearchOptions {
        category_group_code?: string;
        location?: LatLng;
        radius?: number; // meters
        bounds?: LatLngBounds;
        rect?: string;
        size?: number;
        page?: number;
        useMapBounds?: boolean;
        useMapCenter?: boolean;
      }

      class Places {
        constructor(map?: Map);
        setMap(map: Map | null): void;
        categorySearch(
          code: string,
          callback: (result: PlaceResult[], status: Status, pagination: Pagination) => void,
          options?: SearchOptions,
        ): void;
        keywordSearch(
          keyword: string,
          callback: (result: PlaceResult[], status: Status, pagination: Pagination) => void,
          options?: SearchOptions,
        ): void;
      }
    }
  }
}
