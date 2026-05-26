# 预测市场接口汇总

> 来源：`layers/base-zoomex/apis/predictApis.ts` + `types/predict.d.ts`  
> 更新于 2026-05-26

---

## 一、接口总览

| # | 方法 | 路径 | 功能 | 登录态 |
|---|------|------|------|--------|
| 1 | GET | `/ce/pm/v1/api/categories` | 获取分类树 | 否 |
| 2 | GET | `/ce/pm/v1/api/event/list` | 获取事件/市场列表 | 否 |
| 3 | GET | `/ce/pm/v1/api/quote` | 查询盘口实时报价 | 否 |
| 4 | GET | `/ce/pm/v1/api/config` | 查询手续费等配置 | 否 |
| 5 | GET | `/ce/pm/v1/api/account` | 查询持仓子账户统计 | **是** |
| 6 | GET | `/ce/pm/v1/api/position/list` | 查询当前持仓列表 | **是** |
| 7 | GET | `/ce/pm/v1/api/settlement/list` | 查询已结算事件列表 | **是** |
| 8 | POST | `/ce/pm/v1/api/trade/buy` | 买入下单 | **是** |
| 9 | POST | `/ce/pm/v1/api/trade/sell` | 卖出下单 | **是** |
| — | GET | `/ce/prediction/v1/landing/config` | 预热页活动配置 | 否 |
| — | GET | `/ce/prediction/v1/landing/bets/me` | 查询我的竞猜记录 | **是** |
| — | POST | `/ce/prediction/v1/landing/bets` | 提交竞猜 | **是** |
| — | POST | `/ce/prediction/v1/landing/reservations` | 提交社区预约 | **是** |

---

## 二、正式预测市场接口（`/ce/pm/v1/api/...`）

### 1. GET `/ce/pm/v1/api/categories` — 获取分类树

**请求参数**：无

**返回值** (`CategoryListResult`)：

```ts
{
  tree: CategoryNode[]
}
```

`CategoryNode` 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | number | 分类 ID |
| `parentId` | number | 父分类 ID（根节点为 0） |
| `name` | string | 分类名称 |
| `translateKey` | string | i18n key（暂时为空字符串） |
| `slug` | string | URL slug，如 `"crypto-assets"`、`"sports"` |
| `level` | number | 层级：1=顶级，2=二级，3+=叶子 |
| `isLeaf` | boolean | 是否叶子节点（叶子节点挂载市场） |
| `marketCount` | number? | 叶子节点下的市场数量 |
| `children` | CategoryNode[]? | 子节点列表（最深 4 层） |

---

### 2. GET `/ce/pm/v1/api/event/list` — 获取事件/市场列表

**请求参数** (`MarketListParams`)：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `categoryId` | number | 否 | 叶子节点分类 ID |
| `isHot` | boolean | 否 | 是否热门筛选 |
| `page` | number | 否 | 页码，从 1 开始 |
| `pageSize` | number | 否 | 每页条数，默认 20 |

**返回值** (`MarketListResult`)：

```ts
{
  page: number,
  pageSize: number,
  total: number,
  list: EventItemVo[]
}
```

`EventItemVo` 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `eventId` | string | 事件 ID |
| `title` | string | 事件标题（卡片大标题） |
| `imageUrl` | string | 封面图 URL |
| `isHot` | boolean | 是否热门 |
| `negRisk` | boolean | 互斥结构（true：圆形概率+Yes/No；false：标准多行列表） |
| `endDate` | number | 截止时间 Unix 秒 |
| `totalVolume` | string | 事件总成交量，如 `"125000000"` |
| `rules` | string | 结算规则文案 |
| `teams` | TeamVo[] | 参与队伍（体育类），Crypto 类为空数组 |
| `markets` | MarketSubVo[] | 子市场列表（通常 1-2 个） |

`MarketSubVo` 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 市场 ID（报价/下单时使用） |
| `question` | string | 完整问题文本（调试用） |
| `miniTitle` | string | 短标题（旧字段） |
| `groupItemTitle` | string | **展示标题（UI 主用）** |
| `groupItemThreshold` | number | 组内排序值 |
| `sportsMarketType` | string? | 体育市场类型：`"moneyline"` / `"spreads"` |
| `wdlSlot` | string? | moneyline 槽位：`team0_win` / `draw` / `team1_win` |
| `totalVolume` | string | 总成交量 |
| `maxOrderAmount` | string? | 单笔最大下单金额 USDT |
| `tickSize` | string? | 步进精度，如 `"0.0001"` |
| `outcomes` | Record<string, MarketOutcomeVo> | 结果映射，key 为 `Yes`/`No`/`Down`/`Up` 或自定义 |

