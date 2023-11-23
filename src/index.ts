#!/usr/bin/env node
import { Cli } from './cli';
import { Command } from 'commander';
import { main } from './main';

const cli = new Cli(new Command());
const [filepath] = cli.getArgs();

main(filepath);
