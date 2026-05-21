1. **数据源覆盖率与日志验证**：
   - [x] 检查 `sources.csv` 中的所有条目，是否均有对应的成功响应记录或在 `/error.log` 中的追加备案 。
   - [x] 确认在整个运行周期中，没有任何调用 Web 搜索或 Web 获取工具的记录。
2. **运行状态文件验证**：
   - [x] 确认 `/public/data/processed/2026-05-21/run_status.json` 已成功创建。
   - [x] 校验 `run_status.json` 的字段格式与 `DATA_FORMAT.md` 中定义的规则完全一致。
3. **部署安全验证**：
   - [x] 确认本地打包命令返回 exit code 0（无编译错误）。
   - [ ] 确认当前处于 `main` 分支，且 `git status` 确认所有生成的资产（包括 `run_status.json` 和 `error.log`）已被提交并安全推送到 origin。
