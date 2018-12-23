/* eslint-disable no-param-reassign, no-loop-func */

import get from 'lodash/get';
import set from 'lodash/set';

export const weightProps = {
  MONEY: 'MONEY',
  TIME: 'TIME',
};

class TFGraph {
  constructor(deals, departure, arrival, weightProp = weightProps.MONEY,
    filters = { bus: true, train: true, car: true }) {
    this.deals = deals;
    this.departure = departure;
    this.arrival = arrival;
    this.filters = filters;
    // TODO: throw error in case of
    this.weightProp = weightProp; // possible values (distance, time)
    this.createGraph = this.createGraph.bind(this);
    this.graph = this.createGraph();
  }

  getWeight({ cost, discount, duration: { h, m } }) {
    if (this.weightProp === weightProps.TIME) {
      return parseInt(h, 0) * 60 + parseInt(m, 0);
    }
    if (this.weightProp === weightProps.MONEY) {
      return cost - (cost * (discount || 0) / 100);
    }
    return 0;
  }

  createGraph() {
    const graph = {};
    this.deals.forEach(({
      departure, arrival, cost, discount, transport, reference, duration,
    }) => {
      if (this.filters[transport]) {
        const key = `${departure}.${arrival}`;
        let weight = this.getWeight({ cost, discount, duration });
        const currentWeight = get(graph, `${key}.weight`) || Infinity;
        const newTrans = currentWeight > weight ? transport : get(graph, `${key}.transport`);
        const newRef = currentWeight > weight ? reference : get(graph, `${key}.reference`);
        const price = currentWeight > weight ? cost : get(graph, `${key}.price`);
        const cDiscount = currentWeight > weight ? discount : get(graph, `${key}.discount`);
        const cDuration = currentWeight > weight ? duration : get(graph, `${key}.duration`);
        if (currentWeight) {
          weight = Math.min(weight, currentWeight);
        }
        set(graph, key, {
          weight,
          transport: newTrans,
          reference: newRef,
          price,
          discount: cDiscount,
          duration: cDuration,
        });
      }
    });
    return graph;
  }

  static findCheapestCost(costs) {
    return Object.keys(costs).reduce((cheapest, city) => {
      const cheapestCost = get(costs, `${cheapest}.cost`) || Infinity;
      if ((cheapest == null || costs[city].cost < cheapestCost)
          && !costs[city].visited) {
        cheapest = city;
      }
      return cheapest;
    },
    null);
  }

  calculateCheapestTrip() {
    if (!this.departure || !this.arrival || this.departure === this.arrival) {
      return alert('Please enter departure and arrival');
    }
    const costs = {
      [this.departure]: {
        cost: 0,
        visited: true,
        parent: null,
        transport: null,
        reference: null,
      },
      [this.arrival]: {
        cost: Infinity,
        visited: true,
        parent: null,
        transport: null,
        reference: null,
      },
    };
    const startNode = this.graph[this.departure];
    Object.keys(startNode).forEach((city) => {
      const {
        transport, reference, price, discount, duration,
      } = startNode[city];
      costs[city] = {
        cost: startNode[city].weight,
        visited: false,
        parent: this.departure,
        transport,
        reference,
        price,
        discount,
        duration,
      };
    });
    let cheapest = TFGraph.findCheapestCost(costs);
    while (cheapest) {
      const currentNode = this.graph[cheapest];
      Object.keys(currentNode).forEach((city) => {
        this.updateNodeValue(costs, currentNode, city, cheapest);
      });
      costs[cheapest].visited = true;
      cheapest = TFGraph.findCheapestCost(costs);
    }

    return this.calculateResult(costs);
  }

  calculateResult(costs) {
    if (costs[this.arrival].parent == null || costs[this.arrival] === Infinity) {
      return [];
    }
    const result = [{ ...costs[this.arrival], current: this.arrival }];
    let cNode = costs[this.arrival];
    while (cNode.parent) {
      result.push({ ...costs[cNode.parent], current: cNode.parent });
      cNode = costs[cNode.parent];
    }
    result.pop();
    return result.reverse();
  }

  updateNodeValue(costs, currentNode, city, cheapest) {
    const arrivalCost = get(costs, `${this.arrival}.cost`);
    const { weight } = currentNode[city];

    let currentCost = get(costs, `${city}.cost`);
    currentCost = currentCost === undefined ? Infinity : currentCost;

    const newCost = weight + costs[cheapest].cost;

    const cost = Math.min(currentCost, newCost);
    // Since all distances and time are positive no need to continue with path
    // that cost more than the current arrivalCost
    if (cost < arrivalCost) {
      const visited = currentCost < newCost && costs[city].visited;
      const parent = currentCost < newCost ? costs[city].parent : cheapest;
      const {
        transport, reference, duration, price, discount,
      } = currentCost < newCost ? costs[city] : currentNode[city];
      costs[city] = {
        cost, visited, parent, transport, reference, duration, price, discount,
      };
    }
  }
}

export default TFGraph;
