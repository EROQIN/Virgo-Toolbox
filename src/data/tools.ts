export type ToolCategory =
  | "文本处理"
  | "开发助手"
  | "网络工具"
  | "效率工具"
  | "时间工具"
  | "安全工具"
  | "设计工具"
  | "计算工具";

export type ToolDefinition = {
  slug: string;
  title: string;
  category: ToolCategory;
  description: string;
  summary: string;
  badge: string;
  keywords: string[];
  icon?: string;
};

export const TOOL_CATEGORIES: Array<{ id: ToolCategory; label: string }> = [
  { id: "文本处理", label: "文本处理" },
  { id: "开发助手", label: "开发助手" },
  { id: "网络工具", label: "网络工具" },
  { id: "效率工具", label: "效率工具" },
  { id: "时间工具", label: "时间工具" },
  { id: "安全工具", label: "安全工具" },
  { id: "设计工具", label: "设计工具" },
  { id: "计算工具", label: "计算工具" },
];

export const TOOL_LIST: ToolDefinition[] = [
  {
    slug: "base64",
    title: "Base64 编解码器",
    category: "开发助手",
    description:
      "输入原始文本即可完成 Base64 编码，或粘贴 Base64 字符串查看解码结果。所有操作均在本地浏览器内完成。",
    summary: "快速处理 Base64 字符串，方便调试接口与数据传输。",
    badge: "编码 · 文本",
    keywords: ["base64", "编码", "解码", "文本"],
    icon: "🧮",
  },
  {
    slug: "unit-converter",
    title: "单位换算助手",
    category: "计算工具",
    description:
      "选择类别与单位后输入数值，即可实时得到换算结果。支持长度、温度及存储容量等常见维度。",
    summary: "覆盖常用换算场景，适合估算数据与撰写文档。",
    badge: "换算 · 数值",
    keywords: ["单位", "换算", "长度", "存储", "温度"],
    icon: "📐",
  },
  {
    slug: "word-counter",
    title: "字数统计与阅读时间",
    category: "文本处理",
    description:
      "粘贴或输入文本即可实时查看词数、字符数、行数以及预估阅读时间，帮助快速评估内容长度。",
    summary: "写作必备的字数统计器。",
    badge: "统计 · 内容",
    keywords: ["字数", "统计", "阅读时间", "文本"],
    icon: "✍️",
  },
  {
    slug: "ip-lookup",
    title: "IP 地址查询",
    category: "网络工具",
    description:
      "获取当前公网 IP 地址，排查网络问题或与团队共享信息。数据使用 ipify 服务。",
    summary: "一键查询公网 IP。",
    badge: "网络 · 查询",
    keywords: ["ip", "网络", "排查", "查询"],
    icon: "🌐",
  },
  {
    slug: "timestamp",
    title: "时间戳转换器",
    category: "时间工具",
    description:
      "在 Unix 时间戳与可读日期之间自由转换，支持秒与毫秒两种精度，并可快速获取当前时间。",
    summary: "开发调试常见的时间戳换算器。",
    badge: "时间 · 转换",
    keywords: ["时间戳", "unix", "日期", "秒", "毫秒"],
    icon: "🕒",
  },
  {
    slug: "text-case",
    title: "文本大小写转换",
    category: "文本处理",
    description:
      "支持大写、小写、标题格式、驼峰等多种常见格式，一键转换文本风格。",
    summary: "自动转换文字大小写样式。",
    badge: "文本 · 格式",
    keywords: ["大小写", "转换", "标题", "驼峰"],
    icon: "🔤",
  },
  {
    slug: "json-formatter",
    title: "JSON 格式化校验",
    category: "开发助手",
    description:
      "粘贴 JSON 内容后即可查看格式化结果与语法校验信息，支持压缩输出与复制。",
    summary: "调试接口时的 JSON 好帮手。",
    badge: "格式化 · 校验",
    keywords: ["json", "格式化", "校验", "开发"],
    icon: "🧾",
  },
  {
    slug: "password-generator",
    title: "随机密码生成器",
    category: "安全工具",
    description:
      "根据需求选择长度、字符类型与是否包含相似字符，快速生成安全密码。",
    summary: "自定义规则生成强密码。",
    badge: "安全 · 生成",
    keywords: ["密码", "安全", "随机", "生成"],
    icon: "🔐",
  },
  {
    slug: "color-converter",
    title: "颜色转换助手",
    category: "设计工具",
    description:
      "在 HEX、RGB 与 HSL 之间转换并实时预览颜色，帮你快速找到设计配色数值。",
    summary: "前端与设计常用的颜色换算器。",
    badge: "颜色 · 转换",
    keywords: ["颜色", "hex", "rgb", "hsl", "设计"],
    icon: "🎨",
  },
  {
    slug: "markdown-preview",
    title: "Markdown 即时预览",
    category: "效率工具",
    description:
      "输入 Markdown 文本即可实时渲染 HTML 预览，支持常用语法与代码块。",
    summary: "可视化对照 Markdown。",
    badge: "文档 · 预览",
    keywords: ["markdown", "预览", "文档", "渲染"],
    icon: "📝",
  },
  {
    slug: "regex-tester",
    title: "正则表达式测试",
    category: "开发助手",
    description:
      "即时测试 JavaScript 正则表达式，查看匹配结果与捕获分组，便于调试复杂模式。",
    summary: "可视化调试正则，支持分组与全局匹配。",
    badge: "正则 · 调试",
    keywords: ["regex", "正则", "匹配", "表达式"],
    icon: "🧩",
  },
  {
    slug: "cron-helper",
    title: "Cron 表达式助手",
    category: "开发助手",
    description:
      "帮助你理解 Cron 表达式含义，计算接下来几次执行时间，并提供常用模板。",
    summary: "Cron 解析与时间预览。",
    badge: "调度 · 时间",
    keywords: ["cron", "表达式", "调度", "时间"],
    icon: "🗓️",
  },
  {
    slug: "uuid-generator",
    title: "UUID 批量生成",
    category: "开发助手",
    description:
      "基于浏览器环境快速生成多个标准 UUID，可选择是否包含大写与分隔符。",
    summary: "一次生成多个 UUID。",
    badge: "标识 · 生成",
    keywords: ["uuid", "标识", "随机", "生成"],
    icon: "🆔",
  },
  {
    slug: "random-string",
    title: "随机字符串生成",
    category: "开发助手",
    description:
      "选择长度与字符集即刻生成随机字符串，支持多种常见场景如密钥、短码等。",
    summary: "自定义字符集的随机串。",
    badge: "字符串 · 随机",
    keywords: ["随机", "字符串", "生成", "密钥"],
    icon: "🔢",
  },
  {
    slug: "music-player",
    title: "专注音乐播放器",
    category: "效率工具",
    description:
      "在浏览器内播放适合编码的 Lo-Fi 背景音乐，支持切换曲目与查看播放进度。",
    summary: "陪你写代码的轻量播放器。",
    badge: "专注 · 音乐",
    keywords: ["音乐", "lofi", "专注", "播放器"],
    icon: "🎧",
  },
  {
    slug: "qr-generator",
    title: "二维码生成器",
    category: "效率工具",
    description:
      "输入文本或链接即可生成二维码，支持调整尺寸、纠错级别及前景/背景颜色。",
    summary: "自定义二维码并下载 PNG。",
    badge: "图形 · 编码",
    keywords: ["二维码", "qr", "生成", "下载"],
    icon: "🔲",
  },
  {
    slug: "barcode-generator",
    title: "条形码生成器",
    category: "效率工具",
    description:
      "支持 Code128、EAN-13 等格式的条形码生成，可设置颜色并下载 SVG 文件。",
    summary: "多格式条形码快速生成。",
    badge: "条码 · 生成",
    keywords: ["条形码", "barcode", "SVG", "Code128"],
    icon: "🏷️",
  },
];
