import React from 'react';
import SVG from 'react-svg-inline';
import '../main.scss';
import TFGraph, { weightProps } from '../../common/TFGraph';
import TypeAhead from '../TypeAhead';
import direction from '../../assets/icons/direction.svg';
import { TRANSPORT_COLORS, TRANSPORT_ICONS } from '../../common/Constants';
import Switch from '../Switch';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departure: null,
      arrival: null,
      weightProp: weightProps.MONEY,
      filterBus: true,
      filterTrain: true,
      filterCar: true,
      data: {},
      cities: [],
    };
  }

  componentWillMount() {
    fetch('/assets/response.json').then((resp) => {
      resp.json().then((data) => {
        this.tfGraph = new TFGraph(data.deals);
        const cities = Object.keys(this.tfGraph.graph);
        this.setState({ data, cities });
      });
    }).catch(() => {
      alert('an error occur while fetching data');
    });
    this.tripSteps = [];
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      departure, arrival, weightProp, filterBus, filterTrain, filterCar, data,
    } = nextState;
    if (departure && arrival) {
      if (departure === arrival) {
        alert('departure should be different than arrival.');
      } else if (!filterBus && !filterCar && !filterTrain) {
        alert('Please at least select one filter.');
      } else {
        const tfGraph = new TFGraph(data.deals, departure, arrival, weightProp,
          { bus: filterBus, train: filterTrain, car: filterCar });
        this.tripSteps = tfGraph.calculateCheapestTrip();
      }
    }
  }


  render() {
    const {
      departure, arrival, weightProp, filterBus, filterTrain, filterCar, cities, data,
    } = this.state;
    let totalTime = 0;
    let totalCost = 0;
    return (
      <div>
        <img
          src="../assets/images/background.png"
          className="background-img"
          alt="for the"
        />
        <h1 className="title">
          {'Trip Finder'}
          <SVG svg={direction} />
        </h1>
        <div className="app-container">
          <div className="controls">
            <Switch
              onValueChange={value => this.setState({ weightProp: value })}
              value={weightProp}
              choices={[
                { label: 'Cheapest', value: weightProps.MONEY },
                { label: 'Fastest', value: weightProps.TIME },
              ]}
            />
            <div style={{ marginBottom: 10 }}>
              <TypeAhead
                style={{ marginRight: 5 }}
                value={departure}
                onValueChange={val => this.setState({ departure: val })}
                placeholder="From Where?"
                suggestions={cities.filter(city => city !== arrival)}
              />
              <TypeAhead
                value={arrival}
                onValueChange={val => this.setState({ arrival: val })}
                placeholder="To Where?"
                suggestions={cities.filter(city => city !== departure)}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <label className="container-checkbox">Bus
                <input
                  type="checkbox"
                  checked={filterBus}
                  onChange={() => this.setState({ filterBus: !filterBus })}
                />
                <span className="checkmark" />
              </label>
              <label className="container-checkbox">Train
                <input
                  type="checkbox"
                  checked={filterTrain}
                  onChange={() => this.setState(
                    { filterTrain: !filterTrain },
                  )}
                />
                <span className="checkmark" />
              </label>
              <label className="container-checkbox">Car
                <input
                  type="checkbox"
                  checked={filterCar}
                  onChange={() => this.setState({ filterCar: !filterCar })}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
          {this.tripSteps && this.tripSteps.length > 0 && (
          <div className="trips controls">
            {this.tripSteps.map((step) => {
              totalCost += step.price;
              totalTime += parseInt(step.duration.h, 0) * 60 + parseInt(step.duration.m, 0);
              return (
                <div key={step.current} className="trip-box" style={{ order: 1 }}>
                  <div style={{ width: 30 }}>
                    <SVG svg={TRANSPORT_ICONS[step.transport]} />
                  </div>
                  <div style={{
                    width: 10, backgroundColor: TRANSPORT_COLORS[step.transport], height: 130, position: 'relative',
                  }}
                  >
                    <SVG style={{ position: 'absolute', top: -14, left: -3 }} svg={TRANSPORT_ICONS[`${step.transport}C`]} />
                    <SVG style={{ position: 'absolute', bottom: -14, left: -3 }} svg={TRANSPORT_ICONS[`${step.transport}C`]} />
                  </div>
                  <div style={{ marginLeft: 20 }}>
                    <h3>{step.parent}</h3>
                    <span style={{ fontWeight: 'bold' }}>{`${step.duration.h} h ${step.duration.m} min `}</span>
                    <span>{`by ${step.transport}`}</span>
                    <p>{`${data.currency}  ${step.price}`}</p>
                    <p className="badge" style={{ backgroundColor: TRANSPORT_COLORS[step.transport] }}>
                      {`ref: ${step.reference}`}
                    </p>
                    <h3>{step.current}</h3>
                  </div>
                </div>
              );
            })}
            {totalTime > 0 && totalCost > 0 && (
            <div className="trip-box" style={{ order: 0, justifyContent: 'center' }}>
              <span style={{ fontSize: 14 }}>
                Costs
                <span style={{ fontSize: 16, fontWeight: 900 }}>{` ${data.currency} ${totalCost} `}</span>
                {' in'}
                <span style={{ fontSize: 16, fontWeight: 900 }}>
                  {` ${parseInt(totalTime / 60, 0)} h ${parseInt(totalTime % 60, 0)} min `}
                </span>
              </span>
            </div>
            )}
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
