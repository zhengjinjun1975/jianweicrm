# P0: 补全业务字段 + 清理废弃字段 + 建立对象关系

## 环境
- Docker: 4个 twenty 容器正常跑，server healthy at localhost:3000
- 用户：zjjemail@qq.com / zheng2004
- 工作区: colorful-sapphire-bear
- 数据已通过 fill-data.cjs 注入，现在直接操作 REST API

## REST API 认证流程（每个脚本都要做的 boilerplate）
1. POST http://localhost:3000/rest/login { "email": "zjjemail@qq.com", "password": "zheng2004" }
   → 拿到 accessToken (请求头用 Authorization: Bearer <token>)
2. 后续所有请求带这个 token

## 操作顺序

### Step 0: 清理废弃字段
对 project 对象，删除这些字段（用 PATCH /rest/metadata/objects/<projectId>/fields/<fieldId> 把 isActive 设为 false）：
- testField4 (测试字段4)
- numT1 (NumT1)
- testSimple1781352416370 (测试简单字段)
- clientName (客户名称) — 改为 RELATION，所以删文本字段
- selT7 (SelT7)

对 contract 对象，删除这些字段：
- syctrname (合同名称) — 已有 contractNamev2
- syctrstartdatev2 (合同开始日期) — 改为 syctrstartdate
- syctrenddatev2 (合同结束日期) — 改为 syctrenddate

### Step 1: 补全业务字段

#### 1a. 项目 (project) id=8d64381d-6246-4f87-a82e-81141ca520f6
| 字段名 | 类型 | 标签 | 说明 |
|--------|------|------|------|
| sypjtstatus | SELECT | 项目状态 | options: PRELIMINARY=初步接触, REQUIREMENT=需求沟通, PROPOSAL=方案报价, NEGOTIATION=商务谈判, SIGNED=签约, DELIVERY=实施交付 |
| sypjtpriority | SELECT | 优先级 | options: P0=P0 紧急, P1=P1 高, P2=P2 中, P3=P3 低 |
| sypjtowner | RELATION → WorkspaceMember | 负责人 | 可选，多对一 |
| sypjtstartdate | DATE | 开始日期 | 可选 |
| sypjtenddate | DATE | 截止日期 | 可选 |
| sypjtestamount | NUMBER | 预计金额 | 可选 |
| sypjtactualcost | NUMBER | 实际成本 | 可选 |
| sypjtdesc | TEXT | 项目描述 | 长文本，可选 |
| sypjtindustry | TEXT | 行业标签 | 可选，如 "地球物理 / 制造业 / 能源 / 其他" |
| sypjttags | TEXT | 标签 | 可选 |

注意：字段名必须是小写字母数字（无下划线）！SELECT 必须有 options 数组。

#### 1b. 报价 (quote) id=e4e7555b-4daf-4558-bc60-2e10444a95d4
已有字段不做。如果有需要新加的字段：
| 字段名 | 类型 | 标签 | 说明 |
|--------|------|------|------|
| syqotnumber | TEXT | 报价编号 | 自动生成 Q-YYYYMMDD-XXX |
| syqotstatus | SELECT | 状态 | DRAFT=草稿, SENT=已发送, REVIEWING=客户审核中, APPROVED=已通过, REJECTED=已拒绝 |
| syqotdate | DATE | 报价日期 | |
| syqotexpiry | DATE | 有效期至 | |
| syqottotal | NUMBER | 总金额 | |
| syqotdiscount | NUMBER | 折扣(%) | |
| syqotfinalamt | NUMBER | 最终金额 | |
| syqotmemo | TEXT | 备注 | 长文本 |

注意：付款条件（syqotpayterms）和有效期至（syqotvaliduntil）已有，不用重复创建。

