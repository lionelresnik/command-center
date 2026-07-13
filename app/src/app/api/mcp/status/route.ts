import { NextResponse } from "next/server"
import fs from "fs"
import os from "os"
import path from "path"

export async function GET() {
  const dbPath = path.join(os.homedir(), ".command-center", "cc.db")
  const repoRoot = path.resolve(process.cwd(), "..")
  const mcpPath = path.join(repoRoot, "mcp", "dist", "index.js")

  const dbExists = fs.existsSync(dbPath)
  const mcpBuilt = fs.existsSync(mcpPath)

  const config = JSON.stringify({
    mcpServers: {
      "command-center": {
        command: "node",
        args: [mcpPath],
      },
    },
  }, null, 2)

  return NextResponse.json({
    dbExists,
    mcpBuilt,
    mcpPath,
    dbPath,
    config,
    toolCount: 17,
  })
}
