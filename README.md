# id-queue

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/yvygyyth/id-queue)

快速增删改查的一个FIFO队列，用一点空间换取时间，先进先出。

> 📦 ​**源码地址**: https://github.com/yvygyyth/id-queue


### `TaskQueue` 方法文档：O(1) 时间复杂度操作详解

`TaskQueue` 是一个基于 **双向链表** 和 **哈希表** 实现的高性能队列，支持通过 ID 快速操作任务。以下方法的时间复杂度均为 `O(1)`，无论队列规模如何，操作耗时恒定。

---

## 安装
```bash
npm install id-queue
```

### 1. `enqueue(id: string, data: T)`  
**功能**: 添加任务到队列尾部。  
**时间复杂度**: `O(1)`  
**实现原理**:  
• **哈希表快速查重**：通过 `Map.has(id)` 检查 ID 是否存在（`O(1)`）。
• **链表尾部插入**：直接操作尾指针 (`tail`) 插入新节点，无需遍历链表。
• **自动去重**：若 ID 已存在，先调用 `remove(id)`（`O(1)`）删除旧节点。

**示例**:
```typescript
const queue = new TaskQueue<number>();
queue.enqueue("task1", 100); // 添加任务
queue.enqueue("task2", 200);
queue.enqueue("task1", 300); // 自动覆盖旧任务,顺序挪到末尾
```

---

### 2. `dequeue(): T | null`  
**功能**: 取出队列头部任务（最早添加的任务）。  
**时间复杂度**: `O(1)`  
**实现原理**:  
• **直接访问头节点**：通过 `head` 指针获取第一个节点。
• **更新头指针**：将 `head` 指向下一个节点，并断开原头节点的链接。
• **哈希表同步删除**：通过 `Map.delete()` 移除哈希表中的记录。

**示例**:
```typescript
const task = queue.dequeue(); // 取出 task1 (300)
console.log(task); // 输出: 300
```

---

### 3. `remove(id: string): boolean`  
**功能**: 通过 ID 删除任意位置的任务。  
**时间复杂度**: `O(1)`  
**实现原理**:  
• **哈希表定位节点**：通过 `Map.get(id)` 直接找到目标节点（`O(1)`）。
• **链表指针调整**：  
  • 若节点有前驱 (`prev`)，将前驱的 `next` 指向后继。
  • 若节点有后继 (`next`)，将后继的 `prev` 指向前驱。
• **边界处理**：若删除的是头节点或尾节点，同步更新 `head` 或 `tail`。

**示例**:
```typescript
queue.remove("task2"); // 删除中间任务
queue.remove("task1"); // 删除头部任务
```

---

### 4. `getTask(id: string): T | undefined`  
**功能**: 通过 ID 获取任务数据。  
**时间复杂度**: `O(1)`  
**实现原理**:  
• **哈希表直接查询**：通过 `Map.get(id)` 直接返回节点数据。

**示例**:
```typescript
const data = queue.getTask("task1"); // 300
```

---

### 5. `update(id: string, data: T): boolean`  
**功能**: 通过 ID 更新任务数据。  
**时间复杂度**: `O(1)`  
**实现原理**:  
• **哈希表定位节点**：通过 `Map.get(id)` 找到目标节点。
• **直接修改数据**：更新节点的 `data` 属性，无需调整链表结构。

**示例**:
```typescript
queue.update("task1", 500); // 更新任务数据
```

---

### 6. `has(id: string): boolean`  
**功能**: 检查任务是否存在。  
**时间复杂度**: `O(1)`  
**实现原理**:  
• **哈希表存在性检查**：通过 `Map.has(id)` 直接判断。

**示例**:
```typescript
if (queue.has("task1")) {
  // 任务存在
}
```

---

### 技术实现总结  
`TaskQueue` 通过以下设计保证所有操作均为 `O(1)`：  
1. **双向链表**：维护任务顺序，支持快速插入和删除。  
   • `head` 和 `tail` 指针直接访问两端节点。
   • 节点间通过 `prev` 和 `next` 指针快速调整链接。  
2. **哈希表**：提供 ID 到节点的映射，实现快速查找。  
   • `Map` 的 `get`、`set`、`delete` 操作均为 `O(1)`。  
3. **去重机制**：在 `enqueue` 时自动移除旧 ID 的任务，保证数据一致性。

---

### 适用场景  
• 需要频繁通过 ID 增删查改任务的场景（如任务调度系统）。
• 需要保证任务顺序且高效操作的场景（如消息队列）。
• 需要同时支持 FIFO 和随机删除的场景（如实时数据处理流水线）。