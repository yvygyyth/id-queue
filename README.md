# id-queue

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/yvygyyth/id-queue)

基于 **双向链表 + 哈希表** 实现的高性能任务队列，所有操作时间复杂度均为 `O(1)`，支持通过 ID 快速操作任务，适用于需要高频增删改查的场景。

---

## 安装
```bash
npm install id-queue
```

## 核心特性
| 特性                | 描述                                                                 |
|---------------------|----------------------------------------------------------------------|
| **时间复杂度**      | 所有操作 (`enqueue`/`dequeue`/`remove`/`update` 等) 均为 `O(1)`       |
| **自动去重**        | 插入重复 ID 的任务时，自动移除旧任务并追加到队列尾部                  |
| **双向操作**        | 支持从头部取出任务 (`dequeue`)，或通过 ID 删除任意位置任务 (`remove`) |
| **内存效率**        | 用额外空间（哈希表）换取时间效率，总空间复杂度为 `O(2n)`              |

---

## 完整 API 文档

### 构造函数
```typescript
constructor(initialTasks?: Map<string, T>)
```
• **功能**：初始化队列，可预加载任务
• **参数**：
  • `initialTasks`：可选，包含初始任务的 Map 对象，`key` 为任务 ID，`value` 为任务数据
• **示例**：
  ```typescript
  // 空队列
  const queue1 = new TaskQueue<string>();
  
  // 预加载任务 (ID → 数据)
  const initialTasks = new Map([
    ["task1", "Process payment"],
    ["task2", "Generate report"]
  ]);
  const queue2 = new TaskQueue(initialTasks);
  ```

---

### 核心方法

#### 1. `enqueue(id: string, data: T)`
• **功能**：添加任务到队列尾部
• **去重逻辑**：若 ID 已存在，先移除旧任务再追加新任务
• **示例**：
  ```typescript
  queue.enqueue("task3", "Send email");
  queue.enqueue("task2", "Updated report"); // 旧 task2 被移除，新 task2 追加到末尾
  ```

#### 2. `dequeue(): T | null`
• **功能**：取出队列头部任务（先进先出）
• **返回值**：任务数据，队列为空时返回 `null`
• **示例**：
  ```typescript
  const task = queue.dequeue(); // 取出最早的任务
  ```

#### 3. `remove(id: string): boolean`
• **功能**：通过 ID 删除任务
• **返回值**：是否成功删除
• **示例**：
  ```typescript
  if (queue.remove("expired_task")) {
    console.log("任务已移除");
  }
  ```

#### 4. `update(id: string, data: T): boolean`
• **功能**：更新任务数据（不改变队列顺序）
• **返回值**：是否找到并更新任务
• **示例**：
  ```typescript
  queue.update("task1", { priority: "High" });
  ```

#### 5. `getTask(id: string): T | undefined`
• **功能**：通过 ID 获取任务数据
• **示例**：
  ```typescript
  const data = queue.getTask("task1"); // 返回 undefined 如果不存在
  ```

#### 6. `has(id: string): boolean`
• **功能**：检查任务是否存在
• **示例**：
  ```typescript
  if (queue.has("task1")) {
    // 执行任务相关逻辑
  }
  ```

#### 7. `peek(): T | null`
• **功能**：查看队列头部任务数据（不移除）
• **示例**：
  ```typescript
  const nextTask = queue.peek(); // 预览下一个要处理的任务
  ```

#### 8. `clear(): void`
• **功能**：清空队列
• **示例**：
  ```typescript
  queue.clear(); // 重置队列状态
  ```

---

### 属性访问器

#### `size: number`
• **功能**：获取当前队列任务数量
• **示例**：
  ```typescript
  console.log(`当前队列长度: ${queue.size}`);
  ```

#### `queue: T[]`
• **功能**：按顺序获取队列数据快照（从旧到新）
• **性能**：时间复杂度 `O(n)`，空间复杂度 `O(n)`
• **示例**：
  ```typescript
  const allTasks = queue.queue; // 返回数据数组
  ```

---

## 性能对比
| 操作          | 本实现 | 数组实现 | 说明                        |
|---------------|--------|----------|-----------------------------|
| `enqueue`      | O(1)   | O(n)     | 数组需遍历检查重复 ID        |
| `dequeue`      | O(1)   | O(1)     | 数组的 shift 操作是 O(n)     |
| `remove`       | O(1)   | O(n)     | 数组需遍历查找元素位置        |
| `get/update`   | O(1)   | O(n)     | 数组需遍历查找元素            |

---

## 使用场景
1. **任务调度系统**  
   ```typescript
   // 添加任务
   scheduler.enqueue("job_001", { type: "email", to: "user@example.com" });
   
   // 工作线程循环处理
   while (scheduler.size > 0) {
     const task = scheduler.dequeue();
     executeTask(task);
   }
   ```

2. **实时数据流水线**  
   ```typescript
   // 数据到达时更新处理
   dataStream.on("data", (id, payload) => {
     if (queue.has(id)) {
       queue.update(id, payload); // 更新未处理的数据
     } else {
       queue.enqueue(id, payload);
     }
   });
   ```

3. **用户操作队列**  
   ```typescript
   // 撤销/重做功能实现
   class HistoryTracker {
     private queue = new TaskQueue<Command>();
     private maxSize = 100;
   
     add(command: Command) {
       if (this.queue.size >= this.maxSize) {
         this.queue.dequeue(); // 移除旧操作
       }
       this.queue.enqueue(command.id, command);
     }
   }
   ```
---

[查看完整源码](https://github.com/yvygyyth/id-queue) | [提交 Issue](https://github.com/yvygyyth/id-queue/issues)