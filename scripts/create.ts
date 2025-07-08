#!/usr/bin/env node

import { copySync, ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import prompts from 'prompts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.join(__dirname, '..')

async function main() {
  // Get project name from user input
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'What is your project name?',
    validate: (value: string) => {
      if (!value) return 'Project name is required'
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Project name can only contain lowercase letters, numbers, and hyphens'
      }
      return true
    },
  })

  if (!response.projectName) {
    console.log('Project creation cancelled')
    process.exit(1)
  }

  const projectName = response.projectName
  const templateDir = path.join(ROOT_DIR, 'apps/next-template')
  const targetDir = path.join(ROOT_DIR, 'apps', projectName)

  // Check if target directory already exists
  try {
    ensureDirSync(targetDir)
  } catch (error: unknown) {
    console.error(`Failed to create directory: ${targetDir}`)
    process.exit(1)
  }

  try {
    // Copy template to new directory
    copySync(templateDir, targetDir, {
      filter: (src: string) => {
        // Skip node_modules and .next
        return !src.includes('node_modules') && !src.includes('.next')
      },
    })

    // Update package.json with new project name
    const packageJsonPath = path.join(targetDir, 'package.json')
    const packageJson = readJsonSync(packageJsonPath)
    packageJson.name = projectName
    writeJsonSync(packageJsonPath, packageJson, { spaces: 2 })

    console.log(`
✨ Project created successfully at ${targetDir}

To get started:
  cd apps/${projectName}
  pnpm install
  pnpm dev
    `)
  } catch (error: unknown) {
    console.error('Failed to create project:', error)
    process.exit(1)
  }
}

main().catch(console.error)
