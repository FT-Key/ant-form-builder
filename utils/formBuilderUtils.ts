// Función para parsear bloques top-level del código (igual a tu parseInputsFromCodeInOrder)
export function parseInputsFromCodeInOrder(code: string) {
  if (!code) return [] as { block: string; index: number; length: number }[];

  const regexes: RegExp[] = [
    /<Form\.Item[\s\S]*?<\/Form\.Item>/g,
    /<Steps[\s\S]*?<\/Steps>/g,
    /<Descriptions[\s\S]*?<\/Descriptions>/g,
    /<Divider\s?\/?>/g,
    /<Tour[\s\S]*?<\/Tour>/g,
    /<FloatButton[\s\S]*?\/>/g,
    /<Watermark[\s\S]*?<\/Watermark>/g,
    /<QRCode[\s\S]*?\/>/g,
    /<Image\.PreviewGroup[\s\S]*?<\/Image\.PreviewGroup>/g,
  ];

  const raw: { block: string; index: number; length: number }[] = [];

  for (const r of regexes) {
    let m;
    r.lastIndex = 0;
    while ((m = r.exec(code)) !== null) {
      raw.push({ block: m[0], index: m.index, length: m[0].length });
    }
  }

  raw.sort((a, b) => a.index - b.index);

  const topLevel: typeof raw = [];
  for (let i = 0; i < raw.length; i++) {
    const cur = raw[i];
    let isNested = false;
    for (let j = 0; j < raw.length; j++) {
      if (i === j) continue;
      const other = raw[j];
      if (
        other.index <= cur.index &&
        other.index + other.length >= cur.index + cur.length
      ) {
        isNested = true;
        break;
      }
    }
    if (!isNested) topLevel.push(cur);
  }

  return topLevel;
}

export function getRootName(block: string): string | null {
  const m = block.trim().match(/^<\s*([A-Za-z0-9_.]+)/);
  return m ? m[1] : null;
}
