import type { Command } from 'commander';

type Options = {
  filepath: string;
};

export class Cli {
  constructor(private readonly command: Command) {}

  init(): void {
    this.command.option('-f, --filepath <filepath>', 'File path to fix', '');
    this.command.parse();
  }

  getOptions(): Options {
    return this.command.opts<Options>();
  }
}
