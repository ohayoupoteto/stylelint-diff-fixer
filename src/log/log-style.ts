const STYLES = {
  RESET: '\x1b[0m',
  COLOR: {
    FG_BLACK: '\x1b[30m',
    BG_GREEN: '\x1b[42m',
  },
  WEIGHT: {
    BOLD: '\x1b[1m',
    THIN: '\x1b[2m',
  },
};

export class LogStyle {
  setColor(str: string, color: keyof typeof STYLES.COLOR): string {
    return `${STYLES.COLOR[color]}${str}${STYLES.RESET}`;
  }

  setWeight(str: string, weight: keyof typeof STYLES.WEIGHT): string {
    return `${STYLES.WEIGHT[weight]}${str}${STYLES.RESET}`;
  }
}
