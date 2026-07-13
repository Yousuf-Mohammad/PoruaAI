import React from "react";
import { cn } from "@/lib/utils";

/**
 * The mark is the marker: a single skewed stroke, the same gesture the app
 * uses to highlight a passage, shrunk to a glyph.
 */
const Wordmark = ({ className, showSubtitle = false }) => {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="h-4 w-2.5 shrink-0 -skew-x-12 rounded-[1px_3px_2px_4px] bg-marker"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] font-semibold tracking-tight text-ink">
          porua
        </span>
        {showSubtitle && (
          <span className="eyebrow mt-1 text-[9px]">reading workspace</span>
        )}
      </span>
    </span>
  );
};

export default Wordmark;
