const COLORS = {
  FOREGROUND: {
    BLACK_BOLD: '\x1b[30m\x1b[1m',
    GRAY: '\x1b[37m',
  },
  BACKGROUND: {
    GREEN: '\x1b[42m',
  },
};

export class LogColor {
  addFgColor(str: string, color: keyof typeof COLORS.FOREGROUND): string {
    return `${COLORS.FOREGROUND[color]}${str}\x1b[0m`;
  }

  addBgColor(str: string, color: keyof typeof COLORS.BACKGROUND): string {
    return `${COLORS.BACKGROUND[color]}${str}\x1b[0m`;
  }
}
