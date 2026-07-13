import { Node, mergeAttributes } from "@tiptap/core";

/**
 * A block for text Porua wrote, so the machine's contribution stays visibly
 * distinct from yours. Registering it as a real node is what lets the wrapper
 * survive setContent and round-trip through the saved HTML — TipTap drops any
 * element its schema doesn't know about.
 */
export const PoruaNote = Node.create({
  name: "poruaNote",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: "div.porua-note" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "porua-note" }),
      0,
    ];
  },
});

export default PoruaNote;
