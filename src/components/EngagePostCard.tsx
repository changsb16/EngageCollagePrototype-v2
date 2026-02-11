import EngageImageCollage from "./EngageImageCollage";
import type { MediaItem } from "./EngageImageCollage";

type EngagePostCardProps = {
  author: {
    name: string;
    avatarSrc: string;
    subtitle?: string; // optional: e.g. "Shared on ___'s storyline"
  };
  dateText: string;
  seenByCount: number;
  text: string;
  mediaItems: MediaItem[];
  reactionsSummary: {
    topReactorName: string;
    othersCount: number;
  };
};

export default function EngagePostCard(props: EngagePostCardProps) {
  const { author, dateText, seenByCount, text, mediaItems, reactionsSummary } = props;

  return (
    <article style={styles.card}>
      {author.subtitle ? <div style={styles.subtitle}>{author.subtitle}</div> : null}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src={author.avatarSrc} alt={author.name} style={styles.avatar} />
          <div style={styles.headerText}>
            <div style={styles.authorName}>{author.name}</div>
            <div style={styles.dateText}>{dateText}</div>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.seenBy}>Seen by {seenByCount}</div>
          <button style={styles.iconButton} aria-label="More options" title="More options">
            ⋯
          </button>
        </div>
      </header>

      {/* Body text */}
      <div style={styles.body}>
        <p style={styles.postText}>{text}</p>
      </div>

      {/* Media */}
      {mediaItems.length > 0 ? (
        <div style={styles.mediaWrap}>
          <EngageImageCollage items={mediaItems} maxVisible={4} />
        </div>
      ) : null}

      {/* Reactions summary */}
      <div style={styles.reactionsRow}>
        <div style={styles.reactionsLeft}>
          <span style={styles.reactionPills}>
            <span style={styles.reactionPill} aria-hidden>
              ❤️
            </span>
            <span style={styles.reactionPill} aria-hidden>
              🎉
            </span>
            <span style={styles.reactionPill} aria-hidden>
              👍
            </span>
          </span>
          <span style={styles.reactionsText}>
            {reactionsSummary.topReactorName} and {reactionsSummary.othersCount} others
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actionsRow}>
        <button style={styles.actionButton} type="button">
          <span style={styles.actionIcon} aria-hidden>
            ♡
          </span>
          Like
        </button>
        <button style={styles.actionButton} type="button">
          <span style={styles.actionIcon} aria-hidden>
            💬
          </span>
          Comment
        </button>
        <button style={styles.actionButton} type="button">
          <span style={styles.actionIcon} aria-hidden>
            ↗
          </span>
          Share
        </button>
      </div>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
    padding: 16,
    maxWidth: 500,
    margin: "0 auto",
    fontFamily:
      'Segoe UI, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    color: "#1f2937",
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 10,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  headerLeft: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    minWidth: 0,
  },
  headerText: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  authorName: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dateText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    objectFit: "cover",
    flex: "0 0 auto",
  },

  headerRight: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flex: "0 0 auto",
  },
  seenBy: {
    fontSize: 13,
    color: "#6b7280",
  },
  iconButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 22,
    lineHeight: 1,
    padding: "6px 8px",
    borderRadius: 8,
    color: "#6b7280",
  },

  body: {
    marginTop: 12,
  },
  postText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.45,
    whiteSpace: "pre-wrap",
  },

  mediaWrap: {
    marginTop: 12,
  },

  reactionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTop: "1px solid rgba(0,0,0,0.08)",
  },
  reactionsLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  reactionPills: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  reactionPill: {
    width: 22,
    height: 22,
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    background: "rgba(0,0,0,0.05)",
  },
  reactionsText: {
    fontSize: 13,
    color: "#374151",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  actionsRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "10px 8px",
    borderRadius: 10,
    fontSize: 14,
    color: "#374151",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionIcon: {
    fontSize: 16,
    lineHeight: 1,
  },
};
