const path = require("path");

const rootPath = path.join(__dirname, "../..");

const erbPath = path.join(__dirname, "..");
const erbNodeModulesPath = path.join(erbPath, "node_modules");

const dllPath = path.join(__dirname, "../dll");

const srcPath = path.join(rootPath, "src");
const srcMainPath = path.join(srcPath, "main/ts");
const srcAppPath = path.join(srcMainPath, "app");
const srcRendererPath = path.join(rootPath, "web");

const releasePath = path.join(rootPath, "release");
const appPath = path.join(releasePath, "app");
const appPackagePath = path.join(appPath, "package.json");
const appNodeModulesPath = path.join(appPath, "node_modules");
const srcNodeModulesPath = path.join(srcPath, "node_modules");

const distPath = path.join(appPath, "dist");
const distMainPath = path.join(distPath, "main/ts");
const distRendererPath = path.join(appPath, "web/tsx");

const buildPath = path.join(releasePath, "build");

export default {
    appNodeModulesPath,
    appPackagePath,
    appPath,
    buildPath,
    distMainPath,
    distPath,
    distRendererPath,
    dllPath,
    erbNodeModulesPath,
    releasePath,
    rootPath,
    srcAppPath,
    srcMainPath,
    srcNodeModulesPath,
    srcPath,
    srcRendererPath,
};
