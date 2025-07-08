#!/usr/bin/env node

import { readdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import prompts from 'prompts'
import { spawnSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.join(__dirname, '..')
const APPS_DIR = path.join(ROOT_DIR, 'apps')

async function main() {
  try {
    // Read all directories in apps folder
    const apps = readdirSync(APPS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => !name.startsWith('.')) // Filter out hidden directories

    if (apps.length === 0) {
      console.error('No apps found in the apps directory')
      process.exit(1)
    }

    // Prompt user to select an app
    const response = await prompts({
      type: 'select',
      name: 'app',
      message: 'Which app would you like to run?',
      choices: apps.map(app => ({
        title: app,
        value: app
      }))
    })

    if (!response.app) {
      console.log('No app selected')
      process.exit(1)
    }

    // Run the selected app using turbo
    console.log(`Starting ${response.app}...`)
    const result = spawnSync('pnpm', ['turbo', 'run', 'dev', `--filter=${response.app}`], {
      stdio: 'inherit',
      shell: true
    })

    process.exit(result.status ?? 1)
  } catch (error: unknown) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main().catch(console.error)
