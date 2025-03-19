// 定义链表节点
interface LinkedListNode<T> {
    id: string
    data: T
    next: LinkedListNode<T> | null
    prev: LinkedListNode<T> | null
}

export class TaskQueue<T> {
    private map: Map<string, LinkedListNode<T>> // 用于 O(1) 通过 ID 查找任务
    private head: LinkedListNode<T> | null // 头部指针（最早加入的任务）
    private tail: LinkedListNode<T> | null // 尾部指针（最新加入的任务）

    constructor(initialTasks?: Map<string, T>) {
        this.map = new Map()
        this.head = null
        this.tail = null

        if (initialTasks) {
            for (const [id, data] of initialTasks) {
                this.enqueue(id, data)
            }
        }
    }

    // 添加任务（O(1)）
    enqueue(id: string, data: T) {
        if (this.has(id)) {
            this.remove(id)
        }

        const node: LinkedListNode<T> = { id, data, next: null, prev: this.tail }

        if (this.tail) {
            this.tail.next = node // 连接旧尾部
        } else {
            this.head = node // 如果是第一个节点，则更新 head
        }

        this.tail = node
        this.map.set(id, node)
    }

    // 取出最早的任务（O(1)）
    dequeue(): T | null {
        if (!this.head) return null

        const node = this.head
        this.head = node.next

        if (this.head) {
            this.head.prev = null
        } else {
            this.tail = null
        }

        this.map.delete(node.id)
        return node.data
    }

    // 通过 ID 删除任务（O(1)）
    remove(id: string): boolean {
        const node = this.map.get(id)
        if (!node) return false

        if (node.prev) {
            node.prev.next = node.next
        } else {
            this.head = node.next // 删除的是头部
        }

        if (node.next) {
            node.next.prev = node.prev
        } else {
            this.tail = node.prev // 删除的是尾部
        }

        this.map.delete(id)
        return true
    }

    // 通过 ID 获取任务（O(1)）
    getTask(id: string): T | undefined {
        return this.map.get(id)?.data
    }

    // 通过id更新任务
    update(id: string, data: T): boolean {
        const node = this.map.get(id);
        if (!node) return false;

        node.data = data; // 直接修改链表节点的数据
        return true;
    }

    has(id: string): boolean {
        return this.map.has(id);
    }

    peek(): T | null {
        return this.head?.data ?? null;
    }

    clear(): void {
        this.map.clear();
        this.head = null;
        this.tail = null;
    }

    // 获取当前队列大小
    get size(): number {
        return this.map.size
    }

    get queue(): T[] {
        const tasks: T[] = []
        let current = this.head

        while (current) {
            tasks.push(current.data)
            current = current.next
        }

        return tasks
    }
}
