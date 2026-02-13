import React from "react";

export type MediaItem = {
  id: string;
  src: string;
  width?: number;
  height?: number;
  alt?: string;
};

type EngageImageCollageProps = {
  items: MediaItem[];
  maxVisible?: number; // default 4 (Engage-like +N overlay)
  gapPx?: number; // default 6–8
  radiusPx?: number; // default 10–12
  portraitHeroWidthPct?: number; // default 66 (you liked ~66–70)
};

// Locked aspect ratios for consistent collage layouts
const LOCKED_RATIOS = {
  HERO_PORTRAIT: "4 / 5",
  HERO_LANDSCAPE: "3 / 2",
  SECONDARY: "4 / 3",
  SQUARE: "1 / 1",
} as const;

function isPortrait(item: MediaItem): boolean {
  const w = item.width;
  const h = item.height;
  if (typeof w === "number" && typeof h === "number" && w > 0 && h > 0) {
    return h > w;
  }
  // default to landscape if unknown
  return false;
}

function Tile({
  item,
  aspectRatio,
  overlayText,
}: {
  item: MediaItem;
  aspectRatio: string; // e.g. "4 / 5"
  overlayText?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <img
        src={item.src}
        alt={item.alt || ""}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          objectPosition: "center",
        }}
        draggable={false}
      />

      {overlayText ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          {overlayText}
        </div>
      ) : null}
    </div>
  );
}

export default function EngageImageCollage({
  items,
  maxVisible = 4,
  gapPx = 6,
  radiusPx = 12,
  portraitHeroWidthPct = 66,
}: EngageImageCollageProps) {
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  // Show up to 4 (Engage-like). Overlay +N on last visible.
  const visible = safeItems.slice(0, maxVisible);
  const remaining = safeItems.length - visible.length;

  const hero = visible[0];
  const heroIsPortrait = isPortrait(hero);

  const secondary = visible.slice(1);
  const secondaryCount = secondary.length;

  const overlayOnIndex = remaining > 0 ? visible.length - 1 : -1;
  const overlayText = remaining > 0 ? `+${remaining} more` : undefined;

  const wrapperStyle: React.CSSProperties = {
    borderRadius: radiusPx,
    overflow: "hidden",
    background: "#fff",
    width: "100%",
  };

  // ====== 1 IMAGE ======
  if (visible.length === 1) {
    const aspectRatio = heroIsPortrait ? LOCKED_RATIOS.HERO_PORTRAIT : LOCKED_RATIOS.HERO_LANDSCAPE;
    return (
      <div style={wrapperStyle}>
        <Tile item={hero} aspectRatio={aspectRatio} />
      </div>
    );
  }

  // ====== 2 IMAGES ======
  if (visible.length === 2) {
    // For 2-up: use 4:5 if hero is portrait, 1:1 if hero is landscape/square
    const aspectRatio = heroIsPortrait ? LOCKED_RATIOS.HERO_PORTRAIT : LOCKED_RATIOS.SQUARE;

    return (
      <div style={wrapperStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: gapPx,
          }}
        >
          {visible.map((it, i) => (
            <Tile
              key={it.id}
              item={it}
              aspectRatio={aspectRatio}
              overlayText={i === overlayOnIndex ? overlayText : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  // ====== PORTRAIT HERO: hero left, images stacked right ======
  if (heroIsPortrait) {
    const rightStack = secondary.slice(0, Math.min(3, secondaryCount));

    return (
      <div style={wrapperStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${portraitHeroWidthPct}fr ${100 - portraitHeroWidthPct}fr`,
            gap: gapPx,
          }}
        >
          {/* Left hero with locked 4:5 aspect ratio */}
          <Tile
            item={hero}
            aspectRatio={LOCKED_RATIOS.HERO_PORTRAIT}
            overlayText={0 === overlayOnIndex ? overlayText : undefined}
          />

          {/* Right stack with locked 4:3 aspect ratios */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: gapPx,
            }}
          >
            {rightStack.map((it, idx) => {
              const visibleIndex = idx + 1; // hero is index 0
              const showOverlay = visibleIndex === overlayOnIndex;

              return (
                <Tile
                  key={it.id}
                  item={it}
                  aspectRatio={LOCKED_RATIOS.SECONDARY}
                  overlayText={showOverlay ? overlayText : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ====== LANDSCAPE HERO: hero top, 3 tiles below ======
  const bottomRow = secondary.slice(0, Math.min(3, secondaryCount));
  const cols = bottomRow.length;

  return (
    <div style={wrapperStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: gapPx }}>
        {/* Hero with locked 3:2 aspect ratio */}
        <Tile
          item={hero}
          aspectRatio={LOCKED_RATIOS.HERO_LANDSCAPE}
          overlayText={0 === overlayOnIndex ? overlayText : undefined}
        />

        {/* Bottom row with locked 4:3 aspect ratios */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: gapPx,
          }}
        >
          {bottomRow.map((it, idx) => {
            const visibleIndex = idx + 1;
            const showOverlay = visibleIndex === overlayOnIndex;
            return (
              <Tile
                key={it.id}
                item={it}
                aspectRatio={LOCKED_RATIOS.SECONDARY}
                overlayText={showOverlay ? overlayText : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