`MarketOutcomeVo` 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `outcomePrice` | string | CLOB 报价，小数形式，如 `"0.1655"` = 16.55% |
| `clobTokenId` | string | CLOB token ID（下单时传入） |

---

### 3. GET `/ce/pm/v1/api/quote` — 查询盘口实时报价

**请求参数** (`QuoteParams`)：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `marketId` | number/string | 与 tokenIds 至少填一个 | 市场 ID |
| `tokenIds` | string[] | 与 marketId 至少填一个 | ERC1155 token id 列表，单次最多 100 个 |

**返回值** (`QuoteListResult`)：

```ts
{
  list: QuoteItemVo[]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `tokenId` | string | CLOB ERC1155 token id |
| `bestAsk` | string | 最优卖出价（即买入方看到的价格） |
| `quotedAt` | number | 报价时间戳 |

---

### 4. GET `/ce/pm/v1/api/config` — 查询手续费配置

**请求参数**：无

**返回值** (`PredictConfigResult`)：

```ts
{
  feeRate: string,   // 手续费率，如 "0.02" = 2%
  [key: string]: unknown
}
```

---

### 5. GET `/ce/pm/v1/api/account` — 子账户统计（需登录）

**请求参数**：无

**返回值** (`AccountResult`)：

```ts
{
  userId: string,
  asset: string,       // "USDT"
  summary: {
    totalPositionValue: string,        // 持仓总价值
    participatedEventCount: number,    // 参与事件数
    maxSingleWinAmount: string,        // 最高单次赢得
    winRate: string,                   // 胜率，如 "0.5234"
    totalRealizedPnl: string,          // 总已实现盈亏
    quoteUnavailable: boolean          // 报价缓存不可用时为 true
  }
}
```

---

### 6. GET `/ce/pm/v1/api/position/list` — 当前持仓列表（需登录）

**请求参数** (`PageParams`)：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 默认 1 |
| `pageSize` | number | 否 | 默认 10 |

**返回值** (`PositionListResult`)：

```ts
{
  page: number,
  pageSize: number,
  total: number,
  list: PositionItem[]
}
```

`PositionItem` 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `marketId` | number | 市场主键 |
| `conditionId` | string | 条件 ID |
| `tokenId` | string | ERC1155 tokenId（卖出时传入） |
| `marketTitle` | string | 市场所属事件标题 |
| `imageUrl` | string/null | 事件封面图 |
| `outcomeIndex` | number | 0=YES / 1=NO |
| `outcomeLabel` | string | `"Yes"` / `"No"` |
| `size` | string | 当前持仓份额 |
| `sharesFrozen` | string | 冻结中的份额（卖单挂单） |
| `avgPrice` | string | 持仓均价 |
| `cumulativeSpent` | string | 累计投入金额 |
| `estimatedProceeds` | string | 按盘口估算的可得收益 |
| `marketValue` | string | 当前持仓市值 |
| `unrealizedPnl` | string | 当前浮动盈亏金额 |
| `pnlRate` | string | 盈亏率 |
| `bestBid` | string | 最优买价 |
| `bestAsk` | string | 最优卖价 |
| `midPrice` | string | 中间价 |
| `endDate` | string | 截止时间 |
| `marketStatus` | string | 市场状态 |
| `quoteUnavailable` | boolean | 报价不可用标记 |

---

### 7. GET `/ce/pm/v1/api/settlement/list` — 已结算事件（需登录）

**请求参数**：同 `PageParams`（page / pageSize）

**返回值** (`SettlementListResult`)：

```ts
{
  page: number,
  pageSize: number,
  total: number,
  list: SettlementItem[]
}
```

`SettlementItem` 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `settlementId` | string | 结算记录 ID |
| `settlementType` | `"RESOLVED"` / `"SOLD_EARLY"` | 结算类型：事件结算 / 提前卖出 |
| `marketId` | number | 市场 ID |
| `marketTitle` | string | 事件标题 |
| `conditionId` | string | 条件 ID |
| `tokenId` | string | ERC1155 tokenId |
| `imageUrl` | string/null | 事件封面图 |
| `outcomeIndex` | number | 0=YES / 1=NO |
| `outcomeLabel` | string | `"Yes"` / `"No"` |
| `cumulativeSpent` | string | 累计投入金额 |
| `winningShares` | string/null | 获胜份额（提前卖出为 null） |
| `payoutAmount` | string/null | 实际派发金额 |
| `payoutAsset` | string | 派发币种，一般 `"USDT"` |
| `payoutStatus` | string/null | 派发状态 |
| `realizedPnl` | string | 结算收益 |
| `pnlRate` | string | 收益率 |
| `settledAt` | string | 结算时间 ISO datetime |
| `amsLedgerId` | string | 账务系统流水 ID |

---

### 8. POST `/ce/pm/v1/api/trade/buy` — 买入下单（需登录）

**请求体** (`BuyOrderBody`)：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `tokenId` | string | **是** | YES/NO 侧 ERC1155 token id |
| `usdtAmount` | string | **是** | USDT 金额，需 ≥ 5 |
| `referencePrice` | string | 否 | 参考价，0 < price < 1 |

**返回值** (`BuyOrderResult`)：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | number | 内部订单主键 |
| `clientOrderId` | string | 服务端幂等键 |
| `status` | string | `NEW` / `CANCELLED` / `FAILED` / `SUBMITTING` / `PENDING_FUNDING` 等 |
| `polyOrderId` | string/null | CLOB 订单号 |
| `worstPrice` | number | 限价上限（服务端据 referencePrice 计算） |
| `usdtAmount` | number | 回显请求金额 |
| `referencePrice` | number | 回显参考价 |
| `side` | `"BUY"` | 固定 |
| `orderType` | `"FAK"` | 固定 |
| `timeInForce` | `"IOC"` | 固定 |
| `tokenId` | string? | CLOB token ID |
| `outcomeIndex` | number? | outcome 序号 |
| `feeRate` | number? | 费率 |
| `cancelReason` | string/null? | 取消原因 |
| `createdAt` | number/string? | 创建时间 |

---

### 9. POST `/ce/pm/v1/api/trade/sell` — 卖出下单（需登录）

**请求体** (`SellOrderBody`)：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `tokenId` | string | **是** | YES/NO 侧 ERC1155 token id |
| `shareSize` | string | **是** | 份额数量，需 > 0 |
| `referencePrice` | string | **是** | 参考价，0 < price < 1；服务端据此计算 worstPrice |

**返回值**：同 `BuyOrderResult`（复用同一类型）

---

## 三、预热页接口（`/ce/prediction/v1/landing/...`）

这组接口服务于 `/predict/warmup` 预热活动页，与正式预测市场功能无直接关联。

| 接口 | 说明 |
|------|------|
| GET `/ce/prediction/v1/landing/config` | 活动题目配置（标题、symbol、threshold、截止时间、选项列表等） |
| GET `/ce/prediction/v1/landing/bets/me` | 我的竞猜记录（hasBet、option、guessCorrect） |
| POST `/ce/prediction/v1/landing/bets` | 提交竞猜（activityId + option: "YES"/"NO"） |
| POST `/ce/prediction/v1/landing/reservations` | 提交社区预约（source: "landing_page"）→ 返回 boolean |

---

## 四、调用关系速查

```
/predict/[...category] 页面
  └─ usePredictPage()
       └─ usePredictionMarket()
            ├─ getCategories()       → /ce/pm/v1/api/categories
            └─ getEventList()        → /ce/pm/v1/api/event/list

下单面板（PlaceOrderFormDrawer）
  └─ usePredictPlaceOrder()
       ├─ getQuote()  (轮询 3s)     → /ce/pm/v1/api/quote
       ├─ getPredictConfig()         → /ce/pm/v1/api/config
       └─ buyOrder()                 → POST /ce/pm/v1/api/trade/buy

/predict/position 持仓页
  └─ usePredictPosition()
       ├─ getAccount()   (轮询 30s)  → /ce/pm/v1/api/account
       ├─ getPositionList()           → /ce/pm/v1/api/position/list
       ├─ getSettlementList()         → /ce/pm/v1/api/settlement/list
       └─ sellOrder()                 → POST /ce/pm/v1/api/trade/sell
```
