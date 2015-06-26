'use strict';
/**
 * @file
 * Currently the main entrypoint served on /work.
 * Provides the work view for the enduser.
 */
import React from 'react';

// import components
// import {WorkDisplay} from 'dbc-react-workview';
// import Loader from '../Loader.component.js';
// import reflux actions and stores
import workAction from '../../actions/Work.action.js';
import workStore from '../../stores/Work.store.js';
import coverImageStore from '../../stores/CoverImage.store.js';

const Work = React.createClass({
  propTypes: {
    pid: React.PropTypes.string,
    work: React.PropTypes.object,
    coverImages: React.PropTypes.object
  },

  getInitialState() {
    return {
      pid: this.props.pid,
      work: workStore.getStore(),
      coverImages: {images: new Map()}
    };
  },

  getWork() {
    let result = {
      pid: this.state.pid
    };
    workAction(result);
  },

  updateCoverImages(coverImages) {
    this.setState({coverImages});
  },

  updateWork(work) {
    this.setState({work});
  },

  componentDidMount: function () {
    this.getWork();
    workStore.listen(this.updateWork);
    coverImageStore.listen(this.updateCoverImages);
  },

  render() {
    const {pid, work, coverImages} = this.state; // eslint-disable-line
    let general,
      title,
      creators,
      description,
      series,
      subjects,
      languages,
      specific,
      specifics;
    if (work.result.hasOwnProperty('general')) {
      general = work.result.general;
      title = general.title;
      if (general.hasOwnProperty('creators')) {
        creators = general.creators.map((creator) => {
          return (<div className='creator'>{creator}</div>);
        });
      }
      if (general.hasOwnProperty('description')) {
        description = general.description;
      }
      if (general.hasOwnProperty('series')) {
        series = general.series;
      }
      if (general.hasOwnProperty('subjects')) {
        subjects = general.subjects.map((subject) => {
          return (<div className='subject'>{subject}</div>);
        });
      }
      if (general.hasOwnProperty('languages')) {
        languages = general.languages.map((language) => {
          return (<div className='language'>{language}</div>);
        });
      }
      specific = work.result.specific;
      specifics = specific.map((tw) => {
        let identifiers = [];
        identifiers.push(tw.identifiers);
        let dates = tw.dates.map((date) => {
          return (<div className='date'>{date}</div>);
        });
        return (<div className='specific' data-identifiers={identifiers}>
        <div className='type'>{tw.type}</div>
        {dates}
        </div>);
      });
    }
    return (
      <div className='work' >
        <div className='general' >
          <div className='title'>{title}</div>
          <div className='creators'>{creators}</div>
          <div className='description'>{description}</div>
          <div className='series'>{series}</div>
          <div className='subjects'>{subjects}</div>
          <div className='languages'>{languages}</div>
        </div>
        {specifics}
      </div>
    );
  }
});

export default Work;