import { expect } from 'chai';
import TFGraph, { weightProps } from './TFGraph';
import data from '../api/response';

describe('TfGraph', () => {
  it('Should create the graph properly', () => {
    const tfGraph = new TFGraph(data.deals);
    const cities = Object.keys(tfGraph.graph);
    expect(cities).to.be.a('array');
    expect(cities).to.have.lengthOf(16);
    expect(cities).include('Paris');
    expect(cities).include('London');
    expect(cities).include('Warsaw');

    expect(Object.keys(tfGraph.graph.Paris)).to.have.lengthOf(3);
    expect(Object.keys(tfGraph.graph.Paris)).include('London');
    expect(Object.keys(tfGraph.graph.Paris)).include('Brussels');
    expect(Object.keys(tfGraph.graph.Paris)).include('Madrid');
  });

  it('Should calculate cheapest correctly', () => {
    const tfGraph = new TFGraph(data.deals, 'London', 'Moscow');
    const results = tfGraph.calculateCheapestTrip();
    expect(results).to.have.lengthOf(4);
    expect(results[2]).to.deep.equal({
      cost: 70,
      visited: true,
      parent: 'Brussels',
      transport: 'bus',
      reference: 'BBP0545',
      duration: {
        h: '05',
        m: '45',
      },
      price: 40,
      discount: 50,
      current: 'Prague',
    });
    expect(results[results.length - 1].cost).equal(100);
  });
  it('Should calculate cheapest cost and path correctly', () => {
    const tfGraph = new TFGraph(data.deals, 'London', 'Kiev',
      weightProps.MONEY);
    const results = tfGraph.calculateCheapestTrip();
    expect(results).to.have.lengthOf(5);
    expect(results[2]).to.deep.equal({
      cost: 70,
      visited: true,
      parent: 'Brussels',
      transport: 'bus',
      reference: 'BBP0545',
      duration: {
        h: '05',
        m: '45',
      },
      price: 40,
      discount: 50,
      current: 'Prague',
    });
    expect(results[results.length - 1].cost).equal(120);
  });
  it('Should calculate shortest distance and path correctly', () => {
    const tfGraph = new TFGraph(data.deals, 'Lisbon', 'Kiev', weightProps.TIME);
    const results = tfGraph.calculateCheapestTrip();
    expect(results).to.have.lengthOf(4);
    expect(results[2]).to.deep.equal(
      {
        cost: 810,
        visited: true,
        parent: 'Geneva',
        transport: 'train',
        reference: 'TGB0445',
        duration: {
          h: '04',
          m: '45',
        },
        price: 160,
        discount: 0,
        current: 'Budapest',
      },
    );
    expect(results[results.length - 1].cost).equal(1125);
  });
  it('Should calculate cheapest with path correctly with transport filter', () => {
    const tfGraph = new TFGraph(data.deals, 'Madrid', 'Istanbul',
      weightProps.MONEY, { train: true, car: true });

    const results = tfGraph.calculateCheapestTrip();

    expect(results).to.have.lengthOf(4);
    expect(results[2]).to.deep.equal({
      cost: 320,
      visited: true,
      parent: 'Rome',
      transport: 'car',
      reference: 'CRA0430',
      duration: {
        h: '04',
        m: '30',
      },
      price: 120,
      discount: 0,
      current: 'Athens',
    });
    expect(results[results.length - 1].cost).equal(440);
    expect(results.filter(obj => obj.transport === 'bus')).to.have.length(0);
  });
});
