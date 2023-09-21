import _ from 'lodash';
import React from 'react';
import SearchRows from '/client/modules/karar/containers/search_rows';

import {versions, models} from '/lib/configs/karar/data_models';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nPages: props.nPages || 1
    };
    this.onScroll = _.throttle(() => {
      this._onScroll();
    }, 100);
    this.styles = {
      scroller: {overflowY: 'scroll', overflowX: 'scroll', background: 'white', borderRadius: '0', boxShadow: 'none'}
    }
  }

  componentDidMount() {
    // console.log('SearchRowsView did mount');
    this.timeoutScroll = setInterval(this.onScroll, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timeoutScroll);
  }

  componentWillUpdate(nextProps, nextState) {
    if (!_.isEqual(this.props.es, nextProps.es)) {
      this.setState({nPages: 0});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nPages === 0)
      this.setState({nPages: 1});
  }

  _onScroll() {
    const scrollerHeight = $(this.refs['scroller']).height();
    const scrollerPosition = this.refs['scroller'] && this.refs['scroller'].scrollTop;
    const contentHeight = $(this.refs['content']).height();

    let maxPages;
    if (this.props.count)
      maxPages = Math.ceil(this.props.count / this.props.pageSize);

    if (scrollerPosition > contentHeight - scrollerHeight - 50 ||
      scrollerHeight > contentHeight) {
      if (maxPages !== undefined && this.state.nPages < maxPages) {
        this.setState({nPages: this.state.nPages + 1});
      }
    }
  }

  hideIdenticalTitles() {
    let rowTitle;
    $(this.refs['content']).find('> tbody > tr > th:visible').each(function () {
      if (rowTitle === this.innerHTML)
        $(this).hide();
      else
        rowTitle = this.innerHTML;
    });
  }

  render() {
    let model = models[_.last(versions)];
    let table = this.props.table;
    let sortedColumns = _.sortBy(_.keys(model.tables[table].columns), (column) => {
      return model.tables[table].columns[column].position;
    });
    let groups = _.reduce(sortedColumns, (groups, column) => {
      let group = model.tables[table].columns[column].group;
      if (groups.length === 0 || group !== groups[groups.length-1].name)
        groups.push({name: group, colSpan: 1});
      else
        groups[groups.length-1].colSpan += 1;
      return groups;
    }, []);
    let groupBorders = _.reduce(_.dropRight(groups), (borders, group) => {
      borders[borders.length + group.colSpan - 1] = true;
      return borders;
    }, []);
    // return (<HotTable
    //     ref="hotTableComponent"
    //     className={!isPrivate ? 'handsontable-readonly' : ''}
    //     style={{ marginTop: -1, height: `calc(100vh - ${isPrivate ? 20 : 15}em)`, overflow: 'hidden', backgroundColor: '#EEE' }}
    //     settings={{
    //         licenseKey: "non-commercial-and-evaluation",
    //         data: rowData,
    //         readOnly: !isPrivate,
    //         contextMenu: isPrivate,
    //         rowHeaders: true,
    //         colHeaders: columns,
    //         outsideClickDeselects: false,
    //         afterChange: (changes) => {
    //             if (changes) {
    //                 const data = this.refs['hotTableComponent'] && this.refs['hotTableComponent'].hotInstance.getData() || undefined;
    //                 if (data && !this.state.dataEdited) this.setState({ dataEdited: true });
    //                 this.contributionDataEdited = data;
    //             }
    //         }
    //     }}
    // >
    //     {columns.map((columnName, i) =>
    //         <HotColumn key={i} data={columnName}></HotColumn>
    //     )}
    // </HotTable>);
    return (
      <div ref="scroller" style={_.extend({}, this.styles.scroller, this.props.style)} onScroll={this.onScroll}>
        <table ref="content" className="ui very compact celled small table"
               style={{borderLeft: 'none', borderRight: 'none', borderTop: 'none'}}>
          <thead>
            <tr>
              {groups.map((group, i) =>
                <th key={i}
                    colSpan={group.colSpan}
                    style={_.extend({whiteSpace: 'nowrap', textAlign: "center"}, i > 0 ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  {group.name}
                </th>
              )}
            </tr>
            <tr>
              {sortedColumns.map((column, i) =>
                <th key={i}
                    style={_.extend({whiteSpace: 'nowrap', verticalAlign: 'bottom'}, groupBorders[i - 1] ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  {model.tables[table].columns[column].label}
                </th>
              )}
            </tr>
            <tr>
              {sortedColumns.map((column, i) =>
                <td key={i}
                    style={_.extend({whiteSpace: 'nowrap', verticalAlign: 'bottom'}, groupBorders[i - 1] ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  {model.tables[table].columns[column].type}
                  </td>
              )}
            </tr>
            <tr>
              {sortedColumns.map((column, i) =>
                <td key={i}
                    data-position={i < sortedColumns.length - 5 ? (i >= 5 ? "bottom center" : "bottom left") : "bottom right"}
                    data-tooltip={model.tables[table].columns[column].description}
                    style={_.extend({whiteSpace: 'nowrap', borderBottom: '1px solid #AAAAAA'}, groupBorders[i - 1] ? {borderLeft: '1px solid #AAAAAA'} : {})}>
                  <i>{column}</i>
                </td>
              )}
            </tr>
          </thead>
          {_.times(this.state.nPages, (i) =>
            <SearchRows
              key={i}
              es={this.props.es}
              pageSize={this.props.pageSize}
              pageNumber={i+1}
              columns={sortedColumns}
              groupBorders={groupBorders}
              onDidUpdate={this.hideIdenticalTitles.bind(this)}
            />
          )}
        </table>
      </div>
    );
  }

  renderData(item) {
    const isPrivate = item.summary && item.summary.contribution && item.summary.contribution._is_activated !== 'true';
    if (!this.state.contributionData && item && item.summary && item.summary.contribution)
      Meteor.call('esGetContribution', {index, id: item.summary.contribution.id, tables: ['sites', 'samples', 'specimens', 'experiments', 'measurements']}, (error, c) => {
        console.log('esGetContribution', error, c);
        if (!error && c)
          this.setState({ contributionData: c });
        else
          this.setState({ contributionData: {}, contributionDataError: error });
      });
    if (!this.state.contributionData)
      return (
        <div className="ui bottom attached segment" style={{overflow:'auto', height:`calc(100vh - ${isPrivate ? 19 : 14}em)`}}>
          <div className="ui inverted active dimmer">
            <div className="ui text loader">Loading Contribution Data</div>
          </div>
        </div>
      );
    if (this.state.dataLoading) {
      _.delay(() => this.setState({ dataLoading: false }));
      return (
        <div className="ui bottom attached segment" style={{overflow:'auto', height:`calc(100vh - ${isPrivate ? 19 : 14}em)`}}>
          <div className="ui inverted active dimmer">
          <div className="ui text loader">Loading Contribution Data</div>
        </div>
        </div>
      );
    }
    if (this.state.contributionDataError)
      return (
        <div className="ui bottom attached segment" style={{overflow:'auto', height:`calc(100vh - ${isPrivate ? 19 : 14}em)`}}>
          <div className="ui error message">
            <div className="header">Contribution Data Error</div>
            <p>{this.state.contributionDataError}</p>
          </div>
        </div>
    );
    if (!this.state.contributionData[this.state.dataLevel])
      return (
        <div className="ui bottom attached segment" style={{overflow:'auto', height:`calc(100vh - ${isPrivate ? 19 : 14}em)`}}>
          <div className="ui fluid warning message">
            <div className="ui center aligned huge basic segment">No Rows to Display</div>
          </div>
        </div>
      );
    const model = models[_.last(versions)];
    const table = model.tables[this.state.dataLevel];
    const modelColumns = _.sortBy(
      _.keys(table.columns), columnName => table.columns[columnName].position
    );
    const rowData = this.state.contributionData[this.state.dataLevel];
    const usedColumns = {};
    rowData.forEach(row => { _.keys(row).forEach(column => { usedColumns[column] = true; })});
    const columns = modelColumns.filter(x => usedColumns[x]);
    return (
      <HotTable
        ref="hotTableComponent"
        className={!isPrivate ? 'handsontable-readonly' : ''}
        style={{marginTop: -1, height:`calc(100vh - ${isPrivate ? 20 : 15}em)`, overflow: 'hidden', backgroundColor: '#EEE' }}
        settings={{
          licenseKey: "non-commercial-and-evaluation",
          data: rowData,
          readOnly: !isPrivate,
          contextMenu: isPrivate,
          rowHeaders: true,
          colHeaders: columns,    
          outsideClickDeselects: false,
          afterChange: (changes) => {
            if (changes) {
              const data = this.refs['hotTableComponent'] && this.refs['hotTableComponent'].hotInstance.getData() || undefined;
              if (data && !this.state.dataEdited) this.setState({ dataEdited: true });
              this.contributionDataEdited = data;
            }
          }
        }}
      >
        {columns.map((columnName, i) => 
          <HotColumn key={i} data={columnName}></HotColumn>
        )}
      </HotTable>
    );
  }

}
