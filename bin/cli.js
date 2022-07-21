#!/usr/bin/env node

const { execSync } = require('child_process')

const runCommand = (command) => {
    try{
        execSync(`${command}`, {stdio: 'inherit'})
    }catch(e){
        console.log(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const src = 'https://github.com/websaam/sdk-ts-starter.git';
const gitCheckoutCommand = `git clone --depth 1 ${src} ${repoName}`;
const installDepsCommand = `cd ${repoName} && yarn`;

console.log(`Cloning the repository with name ${repoName}`);

const checkout = runCommand(gitCheckoutCommand);

if( ! checkout ) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);

const installDeps = runCommand(installDepsCommand);

if( ! installDeps ) process.exit(-1);

console.log("Done!");