#### 1c. 合同 (contract) id=98380c32-2a4f-4d0d-a644-5501773ba30d
| 字段名 | 类型 | 标签 | 说明 |
|--------|------|------|------|
| syctrnumber | TEXT | 合同编号 | |
| syctramount | NUMBER | 合同金额 | |
| syctrpaid | NUMBER | 已回款金额 | |
| syctrpending | NUMBER | 待回款金额 | 合同金额 - 已回款金额 |
| syctrsigndate | DATE | 签约日期 | |
| syctrdeliverydate | DATE | 交付日期 | |
| syctrstatus | SELECT | 状态 | PENDING=待签约, ACTIVE=执行中, DELIVERED=交付完成, CLOSED=已结项 |
| syctrterms | TEXT | 付款条款 | 长文本，如 "30%预付+40%中期+30%尾款" |

**然后删除这两个废弃字段**：syctrstartdatev2, syctrenddatev2

#### 1d. 产品 (product) id=da233d4a-0bda-4540-b7c5-cb8eb9af3924
| 字段名 | 类型 | 标签 | 说明 |
|--------|------|------|------|
| syprdcategory | SELECT | 分类 | AI_CUSTOM=AI算法定制, DATA_LABEL=数据标注, MODEL_TRAIN=模型训练, DEPLOY=部署运维, CONSULT=咨询 |
| syprdtechstack | TEXT | 技术栈 | 如 "PyTorch, TensorFlow, ONNX" |
| syprddelivery | SELECT | 交付形式 | API=API服务, SDK=SDK, PRIVATE=私有部署, REPORT=报告 |

#### 1e. 公司 (company) id=a59775b2-0b62-4b46-98ec-c88302621924
| 字段名 | 类型 | 标签 | 说明 |
|--------|------|------|------|
| sycrmlevel | SELECT | 客户等级 | S=S级, A=A级, B=B级, C=C级, D=D级 |
| sycrmsource | SELECT | 客户来源 | SELF=自拓, INTRO=介绍, EXPO=展会, WEB=网络, DOUYIN=抖音, OTHER=其他 |
| sycrmindustry | SELECT | 所属行业 | MANUFACTURE=制造, TRADE=贸易, SERVICE=服务, IT=IT, OTHER=其他 |
| sycrmstatus | SELECT | 客户状态 | POTENTIAL=潜在, FOLLOWING=跟进中, COOPERATING=合作中, LOST=流失 |
| sycrmwechat | TEXT | 微信公众号 | |
| sycrmdouyin | TEXT | 抖音号 | |
| sycrmxiaohongshu | TEXT | 小红书号 | |

### Step 2: 建立对象间关系
REST API 创建关系：PUT /rest/metadata/relations 或 POST /rest/metadata/relations

需要以下 RELATION 字段：
| 关系 | 源对象 | 目标对象 | 字段名 | 标签 |
|------|--------|----------|--------|------|
| 项目→客户公司 | project | company | sypjtcompany | 客户公司 |
| 项目→客户联系人 | project | person | sypjtcontact | 客户联系人 |
| 项目→负责人 | project | WorkspaceMember | sypjtowner | 负责人 |
| 报价→项目 | quote | project | syqotproject | 所属项目 |
| 报价→客户公司 | quote | company | syqotcompany | 客户公司 |
| 合同→项目 | contract | project | syctrproject | 所属项目 |
| 合同→报价 | contract | quote | syctrquote | 关联报价 |
| 合同→客户公司 | contract | company | syctrcompany | 客户公司 |

注意：REST 创建 RELATION 字段的 API 格式需要确认。如果 REST 不行，用 GraphQL mutation:
mutation { createOneRelationMetadata(input: { relation: { sourceObjectMetadataId: "...", targetObjectMetadataId: "...", sourceFieldMetadataName: "sypjtcompany", sourceFieldLabel: "客户公司", targetFieldMetadataName: "...", targetFieldLabel: "..." } }) { id } }

具体 API 调用方式，先打个 GET /rest/metadata/objects 看看返回格式。

## 输出规范
- 每完成一个字段/关系就打印 "✓ 字段名 created"
- 全部完成后打印 "=== DONE ==="
- 如果 API 返回错误，打印 "✗ 字段名: error 内容" 不要继续，停在这个步骤
