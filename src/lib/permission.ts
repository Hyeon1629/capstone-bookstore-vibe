export async function requestLocationPermission(): Promise<boolean> {
  if (!('geolocation' in navigator)) return false;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 10_000, maximumAge: 60_000 },
    );
  });
}
