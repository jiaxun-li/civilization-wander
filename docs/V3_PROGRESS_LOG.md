# V3 进度日志

## 2026-07-30

- 阅读目标文件、仓库规则和 `docs/V3_REFACTOR_SPEC.md`。
- 审计 README、HTML、全局脚本、V1/V2 数据、查询、测试与地图生成流程。
- 确认基线为 `main` 的 `eb40c3e`，创建最终集成分支 `codex/v3-refactor`。
- 记录 V3 架构审计、迁移顺序、风险与检查点。
- 数据层 14 项测试通过，提交 `0bd016a DATA_SCHEMA_READY: implement V3 data model`。
- 将 DATA_SCHEMA_READY 合并到 `codex/v3-refactor`。
- Card/Scene UI 8 项测试通过，提交 `c225c1d CARD_UI_READY: implement V3 card reader`。
- Natural Earth 地图 9 项测试通过，提交 `91dd62c MAP_READY: implement local Natural Earth map`。
- 按顺序将 CARD_UI_READY、MAP_READY 合并到 `codex/v3-refactor`。
- 完成 V3 单一入口、品牌、首页、Card reader 与地图集成。
- 增加 integration 与四条规定流程 E2E 回归；当前全量 45 项测试通过。
- 下一检查点：真实浏览器桌面/移动端 E2E、控制台/网络与视觉验收。

## 2026-07-31

- 使用本地静态服务器与 Codex 内置浏览器完成桌面流程 A、B、C。
- 实测浏览器返回恢复来源 Card、Scene 和 `scrollY`；直链刷新保持目标 Scene。
- 完成 390 × 844 移动视口验收：单栏阅读、无横向溢出、无控制台错误。
- 完成六张人工验收截图，保存于 `docs/acceptance/`。
- QA 发现孔雀帝国首屏地图存在指向当前 Card 的自链接；拆分阿育王专属 MapState 并添加回归测试。
- 全量测试更新为 46/46；全部 V3 运行时文件通过语法检查。
- 记录性能基线：首屏 1.484 MiB，较 main 旧版减少 14.4%；warm reload 60 ms；Scene → MapState 同步 736 ms。
- 真实浏览器桌面与移动控制台均为 0 error / 0 warning。
- 完成 `docs/V3_ACCEPTANCE_REPORT.md`，结论 PASS。
- 下一检查点：提交集成分支、合并至 `codex/v3-refactor`、推送并创建 Draft PR。
