import React, { Fragment } from 'react';
import SVG from 'react-svg-inline';
import TFGraph, { weightProps } from '../../common/TFGraph';
import TypeAhead from '../TypeAhead';
import direction from '../../assets/icons/direction.svg';
import { TRANSPORT_COLORS, TRANSPORT_ICONS } from '../../common/Constants';
import Switch from '../Switch';
import Checkbox from '../Checkbox';
import './home.scss';

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
      isLoading: false,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    fetch('/api/response.json').then((resp) => {
      resp.json().then((data) => {
        this.tfGraph = new TFGraph(data.deals);
        const cities = Object.keys(this.tfGraph.graph);
        this.setState({ data, cities });
        this.setState({ isLoading: false });
      });
    }).catch(() => {
      this.setState({ isLoading: false });
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
      departure, arrival, weightProp, filterBus, filterTrain, filterCar, cities, data, isLoading,
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
            {isLoading ? <h1 className="title">Loading Deals... </h1>
              : (
                <Fragment>
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
                    <Checkbox
                      isChecked={filterBus}
                      onChange={() => this.setState({ filterBus: !filterBus })}
                      name="Bus"
                    />
                    <Checkbox
                      isChecked={filterTrain}
                      onChange={() => this.setState({ filterTrain: !filterTrain })}
                      name="Train"
                    />
                    <Checkbox
                      isChecked={filterCar}
                      onChange={() => this.setState({ filterCar: !filterCar })}
                      name="Car"
                    />
                  </div>
                </Fragment>
              )}
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
                  <div
                    className="vertical-line"
                    style={{ backgroundColor: TRANSPORT_COLORS[step.transport] }}
                  >
                    <SVG className="point" style={{ top: -14 }} svg={TRANSPORT_ICONS[`${step.transport}C`]} />
                    <SVG className="point" style={{ bottom: -14 }} svg={TRANSPORT_ICONS[`${step.transport}C`]} />
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
            <div className="trip-box">
              <span>
                Costs
                <span>{` ${data.currency} ${totalCost} `}</span>
                {' in'}
                <span>{` ${parseInt(totalTime / 60, 0)} h ${parseInt(totalTime % 60, 0)} min `}</span>
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
