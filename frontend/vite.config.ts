import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "test-azj",
    project: "javascript-react"
  }), sentryVitePlugin({
    org: "test-azj",
    project: "javascript-react"
  }), sentryVitePlugin({
    org: "test-azj",
    project: "javascript-react-6n"
  })],

  publicDir:'src/',

  build: {
    sourcemap: true
  }
})