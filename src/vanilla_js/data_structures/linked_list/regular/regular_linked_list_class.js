// external imports

// internal imports
import RegularLinkedListNodeClass from './regular_linked_list_node_class';

// implementation
class RegularLinkedListClass {
    #head = null;
    #count = 0;

    #comparator = (first, second) => first === second;

    constructor(comparator) {
        this.#comparator = comparator;
    }

    getElementAt(index) {
        if (index >= 0 && index <= this.#count) {
            let node = this.#head;

            for (let nodeCounter = 0; nodeCounter < index && node !== null; nodeCounter++) {
                node = node.next;
            }

            return node;
        }

        return null;
    }

    indexOf(element) {
        let current = this.#head;

        for (let nodeCounter = 0; nodeCounter < this.#count && current !== null; nodeCounter++) {
            if (this.#comparator(element, current.element)) {
                return nodeCounter;
            }

            current = current.next;
        }

        return -1;
    }

    push(element) {
        const node = new RegularLinkedListNodeClass(element);

        if (this.#head == null) {
            this.#head = node;
        } else {
            let current = this.#head;

            while (current.next !== null) {
                current = current.next;
            }

            current.next = node;
        }

        this.#count++;
    }

    removeAt(index) {
        if (index >= 0 && index < this.#count) {
            let current = this.#head;

            if (index === 0) {
                this.#head = current.next;
            } else {
                const previous = this.getElementAt(index - 1);
                current = previous.next;
                previous.next = current.next;
            }

            this.#count--;
            return current.element;
        }

        return null;
    }

    insert(element, index) {
        if (index >= 0 && index <= this.#count) {
            const node = new RegularLinkedListNodeClass(element);

            if (index === 0) {
                node.next = this.head;
                this.#head = node;
            } else {
                const previous = this.getElementAt(index - 1);

                node.next = previous.next;
                previous.next = node;
            }

            this.#count++;
            return node;
        }

        return null;
    }

    remove(element) {
        const index = this.indexOf(element);
        return this.removeAt(index);
    }

    toString() {
        if (this.#head == null) {
            return '';
        }

        let objString = `${this.#head.element}`;
        let current = this.#head.next;

        for (let nodeCounter = 1; nodeCounter < this.size() && current !== null; nodeCounter++) {
            objString = `${objString},${current.element}`;
            current = current.next;
        }

        return objString;
    }

    size() {
        return this.#count;
    }

    isEmpty() {
        return this.size() === 0;
    }

    get head() {
        return this.#head;
    }
}
