import type { Command } from 'commander';

type Args = string[];

export class Cli {
  constructor(private readonly command: Command) {}

  getArgs(): Args {
    const args: string[] = [];

    this.command
      .argument('[filepath]', 'file path to fix', '"*.css" "*.scss"')
      .action((filepath) => {
        args.push(filepath);
      })
      .parse();

    return args;
  }
}
