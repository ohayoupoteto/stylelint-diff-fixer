#!/usr/bin/env node
import { Cli } from './cli';
import { Command } from 'commander';
import { main } from './main';

const cli = new Cli(new Command());
cli.init();
const { filepath } = cli.getOptions();

main(filepath);
