/**
 * 运行状态日志系统
 * 
 * 功能：
 * 1. 生成结构化的 run_status.json，供前端展示数据源健康度
 * 2. 维护追加式的 error.log（Markdown 格式），便于人工查看和 Git 追踪
 */

import { writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

/**
 * 错误类型枚举
 * 用于标准化错误分类，便于前端展示和自动化处理
 */
export const ErrorType = {
  // HTTP 相关错误
  HTTP_STATUS_403: 'HTTP_STATUS_403',
  HTTP_STATUS_404: 'HTTP_STATUS_404',
  HTTP_STATUS_429: 'HTTP_STATUS_429',
  HTTP_STATUS_500: 'HTTP_STATUS_500',
  HTTP_STATUS_502: 'HTTP_STATUS_502',
  HTTP_STATUS_503: 'HTTP_STATUS_503',
  HTTP_STATUS_504: 'HTTP_STATUS_504',
  HTTP_NETWORK_ERROR: 'HTTP_NETWORK_ERROR',
  HTTP_TIMEOUT: 'HTTP_TIMEOUT',

  // 解析相关错误
  SELECTOR_NOT_FOUND: 'SELECTOR_NOT_FOUND',
  JSON_PARSE_ERROR: 'JSON_PARSE_ERROR',
  HTML_PARSE_ERROR: 'HTML_PARSE_ERROR',
  XML_PARSE_ERROR: 'XML_PARSE_ERROR',

  // 数据源相关错误
  SOURCE_DEPRECATED: 'SOURCE_DEPRECATED',
  SOURCE_BLOCKED: 'SOURCE_BLOCKED',
  SOURCE_RATE_LIMITED: 'SOURCE_RATE_LIMITED',

  // 系统/配置错误
  CONFIG_ERROR: 'CONFIG_ERROR',
  FILE_SYSTEM_ERROR: 'FILE_SYSTEM_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * 获取当前日期的 YYYY-MM-DD 格式字符串
 * @returns {string} 格式化的日期字符串
 */
function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * 获取当前 UTC 时间的 ISO 字符串
 * @returns {string} ISO 格式的时间字符串
 */
function getCurrentUTCTime() {
  return new Date().toISOString();
}

/**
 * 计算两个 ISO 时间字符串之间的秒数差
 * @param {string} startTime - 开始时间（ISO 格式）
 * @param {string} endTime - 结束时间（ISO 格式）
 * @returns {number} 时间差（秒）
 */
function calculateDurationSeconds(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / 1000);
}

/**
 * 确保目录存在，如果不存在则递归创建
 * @param {string} dirPath - 目录路径
 */
function ensureDirectoryExists(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 运行状态记录器类
 * 
 * 使用示例：
 * ```javascript
 * const logger = new RunStatusLogger();
 * logger.startRun();
 * 
 * // 记录成功
 * logger.recordSuccess();
 * 
 * // 记录失败
 * logger.recordFailure({
 *   source_id: 'elonmusk',
 *   name: 'Elon Musk',
 *   category: 'Twitter/X',
 *   url_attempted: 'https://nitter.net/elonmusk',
 *   error_type: ErrorType.HTTP_STATUS_504,
 *   error_message: 'Gateway Timeout from Nitter instance',
 *   retries_attempted: 3
 * });
 * 
 * // 结束运行并生成日志文件
 * await logger.finishRun();
 * ```
 */
export class RunStatusLogger {
  constructor() {
    this.runDate = getTodayDateString();
    this.startTime = null;
    this.endTime = null;
    this.successes = [];
    this.failures = [];
    this.totalConfiguredSources = 0;
  }

  /**
   * 开始记录一次新的运行
   * @param {number} totalSources - 配置的数据源总数
   */
  startRun(totalSources = 0) {
    this.startTime = getCurrentUTCTime();
    this.totalConfiguredSources = totalSources;
    this.successes = [];
    this.failures = [];
  }

  /**
   * 记录一个成功的爬取
   * @param {Object} sourceInfo - 数据源信息
   * @param {string} sourceInfo.source_id - 数据源 ID
   * @param {string} sourceInfo.name - 数据源名称
   * @param {string} sourceInfo.category - 数据源分类
   */
  recordSuccess(sourceInfo) {
    this.successes.push({
      source_id: sourceInfo.source_id,
      name: sourceInfo.name,
      category: sourceInfo.category,
      timestamp: getCurrentUTCTime()
    });
  }

  /**
   * 记录一个失败的爬取
   * @param {Object} failureInfo - 失败信息
   * @param {string} failureInfo.source_id - 数据源 ID
   * @param {string} failureInfo.name - 数据源名称
   * @param {string} failureInfo.category - 数据源分类
   * @param {string} failureInfo.url_attempted - 尝试访问的 URL
   * @param {string} failureInfo.error_type - 错误类型（使用 ErrorType 枚举）
   * @param {string} failureInfo.error_message - 错误详情
   * @param {number} [failureInfo.retries_attempted=0] - 重试次数
   */
  recordFailure(failureInfo) {
    this.failures.push({
      source_id: failureInfo.source_id,
      name: failureInfo.name,
      category: failureInfo.category,
      url_attempted: failureInfo.url_attempted,
      error_type: failureInfo.error_type || ErrorType.UNKNOWN_ERROR,
      error_message: failureInfo.error_message,
      retries_attempted: failureInfo.retries_attempted || 0,
      timestamp: getCurrentUTCTime()
    });
  }

  /**
   * 结束运行并生成日志文件
   * @returns {Promise<Object>} 运行状态对象
   */
  async finishRun() {
    this.endTime = getCurrentUTCTime();

    const runStatus = this.generateRunStatus();
    
    // 写入 run_status.json
    await this.writeRunStatusJson(runStatus);
    
    // 追加写入 error.log
    if (this.failures.length > 0) {
      await this.appendErrorLog();
    }

    return runStatus;
  }

  /**
   * 生成运行状态对象
   * @returns {Object} 符合规范的运行状态对象
   */
  generateRunStatus() {
    const totalAttempts = this.successes.length + this.failures.length;
    const successRate = totalAttempts > 0 
      ? parseFloat(((this.successes.length / totalAttempts) * 100).toFixed(2))
      : 0;

    return {
      run_date: this.runDate,
      start_time_utc: this.startTime,
      end_time_utc: this.endTime,
      execution_duration_seconds: calculateDurationSeconds(this.startTime, this.endTime),
      stats: {
        total_configured_sources: this.totalConfiguredSources,
        successful_scrapes: this.successes.length,
        failed_scrapes: this.failures.length,
        success_rate_percent: successRate
      },
      failures: this.failures.map(f => ({
        source_id: f.source_id,
        name: f.name,
        category: f.category,
        url_attempted: f.url_attempted,
        error_type: f.error_type,
        error_message: f.error_message,
        retries_attempted: f.retries_attempted
      }))
    };
  }

  /**
   * 写入 run_status.json 文件
   * @param {Object} runStatus - 运行状态对象
   */
  async writeRunStatusJson(runStatus) {
    const outputDir = join(projectRoot, 'public', 'data', 'processed', this.runDate);
    ensureDirectoryExists(outputDir);

    const filePath = join(outputDir, 'run_status.json');
    writeFileSync(filePath, JSON.stringify(runStatus, null, 2) + '\n', 'utf-8');
    
    console.log(`✅ 已生成运行状态文件: ${filePath}`);
  }

  /**
   * 追加写入 error.log 文件
   */
  async appendErrorLog() {
    const logFilePath = join(projectRoot, 'error.log');
    
    const markdownContent = this.generateErrorLogMarkdown();
    appendFileSync(logFilePath, markdownContent, 'utf-8');
    
    console.log(`📝 已追加错误日志: ${logFilePath} (${this.failures.length} 个失败)`);
  }

  /**
   * 生成 Markdown 格式的错误日志
   * @returns {string} Markdown 格式的日志内容
   */
  generateErrorLogMarkdown() {
    const timestamp = this.startTime.replace('T', ' ').replace('Z', ' UTC');
    
    let markdown = `\n## [${timestamp}] 运行失败源汇总 (共 ${this.failures.length} 个失败)\n\n`;
    markdown += '| 信息源 ID | 名称 | 分类 | 尝试地址 | 错误类型 | 失败原因 |\n';
    markdown += '| :--- | :--- | :--- | :--- | :--- | :--- |\n';

    for (const failure of this.failures) {
      const url = failure.url_attempted ? `\`${failure.url_attempted}\`` : '-';
      const errorType = failure.error_type ? `\`${failure.error_type}\`` : '-';
      const errorMsg = failure.error_message || '-';
      
      markdown += `| ${failure.source_id} | ${failure.name} | ${failure.category} | ${url} | ${errorType} | ${errorMsg} |\n`;
    }

    markdown += '\n---\n';
    
    return markdown;
  }
}

/**
 * 便捷的独立函数：快速记录一次运行状态
 * 
 * @param {Object} options - 配置选项
 * @param {string} options.runDate - 运行日期（YYYY-MM-DD）
 * @param {string} options.startTime - 开始时间（ISO 格式）
 * @param {string} options.endTime - 结束时间（ISO 格式）
 * @param {number} options.totalConfiguredSources - 配置的数据源总数
 * @param {number} options.successfulScrapes - 成功爬取数
 * @param {Array} options.failures - 失败记录数组
 * @returns {Promise<Object>} 运行状态对象
 * 
 * 使用示例：
 * ```javascript
 * await logRunStatus({
 *   startTime: '2026-05-20T03:00:00Z',
 *   endTime: '2026-05-20T03:12:45Z',
 *   totalConfiguredSources: 54,
 *   successfulScrapes: 49,
 *   failures: [...]
 * });
 * ```
 */
export async function logRunStatus(options = {}) {
  const logger = new RunStatusLogger();
  
  logger.runDate = options.runDate || getTodayDateString();
  logger.startTime = options.startTime || getCurrentUTCTime();
  logger.endTime = options.endTime || getCurrentUTCTime();
  logger.totalConfiguredSources = options.totalConfiguredSources || 0;
  
  // 根据成功数和失败数重建记录
  const successfulScrapes = options.successfulScrapes || 0;
  for (let i = 0; i < successfulScrapes; i++) {
    logger.successes.push({ timestamp: logger.startTime });
  }
  
  if (options.failures && Array.isArray(options.failures)) {
    logger.failures = options.failures.map(f => ({
      ...f,
      timestamp: logger.startTime
    }));
  }

  return await logger.finishRun();
}

// 如果直接运行此脚本，执行示例
async function runExample() {
  console.log('🧪 运行 logger.js 示例...\n');

  const logger = new RunStatusLogger();
  logger.startRun(54);

  // 模拟一些成功记录
  logger.recordSuccess({ source_id: 'openai_x', name: 'OpenAI', category: 'Twitter/X' });
  logger.recordSuccess({ source_id: 'anthropic_x', name: 'Anthropic', category: 'Twitter/X' });

  // 模拟一些失败记录
  logger.recordFailure({
    source_id: 'elonmusk',
    name: 'Elon Musk',
    category: 'Twitter/X',
    url_attempted: 'https://nitter.net/elonmusk',
    error_type: ErrorType.HTTP_STATUS_504,
    error_message: 'Gateway Timeout from Nitter instance',
    retries_attempted: 3
  });

  logger.recordFailure({
    source_id: 'clsvip',
    name: '财联社 VIP',
    category: 'Telegram',
    url_attempted: 'https://t.me/s/clsvip',
    error_type: ErrorType.SELECTOR_NOT_FOUND,
    error_message: '未定位到 TG 消息元素模板',
    retries_attempted: 1
  });

  await logger.finishRun();
  
  console.log('\n✨ 示例运行完成！');
}

// 检测是否直接运行此脚本
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1]) ||
                     process.argv[1].includes('logger.js');

if (isMainModule) {
  runExample();
}
