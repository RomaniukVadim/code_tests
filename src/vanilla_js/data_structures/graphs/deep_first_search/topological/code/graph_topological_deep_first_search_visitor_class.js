// external imports

// internal imports

// implementation
class GraphTopologicalDeepFirstSearchVisitorClass {
    #visitedVertexesIds = null;
    #deadEndVertexesIds = null;

    depthFirstSearch(adjacencyMatrix, vertexRowId = null) {
        let preparedVertexRowId = vertexRowId;

        if (preparedVertexRowId === undefined || preparedVertexRowId === null) {
            const vertexRowIds = adjacencyMatrix.rowsIdsIterator;
            preparedVertexRowId = vertexRowIds.next().value;
        }

        this.#visitedVertexesIds.push(preparedVertexRowId);

        for (const { element: { id: vertexId } } of adjacencyMatrix.getRowById(preparedVertexRowId)) {
            if (!this.#visitedVertexesIds.includes(vertexId)) {
                this.depthFirstSearch(adjacencyMatrix, vertexId, this.#visitedVertexesIds);
            }
        }

        this.#deadEndVertexesIds.add(preparedVertexRowId);
    }

    get visitedVertexesIds() {
        return this.#visitedVertexesIds.slice();
    }

    get deadEndVertexesIds() {
        return this.#deadEndVertexesIds;
    }

    constructor() {
        this.#visitedVertexesIds = [];
        this.#deadEndVertexesIds = new Set();
    }
}

// exports
module.exports = GraphTopologicalDeepFirstSearchVisitorClass;