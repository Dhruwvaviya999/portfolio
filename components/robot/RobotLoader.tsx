/**
 * Lightweight placeholder shown while the (dynamically imported) 3D scene
 * loads, and as the stable server/first-paint render before capability
 * detection runs. Pure CSS — no JS, no hydration concerns.
 */
export function RobotLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-24 animate-pulse rounded-2xl bg-brand/10" />
    </div>
  );
}
